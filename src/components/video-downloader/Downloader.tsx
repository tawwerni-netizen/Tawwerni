"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { JobProgress } from "./JobProgress";
import { PlaylistPanel } from "./PlaylistPanel";
import { ResultCard } from "./ResultCard";
import { SupportedSources } from "./SupportedSources";
import { UrlForm } from "./UrlForm";
import * as api from "@/components/video-downloader/lib/api";
import { ApiError, NetworkError } from "@/components/video-downloader/lib/api";
import type { Dict, Locale } from "@/components/video-downloader/lib/i18n";
import type { AnalyzeResponse, DownloadOptions, JobResponse } from "@/components/video-downloader/lib/types";

type Phase = "idle" | "analyzing" | "ready" | "starting" | "running";

/**
 * The whole flow lives in one component because it is genuinely one flow:
 * analyze -> choose -> download -> deliver. Splitting the state across a store
 * would add indirection without removing any complexity.
 */
export function Downloader({
  locale,
  dict,
  initialUrl = "",
}: {
  locale: Locale;
  dict: Dict;
  initialUrl?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState(initialUrl);
  // The URL that produced the analysis on screen. The input keeps changing as
  // the user types, so downloading `url` would pair a freshly edited link with
  // stale results — the wrong video, silently.
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [job, setJob] = useState<JobResponse | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorContext, setErrorContext] = useState<Record<string, number> | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const captureError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      setErrorCode(error.code);
      setErrorContext(
        error.retryAfter || error.maxItems
          ? { retryAfter: error.retryAfter ?? 0, maxItems: error.maxItems ?? 0 }
          : null,
      );
    } else if (error instanceof NetworkError) {
      setErrorCode("network");
      setErrorContext(null);
    } else {
      setErrorCode("generic");
      setErrorContext(null);
    }
  }, []);

  const handleAnalyze = useCallback(
    async (candidate: string, refresh = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setPhase("analyzing");
      setErrorCode(null);
      setErrorContext(null);
      setAnalysis(null);
      setJob(null);
      setUrl(candidate);

      try {
        const result = await api.analyze(candidate, {
          refresh,
          signal: controller.signal,
        });
        setAnalysis(result);
        setAnalyzedUrl(candidate);
        setPhase("ready");
        // Bring the result into view without a jarring jump on mobile.
        requestAnimationFrame(() =>
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        captureError(error);
        setPhase("idle");
      }
    },
    [captureError],
  );

  const handleDownload = useCallback(
    async (options: DownloadOptions, selection?: number[]) => {
      setPhase("starting");
      setErrorCode(null);
      try {
        const created = await api.createJob(analyzedUrl, options, selection);
        setJob(created);
        setPhase("running");
      } catch (error) {
        captureError(error);
        setPhase("ready");
      }
    },
    [analyzedUrl, captureError],
  );

  const handleUrlChange = useCallback(
    (next: string) => {
      setUrl(next);
      // Editing the link invalidates the card below it. Clearing it keeps the
      // page from showing results that describe a different video than the one
      // now in the box.
      if (phase === "ready" && analyzedUrl && next.trim() !== analyzedUrl) {
        setAnalysis(null);
        setPhase("idle");
      }
    },
    [phase, analyzedUrl],
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setPhase("idle");
    setAnalysis(null);
    setJob(null);
    setErrorCode(null);
    setErrorContext(null);
  }, []);

  const handleJobUpdate = useCallback((updated: JobResponse) => setJob(updated), []);

  const showResult = phase === "ready" || phase === "starting";
  const isPlaylist =
    analysis?.type === "playlist" || analysis?.type === "channel";

  return (
    <div className="flex flex-col gap-8">
      <UrlForm
        dict={dict}
        value={url}
        busy={phase === "analyzing"}
        disabled={phase === "running"}
        errorCode={phase === "running" ? null : errorCode}
        errorContext={errorContext}
        onSubmit={handleAnalyze}
        onChange={handleUrlChange}
      />

      {phase === "idle" && !errorCode && <SupportedSources dict={dict} />}

      <div ref={resultRef} className="scroll-mt-8">
        {phase === "analyzing" && <AnalyzingSkeleton />}

        {showResult && analysis && !isPlaylist && (
          <ResultCard
            key={analysis.source.webpage_url ?? url}
            dict={dict}
            locale={locale}
            analysis={analysis}
            starting={phase === "starting"}
            onDownload={(options) => handleDownload(options)}
          />
        )}

        {showResult && analysis && isPlaylist && analysis.playlist && (
          <PlaylistPanel
            key={analysis.playlist.id ?? url}
            dict={dict}
            locale={locale}
            analysis={analysis}
            url={url}
            starting={phase === "starting"}
            onDownload={handleDownload}
          />
        )}

        {phase === "running" && job && (
          <JobProgress
            dict={dict}
            locale={locale}
            job={job}
            onUpdate={handleJobUpdate}
            onReset={handleReset}
            onRetry={() => handleAnalyze(url, true)}
          />
        )}
      </div>
    </div>
  );
}

function AnalyzingSkeleton() {
  return (
    <div className="surface animate-in overflow-hidden p-4 sm:p-5" aria-busy="true">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="shimmer aspect-video w-full rounded-xl sm:w-64" />
        <div className="flex flex-1 flex-col gap-3 pt-1">
          <div className="shimmer h-5 w-3/4 rounded" />
          <div className="shimmer h-4 w-1/3 rounded" />
          <div className="shimmer mt-auto h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
