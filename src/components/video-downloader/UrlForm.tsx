"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { AlertIcon, SearchIcon, SpinnerIcon, XIcon } from "./Icons";
import { errorMessage, fill, type Dict } from "@/components/video-downloader/lib/i18n";

export function UrlForm({
  dict,
  value,
  busy,
  disabled,
  errorCode,
  errorContext,
  onSubmit,
  onChange,
}: {
  dict: Dict;
  value: string;
  busy: boolean;
  disabled: boolean;
  errorCode: string | null;
  errorContext: Record<string, number> | null;
  onSubmit: (url: string) => void;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  // Desktop users paste and hit enter; focusing on mount saves a click without
  // stealing focus on mobile, where it would pop the keyboard unprompted.
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    setTouched(true);
    if (!trimmed || busy || disabled) return;
    onSubmit(trimmed);
  };

  const message = errorCode ? resolveMessage(dict, errorCode, errorContext) : null;

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <label htmlFor="video-url" className="sr-only">
        {dict.hero.inputLabel}
      </label>

      <div className="relative">
        <input
          id="video-url"
          ref={inputRef}
          type="url"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className="field field-url pe-11 text-base sm:text-lg"
          placeholder={dict.hero.placeholder}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(message) && touched}
          aria-describedby={message ? "url-error" : undefined}
          onChange={(event) => onChange(event.target.value)}
        />

        {value && !busy && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="muted absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 hover:opacity-70"
            aria-label={dict.hero.clear}
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full text-base"
        disabled={busy || disabled || !value.trim()}
      >
        {busy ? (
          <>
            <SpinnerIcon size={18} />
            {dict.hero.analyzing}
          </>
        ) : (
          <>
            <SearchIcon size={18} />
            {dict.hero.analyze}
          </>
        )}
      </button>

      {message && (
        <p
          id="url-error"
          role="alert"
          className="animate-in flex items-start gap-2 text-sm"
          style={{ color: "var(--color-danger)" }}
        >
          <AlertIcon size={17} className="mt-px shrink-0" />
          <span>{message}</span>
        </p>
      )}
    </form>
  );
}

function resolveMessage(
  dict: Dict,
  code: string,
  context: Record<string, number> | null,
): string {
  const base = errorMessage(dict, code);
  if (code === "playlist_too_large" && context?.maxItems) {
    return `${base} ${fill(dict.playlist.limitNote, { max: context.maxItems })}`;
  }
  return base;
}
