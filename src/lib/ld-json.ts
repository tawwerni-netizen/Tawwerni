/**
 * Serialises data for a `<script type="application/ld+json">` block.
 *
 * `JSON.stringify` does not escape `</script>`, so a string containing it would
 * close the tag early and everything after would be parsed as HTML. Nothing in
 * this data contains that sequence today, but the FAQ is edited by hand and one
 * answer mentioning a script tag is all it would take.
 *
 * U+2028 and U+2029 are escaped too: both are valid inside a JSON string but
 * are line terminators in JavaScript, so a parser reading the block as script
 * would break on them. The pattern is built with `fromCharCode` rather than
 * written literally — as literals they are invisible in an editor and get
 * silently mangled by anything that rewrites the file.
 */
const LINE_SEPARATORS = new RegExp(
  `[${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`,
  "g"
);

export function ldJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(LINE_SEPARATORS, (ch) =>
      ch.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029"
    );
}
