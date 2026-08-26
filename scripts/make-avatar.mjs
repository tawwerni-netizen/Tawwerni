/**
 * Renders the brand mark to a square PNG at any size.
 *
 *   node scripts/make-avatar.mjs 1280 public/brand/avatar-1280.png
 *
 * No image library. The mark is drawn as a signed distance field: for every
 * pixel we measure the distance to the stroke's centre line and fade across one
 * pixel at the edge. That gives cleaner antialiasing than a scanline rasteriser
 * at this stroke width, and keeps the whole thing on Node's built-in zlib.
 *
 * The artwork is defined in the same 48-unit space as `src/app/icon.svg`, so
 * the avatar and the favicon can never drift apart.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SIZE = Number(process.argv[2] ?? 1280);
const OUT = process.argv[3] ?? `avatar-${SIZE}.png`;

if (!Number.isInteger(SIZE) || SIZE < 16 || SIZE > 4096) {
  console.error("المقاس لازم يكون رقم صحيح بين ١٦ و٤٠٩٦");
  process.exit(1);
}

/* ------------------------------------------------------------- artwork ---- */
// All in the icon's 48-unit space. `FIT` leaves a margin so the mark still
// breathes once a platform crops the square to a circle.
const STROKE_W = 3.4;
const DOT_R = 2.6;
const FIT = 0.58; // fraction of the frame the mark spans

const PATHS = [
  [[13, 32.5], [20.5, 25], [26, 30.5], [35.5, 19]],
  [[30, 18.5], [36, 18.5], [36, 24.5]],
];
const DOT_U = [13, 16];

// Bounding box of everything drawn, including stroke and dot radii.
const half = STROKE_W / 2;
const xs = [...PATHS.flat().map((p) => p[0] - half), ...PATHS.flat().map((p) => p[0] + half), DOT_U[0] - DOT_R, DOT_U[0] + DOT_R];
const ys = [...PATHS.flat().map((p) => p[1] - half), ...PATHS.flat().map((p) => p[1] + half), DOT_U[1] - DOT_R, DOT_U[1] + DOT_R];
const bbox = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };

const scale = (SIZE * FIT) / Math.max(bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
const cx = (bbox.x0 + bbox.x1) / 2;
const cy = (bbox.y0 + bbox.y1) / 2;
const px = (u) => (u - cx) * scale + SIZE / 2;
const py = (u) => (u - cy) * scale + SIZE / 2;

const STROKES = PATHS.map((pts) => pts.map(([x, y]) => [px(x), py(y)]));
const DOT = { x: px(DOT_U[0]), y: py(DOT_U[1]), r: DOT_R * scale };
const HALF = half * scale;

/* -------------------------------------------------------------- colour ---- */
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const TILE = [
  { t: 0, c: hex("#1d9e75") },
  { t: 0.55, c: hex("#0f6e56") },
  { t: 1, c: hex("#04342c") },
];
const ACCENT = hex("#9fe1cb");

function tileColor(t) {
  let i = 1;
  while (i < TILE.length - 1 && t > TILE[i].t) i++;
  const a = TILE[i - 1], b = TILE[i];
  const k = (t - a.t) / (b.t - a.t);
  return [a.c[0] + (b.c[0] - a.c[0]) * k, a.c[1] + (b.c[1] - a.c[1]) * k, a.c[2] + (b.c[2] - a.c[2]) * k];
}

// Sheen angle copied from the 48px icon so the two read as the same object.
const SH = { x: (26 / 48) * SIZE, y: (34 / 48) * SIZE };
const SH_LEN2 = SH.x * SH.x + SH.y * SH.y;

/* --------------------------------------------------------------- draw ---- */
function segDist(qx, qy, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((qx - ax) * dx + (qy - ay) * dy) / len2;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = ax + t * dx - qx, ey = ay + t * dy - qy;
  return Math.sqrt(ex * ex + ey * ey);
}

/** 1 inside, 0 outside, ramped across one pixel at the boundary. */
function coverage(d, edge) {
  const v = edge + 0.5 - d;
  return v <= 0 ? 0 : v >= 1 ? 1 : v;
}

const raw = Buffer.alloc(SIZE * (SIZE * 3 + 1));
let p = 0;

for (let y = 0; y < SIZE; y++) {
  raw[p++] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const qx = x + 0.5, qy = y + 0.5;

    let [r, g, b] = tileColor((qx + qy) / (2 * SIZE));

    let st = (qx * SH.x + qy * SH.y) / SH_LEN2;
    st = st < 0 ? 0 : st > 1 ? 1 : st;
    const sa = 0.28 * (1 - st);
    r += (255 - r) * sa;
    g += (255 - g) * sa;
    b += (255 - b) * sa;

    let dMin = Infinity;
    for (const pts of STROKES) {
      for (let i = 0; i < pts.length - 1; i++) {
        const d = segDist(qx, qy, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
        if (d < dMin) dMin = d;
      }
    }
    const cs = coverage(dMin, HALF);
    if (cs > 0) {
      r += (255 - r) * cs;
      g += (255 - g) * cs;
      b += (255 - b) * cs;
    }

    const cd = coverage(Math.hypot(qx - DOT.x, qy - DOT.y), DOT.r);
    if (cd > 0) {
      r += (ACCENT[0] - r) * cd;
      g += (ACCENT[1] - g) * cd;
      b += (ACCENT[2] - b) * cd;
    }

    raw[p++] = r + 0.5;
    raw[p++] = g + 0.5;
    raw[p++] = b + 0.5;
  }
}

/* ---------------------------------------------------------------- PNG ---- */
const CRC = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return (buf) => {
    let c = -1;
    for (const byte of buf) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolour

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);
console.log(`✓ ${OUT} · ${SIZE}×${SIZE} · ${(png.length / 1024).toFixed(0)} كيلوبايت`);
