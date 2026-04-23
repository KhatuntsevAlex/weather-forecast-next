// Chart SVG geometry (viewBox units).
export const W = 400;
export const H = 220;
export const PAD_L = 36;
export const PAD_R = 10;
export const PAD_T = 12;
export const PAD_B = 28;
export const INNER_W = W - PAD_L - PAD_R;
export const INNER_H = H - PAD_T - PAD_B;

// Tooltip transition duration (ms). 0 = instant.
export const SMOOTH_MS = 0;

export interface Point {
  label: string;
  value: number;
}
