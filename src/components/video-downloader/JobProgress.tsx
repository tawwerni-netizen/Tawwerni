"use client";

import { useEffect, useRef, useState } from "react";

import { AlertIcon, CheckIcon, DownloadIcon, SpinnerIcon, XIcon } from "./Icons";
import { Thumbnail } from "./ResultCard";
import * as api from "@/components/video-downloader/lib/api";
import { useDownloads } from "@/components/video-downloader/lib/download-store";
import {
  formatBytes,
  formatEta,
  formatPercent,
  formatRelativeExpiry,
  formatSpeed,
  truncate,
} from "@/components/video-downloader/lib/format";
import { errorMessage, fill, type Dict, type Locale } from "@/components/video-downloader/lib/i18n";
import type { JobResponse, JobStatus, ProgressSnapshot } from "@/components/video-downloader/lib/types";

const STAGE_LABEL: Record<JobStatus, keyof Dict["progress"]> = {
  queued: "queued",
  analyzing: "analyzing",
  downloading: "downloading",
  processing: "processing",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled",
  expired: "expired",
};

export function JobProgress({
  dict,
  locale,
  job,
  onUpdate,
  onReset,
  onRetry,
}: {
  dict: Dict;
  locale: Locale;
  job: JobResponse;
  onUpdate: (job: JobResponse) => void;
  onReset: () => void;
  onRetry: () => void;
}) {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const finishedRef = useRef(false);
  const { addToLibrary, startDownload } = useDownloads();

  useEffect(() => {
    finishedRef.current = false;

    const unsubscribe = api.subscribeToProgress(job.id, {
      onProgress: setSnapshot,
      onDone: async () => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        // The stream tells us it ended; the job record carries the download URL
        // and the final file size, so fetch it once rather than trusting the
        // last frame to have everything.
        try {
          const finished = await api.getJob(job.id);
          onUpdate(finished);
          // Register it with the manager so it can be bundled into a ZIP later,
          // even after the visitor has moved on to another link.
          addToLibrary(finished);
        } catch {
          /* The snapshot already shows a terminal state; leave it as-is. */
        }
      },
    });

    return unsubscribe;
  }, [job.id, onUpdate, addToLibrary]);

  const status = snapshot?.status ?? job.status;
  const progress = snapshot?.progress ?? job.progress;
  const isBatch = job.kind === "batch";
  const done = status === "completed";
  const failed = status === "failed" || status === "cancelled" || status === "expired";
  const running = !done && !failed;

  const cancel = async () => {
    setCancelling(true);
    try {
      onUpdate(await api.cancelJob(job.id));
    } catch {
      /* The job may have finished in the meantime; the stream will correct us. */
    } finally {
      setCancelling(false);
    }
  };

  const expiry = formatRelativeExpiry(job.expires_at, locale);
  const downloadHref = done
    ? isBatch
      ? api.archiveUrl(job.id)
      : api.downloadUrl(job.id)
    : null;

  return (
    <section className="surface animate-in overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <Thumbnail
          src={job.thumbnail}
          alt={job.title ?? ""}
          duration={job.duration}
          className="sm:w-48"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-balance font-semibold leading-snug">
              {truncate(snapshot?.current_title ?? job.title, 90) || job.source}
            </h2>
            <StatusPill status={status} dict={dict} />
          </div>

          {running && (
            <>
              <ProgressBar value={progress} indeterminate={status === "queued" || status === "analyzing"} />

              <div className="muted tabular flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
                  {formatPercent(progress, locale)}%
                </span>

                {snapshot?.total_bytes ? (
                  <span>
                    {formatBytes(snapshot.downloaded_bytes, locale)} /{" "}
                    {formatBytes(snapshot.total_bytes, locale)}
                  </span>
                ) : null}

                {snapshot?.speed ? (
                  <span>
                    {dict.progress.speed} {formatSpeed(snapshot.speed, locale)}
                  </span>
                ) : null}

                {snapshot?.eta ? (
                  <span>
                    {dict.progress.eta} {formatEta(snapshot.eta)}
                  </span>
                ) : null}
              </div>

              {isBatch && (
                <p className="muted tabular text-sm">
                  {fill(dict.progress.videosDone, {
                    done: snapshot?.completed_items ?? job.completed_items,
                    total: snapshot?.total_items ?? job.total_items,
                  })}
                </p>
              )}

              <p className="muted text-xs">{dict.progress.keepOpen}</p>
            </>
          )}

          {done && (
            <div className="flex flex-col gap-2">
              {job.file_size ? (
                <p className="muted tabular text-sm">
                  {dict.result.size}: {formatBytes(job.file_size, locale)}
                </p>
              ) : null}
              {isBatch && job.failed_items > 0 && (
                <p className="text-sm" style={{ color: "var(--color-warning)" }}>
                  {fill(dict.progress.videosDone, {
                    done: job.completed_items,
                    total: job.total_items,
                  })}
                </p>
              )}
              {expiry && <p className="muted text-xs">{fill(dict.progress.expiresIn, { time: expiry })}</p>}
            </div>
          )}

          {failed && status !== "cancelled" && (
            <p
              className="flex items-start gap-2 text-sm"
              style={{ color: "var(--color-danger)" }}
            >
              <AlertIcon size={17} className="mt-px shrink-0" />
              <span>{errorMessage(dict, snapshot?.error_code ?? job.error_code)}</span>
            </p>
          )}
        </div>
      </div>

      <div
        className="flex flex-col gap-2 border-t p-4 sm:flex-row sm:p-5"
        style={{ borderColor: "var(--color-border-subtle)" }}
      >
        {running && (
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={cancel}
            disabled={cancelling}
          >
            {cancelling ? <SpinnerIcon size={17} /> : <XIcon size={17} />}
            {dict.progress.cancel}
          </button>
        )}

        {done && downloadHref && (
          <button
            type="button"
            className="btn btn-primary w-full text-base sm:flex-1"
            onClick={() =>
              // Routed through the manager rather than a plain <a download>, so
              // large single files get multi-connection transfer and a live
              // progress row instead of vanishing into the browser's UI.
              startDownload({
                url: downloadHref,
                filename:
                  job.file_name ??
                  `${(job.title || "download").slice(0, 60)}${isBatch ? ".zip" : ""}`,
              })
            }
          >
            <DownloadIcon size={18} />
            {isBatch ? dict.progress.downloadAll : dict.progress.downloadFile}
          </button>
        )}

        {failed && (job.retryable || status === "cancelled") && (
          <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={onRetry}>
            {dict.progress.tryAgain}
          </button>
        )}

        {!running && (
          <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={onReset}>
            {dict.progress.startOver}
          </button>
        )}
      </div>

      {done && isBatch && job.items.length > 0 && (
        <ul className="border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
          {job.items.map((item) => (
            <li
              key={item.index}
              className="flex items-center gap-3 border-b px-4 py-2.5 text-sm last:border-b-0"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <span className="tabular muted w-7 shrink-0 text-xs">
                {String(item.index).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>

              {item.download_url ? (
                <button
                  type="button"
                  className="shrink-0 hover:underline"
                  style={{ color: "var(--color-accent)" }}
                  onClick={() =>
                    startDownload({
                      url: item.download_url!,
                      filename: item.file_name ?? `${item.index}.mp4`,
                    })
                  }
                >
                  <DownloadIcon size={16} />
                  <span className="sr-only">{dict.progress.downloadFile}</span>
                </button>
              ) : (
                <span className="shrink-0 text-xs" style={{ color: "var(--color-danger)" }}>
                  {errorMessage(dict, item.error_code)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProgressBar({ value, indeterminate }: { value: number; indeterminate: boolean }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: "var(--color-surface-muted)" }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${
          indeterminate ? "shimmer" : ""
        }`}
        style={{
          width: indeterminate ? "35%" : `${Math.max(2, Math.min(100, value))}%`,
          backgroundColor: indeterminate ? undefined : "var(--color-accent)",
        }}
      />
    </div>
  );
}

function StatusPill({ status, dict }: { status: JobStatus; dict: Dict }) {
  const label = dict.progress[STAGE_LABEL[status]];
  const tone =
    status === "completed"
      ? "var(--color-positive)"
      : status === "failed" || status === "expired"
        ? "var(--color-danger)"
        : status === "cancelled"
          ? "var(--color-ink-muted)"
          : "var(--color-accent)";

  return (
    <span
      className="chip shrink-0"
      style={{
        color: tone,
        backgroundColor: "color-mix(in oklab, currentColor 12%, transparent)",
      }}
    >
      {status === "completed" ? (
        <CheckIcon size={13} />
      ) : status === "failed" || status === "expired" ? (
        <AlertIcon size={13} />
      ) : status === "cancelled" ? (
        <XIcon size={13} />
      ) : (
        <SpinnerIcon size={13} />
      )}
      {label}
    </span>
  );
}
