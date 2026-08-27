"use client";

/** The download manager panel.
 *
 *  Two tabs because there are genuinely two things to look at: bytes moving
 *  right now (Transfers) and what the server still holds for you (Files, which
 *  is what the "one ZIP" button bundles).
 *
 *  It lives outside the page content and persists across navigation, so a
 *  transfer started on the playlist page keeps running while you paste the next
 *  link.
 */

import { useState } from "react";

import {
  AlertIcon,
  ArchiveIcon,
  BoltIcon,
  CheckIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  SpinnerIcon,
  TrashIcon,
  XIcon,
} from "./Icons";
import {
  useDownloads,
  type LibraryEntry,
  type Transfer,
} from "@/components/video-downloader/lib/download-store";
import {
  formatBytes,
  formatEta,
  formatPercent,
  formatRelativeExpiry,
  formatSpeed,
  truncate,
} from "@/components/video-downloader/lib/format";
import { errorMessage, fill, type Dict, type Locale } from "@/components/video-downloader/lib/i18n";
import type { TaskStatus } from "@/components/video-downloader/lib/downloader";

const STATUS_KEY: Record<TaskStatus, keyof Dict["manager"]> = {
  queued: "statusQueued",
  probing: "statusProbing",
  downloading: "statusDownloading",
  paused: "statusPaused",
  finishing: "statusFinishing",
  done: "statusDone",
  error: "statusError",
  cancelled: "statusCancelled",
};

const ACTIVE: TaskStatus[] = ["queued", "probing", "downloading", "finishing"];

export function DownloadManager({ dict, locale }: { dict: Dict; locale: Locale }) {
  const store = useDownloads();
  const [tab, setTab] = useState<"transfers" | "files">("transfers");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { transfers, library, activeCount, open, setOpen } = store;
  const hasAnything = transfers.length > 0 || library.length > 0;

  if (!hasAnything && !open) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.manager.open}
        className="fixed bottom-4 end-4 z-40 flex min-h-12 items-center gap-2 rounded-full px-4 shadow-lg"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-accent-ink)",
        }}
      >
        {activeCount > 0 ? <SpinnerIcon size={18} /> : <DownloadIcon size={18} />}
        <span className="text-sm font-semibold">{dict.manager.title}</span>
        {(activeCount > 0 || library.length > 0) && (
          <span className="tabular rounded-full bg-black/25 px-2 py-0.5 text-xs font-bold">
            {activeCount > 0 ? activeCount : library.length}
          </span>
        )}
      </button>
    );
  }

  const toggle = (jobId: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });

  const allSelected = library.length > 0 && selected.size === library.length;
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(library.map((e) => e.jobId)));

  const bundleTargets = selected.size ? [...selected] : library.map((e) => e.jobId);

  return (
    <aside
      className="surface fixed bottom-4 end-4 z-40 flex max-h-[70vh] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden"
      role="region"
      aria-label={dict.manager.title}
    >
      <header
        className="flex items-center justify-between gap-2 border-b px-3 py-2.5"
        style={{ borderColor: "var(--color-border-subtle)" }}
      >
        <div className="flex items-center gap-2 font-semibold">
          <DownloadIcon size={17} />
          {dict.manager.title}
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="muted rounded-md p-1.5 hover:opacity-70"
          aria-label={dict.manager.close}
        >
          <XIcon size={17} />
        </button>
      </header>

      <div
        className="grid grid-cols-2 gap-1 border-b p-1.5"
        style={{ borderColor: "var(--color-border-subtle)" }}
        role="tablist"
      >
        <Tab
          active={tab === "transfers"}
          onClick={() => setTab("transfers")}
          label={dict.manager.transfers}
          count={transfers.length}
        />
        <Tab
          active={tab === "files"}
          onClick={() => setTab("files")}
          label={dict.manager.files}
          count={library.length}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "transfers" ? (
          transfers.length === 0 ? (
            <Empty text={dict.manager.noTransfers} />
          ) : (
            <ul>
              {transfers.map((transfer) => (
                <TransferRow
                  key={transfer.id}
                  dict={dict}
                  locale={locale}
                  transfer={transfer}
                  onPause={() => store.pause(transfer.id)}
                  onResume={() => store.resume(transfer.id)}
                  onCancel={() => store.cancel(transfer.id)}
                  onRetry={() => store.retry(transfer.id)}
                  onDismiss={() => store.dismiss(transfer.id)}
                />
              ))}
            </ul>
          )
        ) : library.length === 0 ? (
          <Empty text={dict.manager.noFiles} />
        ) : (
          <>
            <div
              className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm"
              style={{ borderColor: "var(--color-border-subtle)" }}
            >
              <label className="flex cursor-pointer items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                {dict.manager.selectAll}
              </label>
              <button
                type="button"
                className="muted text-xs hover:underline"
                onClick={() => {
                  store.clearLibrary();
                  setSelected(new Set());
                }}
              >
                {dict.manager.clearAll}
              </button>
            </div>
            <ul>
              {library.map((entry) => (
                <LibraryRow
                  key={entry.jobId}
                  dict={dict}
                  locale={locale}
                  entry={entry}
                  checked={selected.has(entry.jobId)}
                  onToggle={() => toggle(entry.jobId)}
                  onRemove={() => {
                    store.removeFromLibrary(entry.jobId);
                    setSelected((c) => {
                      const next = new Set(c);
                      next.delete(entry.jobId);
                      return next;
                    });
                  }}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      <footer
        className="flex flex-col gap-2 border-t p-3"
        style={{ borderColor: "var(--color-border-subtle)" }}
      >
        {tab === "transfers" ? (
          <>
            <p className="muted text-[11px] leading-snug">{dict.manager.acceleratedHint}</p>
            {transfers.some((t) => !ACTIVE.includes(t.status)) && (
              <button
                type="button"
                className="btn btn-ghost !min-h-9 w-full text-sm"
                onClick={store.clearFinished}
              >
                {dict.manager.clearFinished}
              </button>
            )}
          </>
        ) : (
          <>
            {store.bundleError && (
              <p
                className="flex items-start gap-1.5 text-xs"
                style={{ color: "var(--color-danger)" }}
              >
                <AlertIcon size={14} className="mt-px shrink-0" />
                {errorMessage(dict, store.bundleError)}
              </p>
            )}
            <button
              type="button"
              className="btn btn-primary w-full text-sm"
              disabled={store.bundling || library.length === 0}
              onClick={() => void store.bundle(bundleTargets)}
            >
              {store.bundling ? <SpinnerIcon size={16} /> : <ArchiveIcon size={16} />}
              {store.bundling
                ? dict.manager.preparing
                : selected.size
                  ? dict.manager.zipSelected
                  : dict.manager.zipAll}
            </button>
            <p className="muted text-[11px]">{dict.manager.localOnly}</p>
          </>
        )}
      </footer>
    </aside>
  );
}

function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors"
      style={{
        backgroundColor: active ? "var(--color-surface-muted)" : "transparent",
        color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
      }}
    >
      {label}
      {count > 0 && <span className="tabular text-xs opacity-70">({count})</span>}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="muted px-4 py-8 text-center text-sm">{text}</p>;
}

function TransferRow({
  dict,
  locale,
  transfer,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onDismiss,
}: {
  dict: Dict;
  locale: Locale;
  transfer: Transfer;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const { status, stats } = transfer;
  const percent =
    stats.total && stats.total > 0 ? (stats.received / stats.total) * 100 : 0;
  const running = status === "downloading" || status === "probing";
  const finished = status === "done";
  const failed = status === "error" || status === "cancelled";

  return (
    <li
      className="border-b px-3 py-2.5 last:border-b-0"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">
          {finished ? (
            <CheckIcon size={16} className="text-[var(--color-positive)]" />
          ) : failed ? (
            <AlertIcon size={16} className="text-[var(--color-danger)]" />
          ) : status === "paused" ? (
            <PauseIcon size={16} />
          ) : (
            <SpinnerIcon size={16} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={transfer.filename}>
            {truncate(transfer.filename, 60)}
          </p>

          {!finished && !failed && (
            <div
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--color-surface-muted)" }}
              role="progressbar"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${Math.max(2, Math.min(100, percent))}%`,
                  backgroundColor: "var(--color-accent)",
                }}
              />
            </div>
          )}

          <div className="muted tabular mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px]">
            <span>{dict.manager[STATUS_KEY[status]]}</span>

            {stats.total ? (
              <span>
                {formatBytes(stats.received, locale)} / {formatBytes(stats.total, locale)}
              </span>
            ) : null}

            {running && percent > 0 && <span>{formatPercent(percent, locale)}%</span>}
            {running && stats.speed > 0 && <span>{formatSpeed(stats.speed, locale)}</span>}
            {running && stats.eta ? <span>{formatEta(stats.eta)}</span> : null}

            {stats.accelerated && stats.connections > 1 && (
              <span
                className="inline-flex items-center gap-0.5"
                style={{ color: "var(--color-accent)" }}
              >
                <BoltIcon size={11} />
                {fill(dict.manager.connections, { count: stats.connections })}
              </span>
            )}

            {finished && !stats.accelerated && <span>{dict.manager.viaBrowser}</span>}
          </div>

          {status === "error" && transfer.error && (
            <p className="mt-1 text-[11px]" style={{ color: "var(--color-danger)" }}>
              {truncate(transfer.error, 90)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {status === "downloading" && (
            <IconButton label={dict.manager.pause} onClick={onPause}>
              <PauseIcon size={15} />
            </IconButton>
          )}
          {status === "paused" && (
            <IconButton label={dict.manager.resume} onClick={onResume}>
              <PlayIcon size={15} />
            </IconButton>
          )}
          {status === "error" && (
            <IconButton label={dict.manager.retry} onClick={onRetry}>
              <PlayIcon size={15} />
            </IconButton>
          )}
          {running || status === "paused" ? (
            <IconButton label={dict.manager.cancel} onClick={onCancel}>
              <XIcon size={15} />
            </IconButton>
          ) : (
            <IconButton label={dict.manager.remove} onClick={onDismiss}>
              <XIcon size={15} />
            </IconButton>
          )}
        </div>
      </div>
    </li>
  );
}

function LibraryRow({
  dict,
  locale,
  entry,
  checked,
  onToggle,
  onRemove,
}: {
  dict: Dict;
  locale: Locale;
  entry: LibraryEntry;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const expiry = formatRelativeExpiry(entry.expiresAt, locale);

  return (
    <li
      className="border-b last:border-b-0"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <div className="flex items-center gap-2.5 px-3 py-2">
        <input
          type="checkbox"
          className="size-4 shrink-0"
          checked={checked}
          onChange={onToggle}
          aria-label={entry.title}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm" title={entry.title}>
            {truncate(entry.title, 55)}
          </p>
          <p className="muted tabular flex flex-wrap gap-x-2 text-[11px]">
            <span>
              {entry.fileCount === 1
                ? dict.manager.files_one
                : fill(dict.manager.files_many, { count: entry.fileCount })}
            </span>
            {entry.size ? <span>{formatBytes(entry.size, locale)}</span> : null}
            {expiry ? <span>{fill(dict.manager.expires, { time: expiry })}</span> : null}
          </p>
        </div>

        <IconButton label={dict.manager.remove} onClick={onRemove}>
          <TrashIcon size={15} />
        </IconButton>
      </div>
    </li>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="muted flex size-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--color-surface-muted)]"
    >
      {children}
    </button>
  );
}
