"use client";

import { useMemo, useState } from "react";

import { AlertIcon, DownloadIcon, ListIcon, SpinnerIcon } from "./Icons";
import { DEFAULT_OPTIONS, QualityPicker } from "./QualityPicker";
import { Thumbnail } from "./ResultCard";
import { formatDuration, truncate } from "@/components/video-downloader/lib/format";
import { fill, type Dict, type Locale } from "@/components/video-downloader/lib/i18n";
import type { AnalyzeResponse, DownloadOptions, PlaylistItem } from "@/components/video-downloader/lib/types";

const PAGE_SIZE = 50;

/**
 * Playlist and channel view.
 *
 * A 1000-video channel is paged at 50 per screen rather than rendered whole:
 * the browser stays responsive, and the selection is held as a Set of indices
 * so "select all" across pages costs nothing.
 */
export function PlaylistPanel({
  dict,
  locale,
  analysis,
  starting,
  onDownload,
}: {
  dict: Dict;
  locale: Locale;
  analysis: AnalyzeResponse;
  url: string;
  starting: boolean;
  onDownload: (options: DownloadOptions, selection: number[]) => void;
}) {
  const playlist = analysis.playlist!;
  const available = useMemo(
    () => playlist.items.filter((item) => item.available),
    [playlist.items],
  );

  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(available.map((item) => item.index)),
  );
  const [page, setPage] = useState(0);
  const [options, setOptions] = useState<DownloadOptions>(DEFAULT_OPTIONS);

  const pageCount = Math.max(1, Math.ceil(playlist.items.length / PAGE_SIZE));
  const visible = playlist.items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const allSelected = selected.size === available.length && available.length > 0;

  const toggle = (index: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(available.map((item) => item.index)));

  const selectPage = () =>
    setSelected((current) => {
      const next = new Set(current);
      for (const item of visible) if (item.available) next.add(item.index);
      return next;
    });

  return (
    <section className="animate-in flex flex-col gap-4 pb-28">
      {/* Playlist header */}
      <div className="surface flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <Thumbnail src={playlist.thumbnail} alt={playlist.title ?? ""} />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 className="text-balance text-lg font-semibold leading-snug">
            {truncate(playlist.title, 110) || analysis.source.site}
          </h2>

          <div className="muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {playlist.uploader && (
              <span>
                {dict.playlist.creator}: {playlist.uploader}
              </span>
            )}
            <span className="chip">
              <ListIcon size={13} />
              {playlist.total} {dict.playlist.videos}
            </span>
          </div>

          {playlist.truncated && (
            <p
              className="flex items-start gap-2 text-sm"
              style={{ color: "var(--color-warning)" }}
            >
              <AlertIcon size={16} className="mt-px shrink-0" />
              {fill(dict.playlist.truncated, { count: playlist.returned })}
            </p>
          )}
        </div>
      </div>

      {/* Quality applies to every selected video at once. */}
      <div className="surface p-4 sm:p-5">
        <QualityPicker
          dict={dict}
          locale={locale}
          analysis={{ ...analysis, video_qualities: fallbackQualities(analysis) }}
          options={options}
          onChange={setOptions}
        />
      </div>

      {/* Selection list */}
      <div className="surface overflow-hidden">
        <div
          className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              className="size-4"
              checked={allSelected}
              onChange={toggleAll}
            />
            {allSelected ? dict.playlist.unselectAll : dict.playlist.selectAll}
          </label>

          {pageCount > 1 && (
            <button type="button" className="muted text-sm hover:underline" onClick={selectPage}>
              {dict.playlist.selectPage}
            </button>
          )}
        </div>

        <ul>
          {visible.map((item) => (
            <PlaylistRow
              key={`${item.index}-${item.id ?? item.url}`}
              dict={dict}
              item={item}
              checked={selected.has(item.index)}
              onToggle={() => toggle(item.index)}
            />
          ))}
        </ul>

        {pageCount > 1 && (
          <div
            className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-border-subtle)" }}
          >
            <button
              type="button"
              className="btn btn-ghost !min-h-9 !px-3"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              {dict.playlist.previous}
            </button>

            <span className="muted tabular">
              {dict.playlist.page} {page + 1} {dict.playlist.of} {pageCount}
            </span>

            <button
              type="button"
              className="btn btn-ghost !min-h-9 !px-3"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              {dict.playlist.next}
            </button>
          </div>
        )}
      </div>

      {/* Floating action bar: the selection count and the button stay reachable
          no matter how far down the list the user has scrolled. */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3">
        <div
          className="surface mx-auto flex max-w-3xl items-center gap-3 p-3"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <span className="tabular flex-1 text-sm font-medium">
            {selected.size} {dict.playlist.selected}
          </span>

          <button
            type="button"
            className="btn btn-primary"
            disabled={starting || selected.size === 0}
            onClick={() => onDownload(options, [...selected].sort((a, b) => a - b))}
          >
            {starting ? <SpinnerIcon size={18} /> : <DownloadIcon size={18} />}
            <span className="hidden sm:inline">{dict.playlist.downloadSelected}</span>
            <span className="sm:hidden">{dict.result.download}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function PlaylistRow({
  dict,
  item,
  checked,
  onToggle,
}: {
  dict: Dict;
  item: PlaylistItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className="border-b last:border-b-0"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <label
        className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
          item.available ? "hover:bg-[var(--color-surface-muted)]" : "opacity-50"
        }`}
      >
        <input
          type="checkbox"
          className="size-4 shrink-0"
          checked={checked}
          disabled={!item.available}
          onChange={onToggle}
        />

        <span className="tabular muted w-7 shrink-0 text-xs">
          {String(item.index).padStart(2, "0")}
        </span>

        <span className="min-w-0 flex-1 truncate text-sm">
          {item.title || dict.playlist.unavailable}
        </span>

        {item.duration ? (
          <span className="tabular muted shrink-0 text-xs">
            {formatDuration(item.duration)}
          </span>
        ) : !item.available ? (
          <span className="shrink-0 text-xs" style={{ color: "var(--color-warning)" }}>
            {dict.playlist.unavailable}
          </span>
        ) : null}
      </label>
    </li>
  );
}

/**
 * A flat playlist listing carries no per-video formats, so the ladder here is
 * the generic one. The worker still resolves each video against what that video
 * really offers, and clamps down when a given entry has less.
 */
function fallbackQualities(analysis: AnalyzeResponse) {
  if (analysis.video_qualities.length) return analysis.video_qualities;
  return [
    { id: "best", label: "Best available", height: null, kind: "auto" as const, ext: null, filesize: null, filesize_approx: false, recommended: true },
    { id: "h1080", label: "1080p Full HD", height: 1080, kind: "video" as const, ext: "mp4", filesize: null, filesize_approx: false, recommended: false },
    { id: "h720", label: "720p HD", height: 720, kind: "video" as const, ext: "mp4", filesize: null, filesize_approx: false, recommended: false },
    { id: "h480", label: "480p", height: 480, kind: "video" as const, ext: "mp4", filesize: null, filesize_approx: false, recommended: false },
  ];
}
