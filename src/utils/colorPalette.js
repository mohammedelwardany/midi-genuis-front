// Generates a Tailwind-style 9-shade palette (50-900) from a single base
// color, so a platform admin only ever has to pick one "brand color" rather
// than hand-picking 9 individually-coherent shades. The base color is
// treated as shade 600 (the shade most buttons/badges actually use, e.g.
// bg-primary-600), and every other shade is derived by offsetting its
// lightness in HSL space while keeping hue/saturation constant - the
// offsets below were reverse-engineered from the app's own default blue
// palette (site.config.json) so a re-generated default blue lands close to
// the original hand-picked values.
const LIGHTNESS_DELTA_FROM_600 = {
  50: 44, 100: 40, 200: 34, 300: 25, 400: 15,
  500: 7, 600: 0, 700: -7, 800: -14, 900: -21,
};

export function hexToHsl(hex) {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Given one hex color (treated as shade 600), returns the full { "50": "#...", ..., "900": "#..." } palette. */
export function generatePrimaryShades(baseHex) {
  const { h, s, l } = hexToHsl(baseHex);
  const shades = {};
  Object.entries(LIGHTNESS_DELTA_FROM_600).forEach(([shade, delta]) => {
    const targetL = Math.max(4, Math.min(98, l + delta));
    shades[shade] = hslToHex(h, s, targetL);
  });
  return shades;
}
