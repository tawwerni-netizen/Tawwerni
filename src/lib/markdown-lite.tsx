import type { ReactNode } from "react";

/**
 * A small, safe subset of Markdown for article bodies — headings (`##`/`###`),
 * bullet lists (`- `), paragraphs, **bold**, and [text](url) links.
 *
 * No dependency, and no `dangerouslySetInnerHTML` anywhere in this file: every
 * text fragment is composed as React children, which React escapes on its
 * own. A full Markdown/HTML pipeline would need a sanitizer to stay
 * injection-safe against admin-authored content that might itself have come
 * from a compromised account; this has no HTML parsing step to sanitize in
 * the first place, so there is nothing for that class of bug to hide in.
 */

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string };

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  function flushPara() {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  }
  function flushList() {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2));
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

/** `**bold**` and `[text](https://...)` only — both matched, never HTML tags. */
function formatInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<b key={`${keyPrefix}-${i++}`}>{match[1]}</b>);
    } else {
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-bold text-brand-600 underline"
        >
          {match[2]}
        </a>
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function ArticleBody({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <>
      {blocks.map((b, i) => {
        const key = `b${i}`;
        if (b.type === "h2") {
          return (
            <h2 key={key} className="mb-3 mt-8 text-xl font-bold text-neutral-800">
              {formatInline(b.text, key)}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3 key={key} className="mb-2 mt-6 text-lg font-bold text-neutral-800">
              {formatInline(b.text, key)}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={key} className="mb-4 list-disc space-y-1.5 pr-5 text-sm leading-relaxed text-neutral-700">
              {b.items.map((item, j) => (
                <li key={`${key}-${j}`}>{formatInline(item, `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key} className="mb-4 text-sm leading-relaxed text-neutral-700">
            {formatInline(b.text, key)}
          </p>
        );
      })}
    </>
  );
}
