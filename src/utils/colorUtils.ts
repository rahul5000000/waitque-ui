export function isBright(hexColor: string): boolean {
  // Remove leading '#' if present
  const hex = hexColor.replace('#', '');

  // Parse RGB components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (per ITU-R BT.709)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If color is bright, return dark text; otherwise, light text
  return luminance > 0.6
}

export function getContrastingTextColor(hexColor: string): string {
  if (!hexColor) return '#000'; // default black
  return isBright(hexColor) ? brightenHex(hexColor, 0.4) : brightenHex(hexColor, 3);
}

export function getContrastingMonochromeTextColor(hexColor: string): string {
  if (!hexColor) return '#000'; // default black
  return isBright(hexColor) ? '#000000' : '#FFFFFF';
}

export function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

export function brightenRgb(rgb, factor) {
  const r = Math.min(255, Math.floor(rgb.r * factor));
  const g = Math.min(255, Math.floor(rgb.g * factor));
  const b = Math.min(255, Math.floor(rgb.b * factor));
  return { r, g, b };
}

export function rgbToHex(rgb) {
  const toHex = (c) => ("0" + c.toString(16)).slice(-2);
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function brightenHex(hex, factor) {
  const rgb = hexToRgb(hex);
  const brighterRgb = brightenRgb(rgb, factor); 
  return rgbToHex(brighterRgb);
}