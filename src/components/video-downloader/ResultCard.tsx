"use client";

import { useState } from "react";

import { AlertIcon, ClockIcon, DownloadIcon, SpinnerIcon } from "./Icons";
import { DEFAULT_OPTIONS, QualityPicker } from "./QualityPicker";
import { formatCount, formatDuration, qualityBadge, truncate } from "@/components/video-downloader/lib/format";
import type { Dict, Locale } from "@/components/video-downloader/lib/i18n";
import type { AnalyzeResponse, DownloadOptions } from "@/components/video-downloader/lib/types";

export function ResultCard({
  dict,
  locale,
  analysis,
  starting,
  onDownload,
}: {
  dict: Dict;
  locale: Locale;
  analysis: AnalyzeResponse;
  starting: boolean;
  onDownload: (options: DownloadOptions) => void;
}) {
  const [options, setOptions] = useState<DownloadOptions>(() => ({
    ...DEFAULT_OPTIONS,
    container: (analysis.containers[0] as DownloadOptions["container"]) ?? "mp4",
    audio_only: analysis.video_qualities.length === 0,
  }));

  const bestHeight = analysis.video_qualities.find((q) => q.kind === "video")?.height ?? null;
  const badge = qualityBadge(bestHeight);

  return (
    <section className="surface animate-in overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <Thumbnail
          src={analysis.thumbnail}
          alt={analysis.title ?? ""}
          duration={analysis.duration}
          badge={badge}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 className="text-balance text-lg font-semibold leading-snug">
            {truncate(analysis.title, 120) || analysis.source.site}
          </h2>

          <div className="muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {analysis.uploader && <span className="truncate">{analysis.uploader}</span>}
            {analysis.view_count !== null && (
              <span className="tabular">
                {formatCount(analysis.view_count, locale)} {dict.result.views}
              </span>
            )}
            <span className="chip">{analysis.source.site}</span>
          </div>

          {analysis.is_live && (
            <p
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--color-warning)" }}
            >
              <AlertIcon size={16} />
              {dict.result.liveWarning}
            </p>
          )}
        </div>
      </div>

      <div
        className="border-t p-4 sm:p-5"
        style={{ borderColor: "var(--color-border-subtle)" }}
      >
        <QualityPicker
          dict={dict}
          locale={locale}
          analysis={analysis}
          options={options}
          onChange={setOptions}
        />

        <button
          type="button"
          className="btn btn-primary mt-6 w-full text-base"
          disabled={starting || analysis.is_live}
          onClick={() => onDownload(options)}
        >
          {starting ? (
            <>
              <SpinnerIcon size={18} />
              {dict.result.starting}
            </>
          ) : (
            <>
              <DownloadIcon size={18} />
              {dict.result.download}
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export function Thumbnail({
  src,
  alt,
  duration,
  badge,
  className = "",
}: {
  src: string | null;
  alt: string;
  duration?: number | null;
  badge?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:w-64 ${className}`}
      style={{ backgroundColor: "var(--color-surface-muted)" }}
    >
      {src && !failed ? (
        // A plain <img> on purpose: thumbnails come from dozens of third-party
        // CDNs and are display-once, so routing them through an optimizer would
        // add latency and cache pressure for no benefit.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="muted flex size-full items-center justify-center">
          <DownloadIcon size={28} />
        </div>
      )}

      {badge && (
        <span className="absolute start-2 top-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}

      {duration ? (
        <span className="tabular absolute bottom-2 end-2 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <ClockIcon size={11} />
          {formatDuration(duration)}
        </span>
      ) : null}
    </div>
  );
}
