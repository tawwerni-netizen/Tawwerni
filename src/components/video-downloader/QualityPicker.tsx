"use client";

import { useMemo, useState } from "react";

import { MusicIcon, VideoIcon } from "./Icons";
import { formatBytes } from "@/components/video-downloader/lib/format";
import type { Dict, Locale } from "@/components/video-downloader/lib/i18n";
import type { AnalyzeResponse, DownloadOptions, MediaFormat } from "@/components/video-downloader/lib/types";

export const DEFAULT_OPTIONS: DownloadOptions = {
  audio_only: false,
  mode: "best",
  height: null,
  format_id: null,
  container: "mp4",
  audio_container: "m4a",
  allow_transcode: false,
  embed_thumbnail: false,
  embed_metadata: true,
};

/**
 * The quality picker only ever renders choices the source actually returned.
 * There is no static 144p-to-8K list here: if the backend did not report a rung,
 * it does not appear, so the user is never offered a resolution that would have
 * to be faked by upscaling.
 */
export function QualityPicker({
  dict,
  locale,
  analysis,
  options,
  onChange,
}: {
  dict: Dict;
  locale: Locale;
  analysis: AnalyzeResponse;
  options: DownloadOptions;
  onChange: (next: DownloadOptions) => void;
}) {
  const [advanced, setAdvanced] = useState(false);

  const videoQualities = analysis.video_qualities;
  const hasVideo = videoQualities.length > 0;
  const containers = analysis.containers.length ? analysis.containers : ["mp4"];

  const advancedFormats = useMemo(
    () => analysis.formats.filter((format) => format.has_video || format.has_audio).slice(0, 40),
    [analysis.formats],
  );

  const set = (patch: Partial<DownloadOptions>) => onChange({ ...options, ...patch });

  return (
    <div className="flex flex-col gap-5">
      {/* Video / audio switch */}
      <div
        className="grid grid-cols-2 gap-1 rounded-xl p-1"
        style={{ backgroundColor: "var(--color-surface-muted)" }}
        role="tablist"
      >
        <TabButton
          active={!options.audio_only}
          disabled={!hasVideo}
          onClick={() => set({ audio_only: false, mode: "best", height: null, format_id: null })}
          icon={<VideoIcon size={16} />}
          label={dict.result.video}
        />
        <TabButton
          active={options.audio_only}
          onClick={() => set({ audio_only: true, mode: "best", height: null, format_id: null })}
          icon={<MusicIcon size={16} />}
          label={dict.result.audio}
        />
      </div>

      {!hasVideo && !options.audio_only && (
        <p className="muted text-sm">{dict.result.noVideoQualities}</p>
      )}

      {!options.audio_only && hasVideo && (
        <>
          <Field label={dict.result.quality}>
            <div className="flex flex-wrap gap-2">
              {videoQualities.map((quality) => {
                const selected =
                  quality.kind === "auto"
                    ? options.mode === "best" && !options.format_id
                    : options.mode === "height" && options.height === quality.height;

                return (
                  <Choice
                    key={quality.id}
                    selected={selected}
                    onClick={() =>
                      set(
                        quality.kind === "auto"
                          ? { mode: "best", height: null, format_id: null }
                          : { mode: "height", height: quality.height, format_id: null },
                      )
                    }
                  >
                    <span className="font-semibold">
                      {quality.kind === "auto" ? dict.result.bestAvailable : quality.label}
                    </span>
                    {quality.filesize ? (
                      <span className="muted text-xs tabular">
                        {quality.filesize_approx ? `~${formatBytes(quality.filesize, locale)}` : formatBytes(quality.filesize, locale)}
                      </span>
                    ) : null}
                  </Choice>
                );
              })}
            </div>
          </Field>

          <Field label={dict.result.format}>
            <div className="flex flex-wrap gap-2">
              {containers.map((container) => (
                <Choice
                  key={container}
                  selected={options.container === container}
                  onClick={() => set({ container: container as DownloadOptions["container"] })}
                >
                  <span className="font-semibold uppercase">{container}</span>
                </Choice>
              ))}
            </div>
          </Field>
        </>
      )}

      {options.audio_only && (
        <Field label={dict.result.format}>
          <div className="flex flex-wrap gap-2">
            {(analysis.audio_containers.length ? analysis.audio_containers : ["m4a", "mp3", "wav"]).map(
              (container) => (
                <Choice
                  key={container}
                  selected={options.audio_container === container}
                  onClick={() =>
                    set({ audio_container: container as DownloadOptions["audio_container"] })
                  }
                >
                  <span className="font-semibold uppercase">{container}</span>
                </Choice>
              ),
            )}
          </div>
        </Field>
      )}

      {/* Advanced: exact stream selection, for people who want it. */}
      {advancedFormats.length > 1 && (
        <details
          className="rounded-xl border p-3"
          style={{ borderColor: "var(--color-border-subtle)" }}
          open={advanced}
          onToggle={(event) => setAdvanced((event.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer select-none text-sm font-medium">
            {dict.result.advanced}
          </summary>

          <div className="mt-3 flex flex-col gap-3">
            <p className="muted text-xs leading-relaxed">{dict.result.advancedHint}</p>

            <select
              className="field text-sm"
              value={options.mode === "format_id" ? (options.format_id ?? "") : ""}
              onChange={(event) => {
                const id = event.target.value;
                set(
                  id
                    ? { mode: "format_id", format_id: id, height: null }
                    : { mode: "best", format_id: null },
                );
              }}
            >
              <option value="">{dict.result.bestAvailable}</option>
              {advancedFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {describeFormat(format, locale)}
                </option>
              ))}
            </select>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0"
                checked={options.allow_transcode}
                onChange={(event) => set({ allow_transcode: event.target.checked })}
              />
              <span className="muted leading-snug">{dict.result.allowTranscode}</span>
            </label>
          </div>
        </details>
      )}
    </div>
  );
}

function describeFormat(format: MediaFormat, locale: Locale): string {
  const parts: string[] = [];
  if (format.has_video && format.height) {
    parts.push(`${format.height}p${format.fps && format.fps > 30 ? format.fps : ""}`);
  } else {
    parts.push("audio");
  }
  parts.push(format.ext.toUpperCase());
  if (format.vcodec && format.has_video) parts.push(format.vcodec);
  if (!format.has_audio && format.has_video) parts.push("video only");
  if (format.filesize) parts.push(formatBytes(format.filesize, locale));
  return parts.join(" · ");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="muted text-xs font-semibold uppercase tracking-wide">{label}</span>
      {children}
    </div>
  );
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex min-h-11 flex-col items-start justify-center rounded-xl border px-3.5 py-1.5 text-sm transition-colors"
      style={{
        borderColor: selected ? "var(--color-accent)" : "var(--color-border-subtle)",
        backgroundColor: selected
          ? "color-mix(in oklab, var(--color-accent) 12%, transparent)"
          : "transparent",
        color: selected ? "var(--color-accent)" : "var(--color-ink)",
      }}
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  disabled,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
      style={{
        backgroundColor: active ? "var(--color-surface)" : "transparent",
        color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
        boxShadow: active ? "var(--shadow-card)" : "none",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
