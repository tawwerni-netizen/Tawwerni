/**
 * Contrast auditor for text sitting on a gradient.
 *
 * The main auditor skips these entirely — a gradient has no single colour to
 * measure against, so it bails rather than guess. That left every brand-
 * coloured panel unchecked, and it is exactly where the worst bug was hiding:
 * `text-brand-100/80` on a teal gradient resolves, in night mode, to dark green
 * on dark green.
 *
 * Two things this has to get right or it just invents failures:
 *
 *  - **Compositing.** Most gradients here are a translucent tint painted over a
 *    solid surface — `linear-gradient(var(--tint), transparent), var(--surface)`.
 *    Measuring the tint on its own reported dark text on a nearly-invisible
 *    teal and called it 1.04:1. What the eye sees is the composite.
 *  - **Sweeps.** A transparent → white → transparent layer is the shine
 *    animation on a button, not its resting background. It crosses in under a
 *    second and never sits under the label at rest.
 *
 * A gradient is only as readable as its worst point, so every stop is tested
 * and the lowest ratio is the one reported.
 */
window.__gradientAudit = function (win) {
  const doc = win.document;

  const cv = doc.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });

  function rgb(str) {
    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = str;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    } catch (e) {
      return null;
    }
  }

  const lum = function (c) {
    const f = function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };

  const ratio = function (a, b) {
    const L1 = lum(a);
    const L2 = lum(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };

  function over(top, base) {
    const a = top.a;
    return {
      r: Math.round(top.r * a + base.r * (1 - a)),
      g: Math.round(top.g * a + base.g * (1 - a)),
      b: Math.round(top.b * a + base.b * (1 - a)),
      a: 1,
    };
  }

  function backingOf(start) {
    let n = start;
    while (n && n !== doc.documentElement) {
      const c = rgb(win.getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.85) return c;
      n = n.parentElement;
    }
    return rgb(win.getComputedStyle(doc.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  }

  function stopsOf(bgImage, base) {
    const found = bgImage.match(
      /(rgba?\([^)]+\)|lab\([^)]+\)|oklch\([^)]+\)|#[0-9a-fA-F]{3,8})/g
    );
    if (!found) return [];

    const parsed = [];
    for (let i = 0; i < found.length; i++) {
      const c = rgb(found[i]);
      if (c) parsed.push(c);
    }
    if (parsed.length === 0) return [];

    // A pure highlight sweep is animation, not background.
    let allWhitish = true;
    for (let i = 0; i < parsed.length; i++) {
      const c = parsed[i];
      if (!(c.r > 230 && c.g > 230 && c.b > 230)) {
        allWhitish = false;
        break;
      }
    }
    if (allWhitish) return [];

    const out = [];
    for (let i = 0; i < parsed.length; i++) {
      const c = parsed[i];
      if (c.a <= 0.02) continue;
      out.push(c.a < 0.99 ? over(c, base) : c);
    }
    return out;
  }

  /**
   * Splits a computed background-image into its layers.
   *
   * CSS paints the LAST layer first, so a translucent glow listed before an
   * opaque gradient sits on top of it. Measuring every stop against the page
   * background ignored that and reported white-on-teal as white-on-white.
   * Splitting on top-level commas keeps the layer order intact.
   */
  function layersOf(bgImage) {
    const parts = [];
    let depth = 0;
    let buf = "";
    for (let i = 0; i < bgImage.length; i++) {
      const ch = bgImage[i];
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        parts.push(buf.trim());
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf.trim()) parts.push(buf.trim());
    return parts;
  }

  function gradientUnder(el) {
    let n = el;
    while (n && n !== doc.documentElement) {
      const s = win.getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== "none") {
        const own = rgb(s.backgroundColor);
        let base = own && own.a > 0.85 ? own : backingOf(n.parentElement);

        // Bottom layer up, so each translucent layer composites over the
        // result of everything already painted beneath it.
        const layers = layersOf(s.backgroundImage).reverse();
        let stops = [];
        for (let i = 0; i < layers.length; i++) {
          const layerStops = stopsOf(layers[i], base);
          if (!layerStops.length) continue;
          stops = layerStops;
          // The darkest stop becomes the base for whatever paints on top.
          let darkest = layerStops[0];
          for (let j = 1; j < layerStops.length; j++) {
            if (lum(layerStops[j]) < lum(darkest)) darkest = layerStops[j];
          }
          base = darkest;
        }
        if (stops.length) return stops;
      }
      const c = rgb(s.backgroundColor);
      if (c && c.a > 0.85) return null;
      n = n.parentElement;
    }
    return null;
  }

  function faded(el) {
    let n = el;
    while (n && n !== doc.documentElement) {
      if (parseFloat(win.getComputedStyle(n).opacity) < 0.9) return true;
      n = n.parentElement;
    }
    return false;
  }

  return function () {
    const bad = [];
    let checked = 0;

    doc.querySelectorAll("*").forEach(function (el) {
      const s = win.getComputedStyle(el);
      if (!el.offsetParent && s.position !== "fixed") return;
      if (s.visibility === "hidden" || faded(el)) return;

      let own = "";
      el.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) own += n.textContent.trim() + " ";
      });
      own = own.trim();
      if (!own) return;

      const stops = gradientUnder(el);
      if (!stops) return;

      const fg = rgb(s.color);
      if (!fg) return;

      checked++;
      const size = parseFloat(s.fontSize);
      const bold = parseInt(s.fontWeight) >= 700;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;

      let worst = Infinity;
      for (let i = 0; i < stops.length; i++) worst = Math.min(worst, ratio(fg, stops[i]));

      if (worst < need) {
        bad.push({
          t: own.slice(0, 30),
          cr: +worst.toFixed(2),
          need: need,
          fg: s.color,
          cls: String(el.className || "").slice(0, 45),
        });
      }
    });

    return {
      checked: checked,
      low: bad.length,
      worst: bad.sort(function (a, b) {
        return a.cr - b.cr;
      }).slice(0, 6),
    };
  };
};
