/**
 * WCAG contrast auditor, meant to be eval'd inside a page.
 *
 * Two things it gets right that the first version didn't:
 *
 *  - Colours are resolved by painting them to a canvas and reading the pixel
 *    back. Tailwind v4 emits `oklch(...)`, which computes to `lab(...)`;
 *    pulling the numbers out of that string as if it were `rgb()` invented
 *    dozens of failures that were not real.
 *  - Opacity is checked up the ancestor chain. Entrance animations start at
 *    opacity 0 on a PARENT, so auditing mid-animation reported a fade-in frame
 *    as unreadable text.
 *
 * Returns { checked, low, worst }.
 */
window.__contrastAudit = function (win) {
  const doc = win.document;
  const cv = doc.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const cache = new Map();

  function rgb(str) {
    if (cache.has(str)) return cache.get(str);
    let out = null;
    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = str;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    } catch (e) {
      out = null;
    }
    cache.set(str, out);
    return out;
  }

  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };

  const ratio = (a, b) => {
    const L1 = lum(a);
    const L2 = lum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };

  function faded(el) {
    let n = el;
    while (n && n !== doc.documentElement) {
      if (parseFloat(win.getComputedStyle(n).opacity) < 0.9) return true;
      n = n.parentElement;
    }
    return false;
  }

  function bgOf(el) {
    let n = el;
    while (n && n !== doc.documentElement) {
      const s = win.getComputedStyle(n);
      // A gradient can't be reduced to one colour, so skip rather than guess.
      if (s.backgroundImage && s.backgroundImage !== "none") return "GRADIENT";
      const c = rgb(s.backgroundColor);
      if (c && c.a > 0.85) return c;
      n = n.parentElement;
    }
    return rgb(win.getComputedStyle(doc.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  }

  return function () {
    const bad = [];
    let checked = 0;

    doc.querySelectorAll("*").forEach((el) => {
      const s = win.getComputedStyle(el);
      if (!el.offsetParent && s.position !== "fixed") return;
      if (s.visibility === "hidden" || faded(el)) return;

      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim())
        .join(" ");
      if (!own) return;

      const fg = rgb(s.color);
      if (!fg) return;
      const bg = bgOf(el);
      if (bg === "GRADIENT") return;

      checked++;
      const size = parseFloat(s.fontSize);
      const bold = parseInt(s.fontWeight) >= 700;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      const cr = ratio(fg, bg);

      if (cr < need) {
        bad.push({
          t: own.slice(0, 30),
          cr: +cr.toFixed(2),
          need,
          cls: String(el.className || "").slice(0, 45),
        });
      }
    });

    return { checked, low: bad.length, worst: bad.sort((a, b) => a.cr - b.cr).slice(0, 4) };
  };
};
