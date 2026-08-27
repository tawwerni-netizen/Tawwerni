/** API client.
 *
 *  Every backend failure arrives as `{ error: { code, message } }`. This module
 *  turns that into an `ApiError` carrying the *code*, which the UI translates -
 *  the server's English string is only ever a last-resort fallback.
 */

import type {
  AnalyzeResponse,
  ApiErrorPayload,
  DownloadOptions,
  JobResponse,
  ProgressSnapshot,
} from "./types";

/*
 * Same-origin by design.
 *
 * The backend needs Python, FFmpeg, Redis and long-running workers, so it
 * lives on a separate machine — but the browser must never see that. A rewrite
 * in next.config.ts maps this path to it, which keeps every request first-party:
 * no CORS preflight, no third-party cookie rules, and the site-wide CSP stays
 * `connect-src 'self'` instead of being widened for an external host.
 */
export const API_BASE = "/api/vd";

const SESSION_KEY = "uvd.session.v1";

/** A random per-browser token that identifies *this browser's* downloads.
 *
 *  Ownership cannot key on the IP address: everyone behind one office or
 *  mobile-carrier NAT shares an address, and a phone moving between Wi-Fi and
 *  cellular changes one. This token is stable for the browser and unique to it.
 *
 *  It is a bearer capability, not an authentication credential — it grants
 *  access only to downloads created with it, which is exactly the scope of
 *  guest mode.
 */
function sessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let token = window.localStorage.getItem(SESSION_KEY);
    if (!token) {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      token = btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      window.localStorage.setItem(SESSION_KEY, token);
    }
    return token;
  } catch {
    // Private mode with storage disabled: the server falls back to grouping by
    // network address, which still works, just less precisely.
    return null;
  }
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryable: boolean;
  readonly retryAfter?: number;
  readonly maxItems?: number;

  constructor(payload: ApiErrorPayload, status: number) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.status = status;
    this.retryable = payload.retryable ?? false;
    this.retryAfter = payload.retry_after;
    this.maxItems = payload.max_items;
  }
}

export class NetworkError extends Error {
  readonly code = "network";
  constructor(message = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 60_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Passing the caller's signal straight through left the timeout inert — and
  // analyze always passes one, so the 70s cap never actually applied. Combine
  // them so either the caller or the timeout can abort.
  const signal =
    rest.signal && typeof AbortSignal.any === "function"
      ? AbortSignal.any([rest.signal, controller.signal])
      : (rest.signal ?? controller.signal);

  const token = sessionId();

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Session-Id": token } : {}),
        ...(rest.headers ?? {}),
      },
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new ApiError(
        { code: "extraction_timeout", message: "Request timed out" },
        504,
      );
    }
    throw new NetworkError((error as Error).message);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      const body = (await response.json()) as { error?: ApiErrorPayload };
      if (body?.error?.code) payload = body.error;
    } catch {
      // Not our envelope — a proxy error page, an HTML 502, or an empty body.
    }

    if (payload === null) {
      // A 5xx with no error envelope did not come from the application: the
      // API is unreachable and nginx (or the dev proxy) answered instead.
      // "We could not reach the server" is the honest message; "an unexpected
      // error occurred" would send the user hunting for a problem in the link.
      const unreachable = response.status >= 500;
      payload = {
        code: unreachable ? "network" : "internal_error",
        message: response.statusText || "Request failed",
        retryable: unreachable,
      };
    }
    throw new ApiError(payload, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function analyze(
  url: string,
  options: { offset?: number; limit?: number; refresh?: boolean; signal?: AbortSignal } = {},
): Promise<AnalyzeResponse> {
  const isPlaylistPage = options.offset !== undefined && options.offset > 0;
  return request<AnalyzeResponse>(isPlaylistPage ? "/playlists/analyze" : "/analyze", {
    method: "POST",
    body: JSON.stringify({
      url,
      offset: options.offset ?? 0,
      limit: options.limit ?? null,
      refresh: options.refresh ?? false,
    }),
    signal: options.signal,
    // Analysis of a large channel legitimately takes a while.
    timeoutMs: 70_000,
  });
}

export function createJob(
  url: string,
  options: DownloadOptions,
  selection?: number[],
): Promise<JobResponse> {
  const isBatch = Boolean(selection && selection.length > 0);
  return request<JobResponse>(isBatch ? "/playlists/download" : "/jobs", {
    method: "POST",
    body: JSON.stringify({
      url,
      options,
      selection: selection && selection.length ? selection : null,
    }),
    timeoutMs: 70_000,
  });
}

export function getJob(jobId: string): Promise<JobResponse> {
  return request<JobResponse>(`/jobs/${jobId}`);
}

export function getProgress(jobId: string): Promise<ProgressSnapshot> {
  return request<ProgressSnapshot>(`/jobs/${jobId}/progress`);
}

export function cancelJob(jobId: string): Promise<JobResponse> {
  return request<JobResponse>(`/jobs/${jobId}/cancel`, { method: "POST" });
}

export interface ArchiveResponse {
  id: string;
  download_url: string;
  file_count: number;
  total_size: number;
  name: string;
  expires_at: string;
}

/** Bundle finished downloads from any number of jobs into one ZIP.
 *
 *  Two steps by design: this validates the selection and returns an opaque id,
 *  and the returned `download_url` is a plain GET the browser can drive.
 */
export function createArchive(jobIds: string[], name?: string): Promise<ArchiveResponse> {
  return request<ArchiveResponse>("/archives", {
    method: "POST",
    body: JSON.stringify({
      entries: jobIds.map((job_id) => ({ job_id })),
      name: name ?? null,
    }),
    timeoutMs: 30_000,
  });
}

export function downloadUrl(jobId: string): string {
  return `${API_BASE}/jobs/${jobId}/download`;
}

export function archiveUrl(jobId: string): string {
  return `${API_BASE}/jobs/${jobId}/archive`;
}

/** Subscribe to live progress.
 *
 *  SSE gives us automatic reconnection for free, but a browser that has been
 *  backgrounded can miss the terminal event entirely - so the caller also gets
 *  a polling fallback if the stream fails outright.
 */
export function subscribeToProgress(
  jobId: string,
  handlers: {
    onProgress: (snapshot: ProgressSnapshot) => void;
    onDone?: () => void;
    onError?: (error: Error) => void;
  },
): () => void {
  let source: EventSource | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let closed = false;

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const startPolling = () => {
    if (pollTimer || closed) return;
    pollTimer = setInterval(async () => {
      try {
        const snapshot = await getProgress(jobId);
        handlers.onProgress(snapshot);
        if (isTerminal(snapshot.status)) {
          stopPolling();
          handlers.onDone?.();
        }
      } catch (error) {
        handlers.onError?.(error as Error);
      }
    }, 2000);
  };

  try {
    source = new EventSource(`${API_BASE}/jobs/${jobId}/events`);

    const handleSnapshot = (event: MessageEvent<string>) => {
      try {
        const snapshot = JSON.parse(event.data) as ProgressSnapshot;
        handlers.onProgress(snapshot);
        if (isTerminal(snapshot.status)) {
          handlers.onDone?.();
        }
      } catch {
        // A malformed frame is not worth tearing the stream down for.
      }
    };

    source.addEventListener("snapshot", handleSnapshot as EventListener);
    source.addEventListener("progress", handleSnapshot as EventListener);
    source.addEventListener("done", () => {
      handlers.onDone?.();
      source?.close();
    });
    source.onerror = () => {
      // EventSource retries on its own; if it is genuinely closed, fall back.
      if (source?.readyState === EventSource.CLOSED) {
        startPolling();
      }
    };
  } catch {
    startPolling();
  }

  return () => {
    closed = true;
    stopPolling();
    source?.close();
  };
}

export function isTerminal(status: string): boolean {
  return ["completed", "failed", "cancelled", "expired"].includes(status);
}
