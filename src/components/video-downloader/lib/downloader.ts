/** Segmented download engine — the IDM-like part.
 *
 *  What it actually does:
 *
 *  1. **Probes** the URL with a one-byte ranged GET. A `206` plus a
 *     `Content-Range` header means the server will serve arbitrary byte ranges,
 *     which is the precondition for everything below. (A one-byte GET rather
 *     than `HEAD`, because plenty of proxies mishandle `HEAD`.)
 *  2. **Splits** the file into N ranges and fetches them concurrently. On a
 *     high-latency link this is the whole win: one TCP stream is limited by
 *     round-trip time, several are not.
 *  3. **Writes** each segment straight to disk at its own offset via the File
 *     System Access API's positional `write({type:'write', position})`. That is
 *     what makes out-of-order parallel writing possible without holding the
 *     file in memory.
 *  4. **Pauses / resumes** by aborting in-flight segments and restarting each
 *     unfinished one from the byte it stopped at — nothing already written is
 *     re-fetched.
 *  5. **Retries** a failed segment on its own, with backoff, instead of failing
 *     the whole file.
 *
 *  Where it deliberately refuses to accelerate:
 *
 *  - The server says `Accept-Ranges: none` (our ZIP archives are generated per
 *    request, so parallel connections would assemble several *different*
 *    archives into one corrupt file).
 *  - No File System Access API *and* the file is large. Buffering a 2 GB video
 *    in a tab to save it as a Blob is worse than a plain browser download, so
 *    we hand it back to the browser, which streams to disk properly.
 */

export type TaskStatus =
  | "queued"
  | "probing"
  | "downloading"
  | "paused"
  | "finishing"
  | "done"
  | "error"
  | "cancelled";

export interface DownloadStats {
  received: number;
  total: number | null;
  speed: number;
  eta: number | null;
  connections: number;
  accelerated: boolean;
}

export interface ProbeResult {
  size: number | null;
  acceptsRanges: boolean;
  contentType: string | null;
}

/** How the file will be saved, decided once up front. */
export type Strategy = "segmented-disk" | "segmented-memory" | "browser";

export const DEFAULT_SEGMENTS = 4;
export const MAX_SEGMENTS = 8;
/** Below this, extra connections cost more in overhead than they save. */
export const MIN_SEGMENTED_SIZE = 4 * 1024 * 1024;
/** Hard ceiling for the in-memory fallback. Above it, let the browser do it. */
export const MEMORY_LIMIT = 256 * 1024 * 1024;
const MAX_SEGMENT_RETRIES = 3;
const SPEED_WINDOW_MS = 3000;

// --- File System Access API -------------------------------------------------
// Typed locally: these are still absent from some TS DOM lib versions, and a
// hand-written minimal surface is better than `any` scattered around.

interface WritableFileStream {
  write(data: Blob | BufferSource | { type: "write"; position: number; data: BufferSource }): Promise<void>;
  close(): Promise<void>;
  abort?(reason?: unknown): Promise<void>;
}

interface FileSystemHandleLike {
  createWritable(options?: { keepExistingData?: boolean }): Promise<WritableFileStream>;
}

interface SaveFilePickerWindow {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<FileSystemHandleLike>;
}

export function supportsFileSystemAccess(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as unknown as SaveFilePickerWindow).showSaveFilePicker === "function" &&
    // The picker throws in cross-origin iframes; treat that as unsupported.
    window.self === window.top
  );
}

/** Ask the server what it will allow, without downloading the file. */
export async function probe(url: string, signal?: AbortSignal): Promise<ProbeResult> {
  const response = await fetch(url, {
    headers: { Range: "bytes=0-0" },
    signal,
    credentials: "same-origin",
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`Probe failed with ${response.status}`);
  }
  // Drain the single byte so the connection can be reused.
  await response.arrayBuffer().catch(() => undefined);

  const acceptRanges = (response.headers.get("accept-ranges") ?? "").toLowerCase();
  const contentRange = response.headers.get("content-range");

  let size: number | null = null;
  if (contentRange && contentRange.includes("/")) {
    const tail = contentRange.split("/").pop();
    if (tail && tail !== "*" && /^\d+$/.test(tail)) size = Number(tail);
  }
  if (size === null) {
    const length = response.headers.get("content-length");
    if (length && /^\d+$/.test(length) && response.status === 200) size = Number(length);
  }

  const acceptsRanges =
    acceptRanges !== "none" && (response.status === 206 || acceptRanges === "bytes");

  return {
    size,
    acceptsRanges,
    contentType: response.headers.get("content-type"),
  };
}

export function chooseStrategy(probeResult: ProbeResult): Strategy {
  const { size, acceptsRanges } = probeResult;
  if (!acceptsRanges || size === null || size < MIN_SEGMENTED_SIZE) return "browser";
  if (supportsFileSystemAccess()) return "segmented-disk";
  if (size <= MEMORY_LIMIT) return "segmented-memory";
  return "browser";
}

export function segmentCount(size: number, requested = DEFAULT_SEGMENTS): number {
  const capped = Math.max(1, Math.min(MAX_SEGMENTS, requested));
  // Never create a segment smaller than the threshold that justified splitting.
  return Math.max(1, Math.min(capped, Math.floor(size / MIN_SEGMENTED_SIZE) || 1));
}

interface Segment {
  index: number;
  start: number;
  end: number;
  written: number;
  done: boolean;
}

interface EngineCallbacks {
  onStatus: (status: TaskStatus, detail?: string) => void;
  onStats: (stats: DownloadStats) => void;
}

/** Saves the browser's own download UI the trouble; used for the `browser` strategy. */
export function browserDownload(url: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export class SegmentedDownload {
  readonly url: string;
  readonly filename: string;

  private segments: Segment[] = [];
  private controllers = new Map<number, AbortController>();
  private sink: WritableFileStream | null = null;
  private buffers = new Map<number, Uint8Array<ArrayBuffer>[]>();
  private strategy: Strategy = "browser";
  private total: number | null = null;
  private received = 0;
  private samples: { at: number; bytes: number }[] = [];
  private status: TaskStatus = "queued";
  private cancelled = false;
  private callbacks: EngineCallbacks;
  private desiredSegments: number;

  constructor(
    url: string,
    filename: string,
    callbacks: EngineCallbacks,
    segments = DEFAULT_SEGMENTS,
  ) {
    this.url = url;
    this.filename = filename;
    this.callbacks = callbacks;
    this.desiredSegments = segments;
  }

  get currentStatus(): TaskStatus {
    return this.status;
  }

  private setStatus(status: TaskStatus, detail?: string) {
    this.status = status;
    this.callbacks.onStatus(status, detail);
  }

  private emit() {
    const now = Date.now();
    this.samples.push({ at: now, bytes: this.received });
    while (this.samples.length > 1 && now - this.samples[0]!.at > SPEED_WINDOW_MS) {
      this.samples.shift();
    }

    let speed = 0;
    if (this.samples.length > 1) {
      const first = this.samples[0]!;
      const last = this.samples[this.samples.length - 1]!;
      const seconds = (last.at - first.at) / 1000;
      if (seconds > 0) speed = (last.bytes - first.bytes) / seconds;
    }

    const remaining = this.total !== null ? this.total - this.received : null;
    this.callbacks.onStats({
      received: this.received,
      total: this.total,
      speed,
      eta: remaining !== null && speed > 0 ? Math.round(remaining / speed) : null,
      connections: this.controllers.size,
      accelerated: this.strategy !== "browser",
    });
  }

  /** Runs the whole download. Resolves when the file is saved. */
  async start(): Promise<void> {
    this.cancelled = false;
    this.setStatus("probing");

    const info = await probe(this.url);
    this.total = info.size;
    this.strategy = chooseStrategy(info);

    if (this.strategy === "browser") {
      // Not a failure: the browser streams to disk and shows its own progress.
      browserDownload(this.url, this.filename);
      this.received = this.total ?? 0;
      this.setStatus("done", "browser");
      this.emit();
      return;
    }

    if (this.strategy === "segmented-disk") {
      const picker = (window as unknown as SaveFilePickerWindow).showSaveFilePicker!;
      try {
        const handle = await picker({ suggestedName: this.filename });
        this.sink = await handle.createWritable({ keepExistingData: false });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          this.setStatus("cancelled");
          return;
        }
        // Picker unavailable or refused — fall back rather than dead-end.
        this.strategy =
          this.total !== null && this.total <= MEMORY_LIMIT ? "segmented-memory" : "browser";
        if (this.strategy === "browser") {
          browserDownload(this.url, this.filename);
          this.setStatus("done", "browser");
          return;
        }
      }
    }

    const size = this.total!;
    const count = segmentCount(size, this.desiredSegments);
    const chunk = Math.ceil(size / count);
    this.segments = Array.from({ length: count }, (_, index) => ({
      index,
      start: index * chunk,
      end: Math.min(size - 1, (index + 1) * chunk - 1),
      written: 0,
      done: false,
    }));

    await this.run();
  }

  /** Fetch every unfinished segment concurrently; used by start() and resume(). */
  private async run(): Promise<void> {
    this.setStatus("downloading");
    this.emit();

    const pending = this.segments.filter((s) => !s.done);
    const results = await Promise.allSettled(pending.map((s) => this.fetchSegment(s)));

    if (this.cancelled) return;
    if (this.status === "paused") return;

    const failure = results.find((r) => r.status === "rejected");
    if (failure) {
      this.setStatus("error", String((failure as PromiseRejectedResult).reason));
      return;
    }

    await this.finish();
  }

  private async fetchSegment(segment: Segment, attempt = 1): Promise<void> {
    if (this.cancelled || segment.done) return;

    const controller = new AbortController();
    this.controllers.set(segment.index, controller);

    const from = segment.start + segment.written;
    try {
      const response = await fetch(this.url, {
        headers: { Range: `bytes=${from}-${segment.end}` },
        signal: controller.signal,
        credentials: "same-origin",
      });
      if (response.status !== 206 || !response.body) {
        throw new Error(`Expected 206 for range request, got ${response.status}`);
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        await this.writeChunk(segment, value);
        segment.written += value.byteLength;
        this.received += value.byteLength;
        this.emit();
      }
      segment.done = true;
    } catch (error) {
      const aborted = (error as Error).name === "AbortError";
      // A pause aborts on purpose; keep the bytes and stop quietly.
      if (aborted || this.cancelled || this.status === "paused") return;

      if (attempt < MAX_SEGMENT_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
        return this.fetchSegment(segment, attempt + 1);
      }
      throw error;
    } finally {
      this.controllers.delete(segment.index);
    }
  }

  /*
   * `Uint8Array<ArrayBuffer>`, not a bare `Uint8Array`.
   *
   * TypeScript now makes typed arrays generic over their backing buffer, and
   * `BufferSource` only accepts one backed by an `ArrayBuffer` — a
   * `SharedArrayBuffer` cannot be handed to a file-system writer. Chunks here
   * always come from a fetch response stream, which is never shared, so the
   * narrower type is the accurate one rather than a cast that hides the
   * question.
   */
  private async writeChunk(segment: Segment, chunk: Uint8Array<ArrayBuffer>): Promise<void> {
    if (this.sink) {
      // Positional write: this is what lets four connections write to one file
      // out of order without buffering any of it.
      await this.sink.write({
        type: "write",
        position: segment.start + segment.written,
        data: chunk,
      });
      return;
    }
    const list = this.buffers.get(segment.index) ?? [];
    list.push(chunk);
    this.buffers.set(segment.index, list);
  }

  private async finish(): Promise<void> {
    this.setStatus("finishing");

    if (this.sink) {
      await this.sink.close();
      this.sink = null;
      this.setStatus("done");
      this.emit();
      return;
    }

    // Memory fallback: stitch the segments back together in order.
    const ordered: BlobPart[] = [];
    for (const segment of this.segments) {
      for (const chunk of this.buffers.get(segment.index) ?? []) {
        ordered.push(chunk as unknown as BlobPart);
      }
    }
    const blob = new Blob(ordered);
    this.buffers.clear();

    const objectUrl = URL.createObjectURL(blob);
    browserDownload(objectUrl, this.filename);
    // Revoke late: revoking immediately can cancel the save in some browsers.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);

    this.setStatus("done");
    this.emit();
  }

  pause(): void {
    if (this.status !== "downloading") return;
    this.setStatus("paused");
    for (const controller of this.controllers.values()) controller.abort();
    this.controllers.clear();
  }

  async resume(): Promise<void> {
    if (this.status !== "paused") return;
    await this.run();
  }

  async cancel(): Promise<void> {
    this.cancelled = true;
    for (const controller of this.controllers.values()) controller.abort();
    this.controllers.clear();
    this.buffers.clear();
    if (this.sink) {
      await this.sink.abort?.().catch(() => undefined);
      this.sink = null;
    }
    this.setStatus("cancelled");
  }
}
