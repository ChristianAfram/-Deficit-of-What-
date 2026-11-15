// The fixed grid of every frame of the film, on the 1920 x 1080 canvas.

/** The live width: every left edge sits on `left`, every right edge on `right`. */
export const LIVE = {left: 128, right: 1792} as const;

/** Rows of the canvas that each band owns. Nothing crosses a band. */
export const BAND = {
  /** The citation and the design tag. */
  citation: [48, 148],
  /** Figures, tables and titles. */
  content: [168, 852],
  /** Narration captions in a review build. Empty in the film. */
  caption: [868, 964],
  /** "Not medical advice" at the right. The review overlay at the left. */
  footer: [984, 1040],
} as const;

/** Baselines of the furniture. */
export const BASELINE = {citation: 92, tag: 132, footer: 1024} as const;
