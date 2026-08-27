"use client";

/** Download manager state.
 *
 *  Two distinct things live here, and conflating them is the mistake to avoid:
 *
 *  **Transfers** are client-side byte movements happening right now — the
 *  segmented engine, progress, pause/resume. They are not persisted, because a
 *  transfer cannot survive a reload: the write handle to the user's disk dies
 *  with the page.
 *
 *  **Library** is what the *server* still holds for this visitor — finished
 *  jobs, within their retention window. This one is persisted to localStorage,
 *  because it is just a list of ids and titles, and it is what the "bundle
 *  everything into one ZIP" button operates on.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as api from "./api";
import {
  DEFAULT_SEGMENTS,
  SegmentedDownload,
  type DownloadStats,
  type TaskStatus,
} from "./downloader";
import type { JobResponse } from "./types";

const LIBRARY_KEY = "uvd.library.v1";
const LIBRARY_LIMIT = 60;
/** Each transfer already opens several connections; two at once is plenty. */
const MAX_PARALLEL_TRANSFERS = 2;

export interface Transfer {
  id: string;
  url: string;
  filename: string;
  status: TaskStatus;
  stats: DownloadStats;
  error?: string;
  addedAt: number;
}

export interface LibraryEntry {
  jobId: string;
  title: string;
  kind: "single" | "batch";
  fileCount: number;
  size: number | null;
  thumbnail: string | null;
  addedAt: number;
  expiresAt: string | null;
}

interface DownloadContextValue {
  transfers: Transfer[];
  library: LibraryEntry[];
  activeCount: number;
  open: boolean;
  setOpen: (open: boolean) => void;

  startDownload: (input: { url: string; filename: string }) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  cancel: (id: string) => void;
  retry: (id: string) => void;
  dismiss: (id: string) => void;
  clearFinished: () => void;

  addToLibrary: (job: JobResponse) => void;
  removeFromLibrary: (jobId: string) => void;
  clearLibrary: () => void;
  bundle: (jobIds: string[], name?: string) => Promise<void>;
  bundling: boolean;
  bundleError: string | null;
}

const DownloadContext = createContext<DownloadContextValue | null>(null);

export function useDownloads(): DownloadContextValue {
  const context = useContext(DownloadContext);
  if (!context) throw new Error("useDownloads must be used inside <DownloadProvider>");
  return context;
}

const emptyStats: DownloadStats = {
  received: 0,
  total: null,
  speed: 0,
  eta: null,
  connections: 0,
  accelerated: false,
};

function loadLibrary(): LibraryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LibraryEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, LIBRARY_LIMIT) : [];
  } catch {
    return [];
  }
}

function persistLibrary(entries: LibraryEntry[]): void {
  try {
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(entries.slice(0, LIBRARY_LIMIT)));
  } catch {
    // Quota or private mode. The list is a convenience, not state we depend on.
  }
}

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [library, setLibrary] = useState<LibraryEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [bundling, setBundling] = useState(false);
  const [bundleError, setBundleError] = useState<string | null>(null);

  const engines = useRef(new Map<string, SegmentedDownload>());
  // Transfers whose engine has already been launched. A Set, not a queue: order
  // now comes from addedAt, and this only has to answer "did we start it?".
  const started = useRef(new Set<string>());

  /*
   * Hydrate the library from localStorage, once, after mount.
   *
   * The lint rule is right that this costs an extra render — but the
   * alternatives are worse here. Lazy `useState(() => loadLibrary())` runs
   * during server rendering where `localStorage` does not exist, and any
   * value it produced there would not match the client's, which is a
   * hydration mismatch. Reading after mount is the SSR-safe shape, and the
   * one extra render happens once per page load.
   */
  // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
  useEffect(() => setLibrary(loadLibrary()), []);

  const patch = useCallback((id: string, changes: Partial<Transfer>) => {
    setTransfers((current) =>
      current.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );
  }, []);

  const activeCount = useMemo(
    () =>
      transfers.filter((t) =>
        ["queued", "probing", "downloading", "finishing"].includes(t.status),
      ).length,
    [transfers],
  );

  // --- transfer pump -------------------------------------------------------

  // Start queued transfers as slots free up.
  //
  // This deliberately lives in an effect and *not* inside a `setTransfers`
  // updater. Updaters must be pure: React re-invokes them, and StrictMode does
  // so on every update in development — which would call `engine.start()`
  // twice for one transfer, opening two sets of connections that write over
  // each other. `started` makes the launch idempotent regardless.
  useEffect(() => {
    const running = transfers.filter((t) =>
      ["probing", "downloading", "finishing"].includes(t.status),
    ).length;
    let slots = MAX_PARALLEL_TRANSFERS - running;
    if (slots <= 0) return;

    // Oldest first, so the queue is fair even though new rows are prepended.
    const waiting = transfers
      .filter((t) => t.status === "queued" && !started.current.has(t.id))
      .sort((a, b) => a.addedAt - b.addedAt);

    for (const transfer of waiting) {
      if (slots <= 0) break;
      slots -= 1;
      started.current.add(transfer.id);

      const engine = engines.current.get(transfer.id);
      if (!engine) continue;
      void engine.start().catch((error: Error) => {
        patch(transfer.id, { status: "error", error: error.message });
      });
    }
  }, [transfers, patch]);

  const startDownload = useCallback(
    ({ url, filename }: { url: string; filename: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const engine = new SegmentedDownload(
        url,
        filename,
        {
          onStatus: (status, detail) =>
            patch(id, {
              status,
              error: status === "error" ? detail : undefined,
            }),
          onStats: (stats) => patch(id, { stats }),
        },
        DEFAULT_SEGMENTS,
      );
      engines.current.set(id, engine);

      setTransfers((current) => [
        {
          id,
          url,
          filename,
          status: "queued" as TaskStatus,
          stats: emptyStats,
          addedAt: Date.now(),
        },
        ...current,
      ]);
      setOpen(true);
    },
    [patch],
  );

  const pause = useCallback((id: string) => engines.current.get(id)?.pause(), []);

  const resume = useCallback(
    (id: string) => {
      const engine = engines.current.get(id);
      if (!engine) return;
      void engine.resume().catch((error: Error) => {
        patch(id, { status: "error", error: error.message });
      });
    },
    [patch],
  );

  const cancel = useCallback((id: string) => {
    // `started` is deliberately not cleared here. Cancelling is async, so
    // between clearing it and the status becoming "cancelled" the launcher
    // effect could see a still-"queued" row and start it over again. Restarting
    // is what `retry` is for, and that creates a fresh transfer.
    void engines.current.get(id)?.cancel();
  }, []);

  const dismiss = useCallback((id: string) => {
    void engines.current.get(id)?.cancel();
    engines.current.delete(id);
    started.current.delete(id);
    setTransfers((current) => current.filter((t) => t.id !== id));
  }, []);

  const retry = useCallback(
    (id: string) => {
      const existing = transfers.find((t) => t.id === id);
      if (!existing) return;
      dismiss(id);
      startDownload({ url: existing.url, filename: existing.filename });
    },
    [transfers, dismiss, startDownload],
  );

  const clearFinished = useCallback(() => {
    setTransfers((current) => {
      const keep = current.filter(
        (t) => !["done", "error", "cancelled"].includes(t.status),
      );
      for (const t of current) {
        if (!keep.includes(t)) engines.current.delete(t.id);
      }
      return keep;
    });
  }, []);

  // --- library -------------------------------------------------------------

  const addToLibrary = useCallback((job: JobResponse) => {
    if (job.status !== "completed") return;
    const entry: LibraryEntry = {
      jobId: job.id,
      title: job.title || job.source || job.id,
      kind: job.kind,
      fileCount: job.kind === "batch" ? job.completed_items : 1,
      size: job.file_size ?? null,
      thumbnail: job.thumbnail,
      addedAt: Date.now(),
      expiresAt: job.expires_at,
    };
    setLibrary((current) => {
      const next = [entry, ...current.filter((e) => e.jobId !== job.id)].slice(
        0,
        LIBRARY_LIMIT,
      );
      persistLibrary(next);
      return next;
    });
  }, []);

  const removeFromLibrary = useCallback((jobId: string) => {
    setLibrary((current) => {
      const next = current.filter((e) => e.jobId !== jobId);
      persistLibrary(next);
      return next;
    });
  }, []);

  const clearLibrary = useCallback(() => {
    setLibrary([]);
    persistLibrary([]);
  }, []);

  const bundle = useCallback(
    async (jobIds: string[], name?: string) => {
      if (!jobIds.length) return;
      setBundling(true);
      setBundleError(null);
      try {
        const archive = await api.createArchive(jobIds, name);
        // The archive is generated per request and sends Accept-Ranges: none,
        // so the engine will correctly decline to segment it and hand it to the
        // browser, which streams it to disk.
        startDownload({ url: archive.download_url, filename: archive.name });
      } catch (error) {
        setBundleError(
          error instanceof api.ApiError ? error.code : "generic",
        );
      } finally {
        setBundling(false);
      }
    },
    [startDownload],
  );

  const value = useMemo<DownloadContextValue>(
    () => ({
      transfers,
      library,
      activeCount,
      open,
      setOpen,
      startDownload,
      pause,
      resume,
      cancel,
      retry,
      dismiss,
      clearFinished,
      addToLibrary,
      removeFromLibrary,
      clearLibrary,
      bundle,
      bundling,
      bundleError,
    }),
    [
      transfers,
      library,
      activeCount,
      open,
      startDownload,
      pause,
      resume,
      cancel,
      retry,
      dismiss,
      clearFinished,
      addToLibrary,
      removeFromLibrary,
      clearLibrary,
      bundle,
      bundling,
      bundleError,
    ],
  );

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>;
}
