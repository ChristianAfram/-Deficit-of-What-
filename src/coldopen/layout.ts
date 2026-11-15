// The fixed geometry of the cold open on the 1920 x 1080 canvas.
// Build spec, section 2.1. Figure-internal geometry lives with each figure.

/** The live width: every left edge sits on `left`, every right edge on `right`. */
export const LIVE = {left: 128, right: 1792} as const;

/** Rows of the canvas that each band owns. Nothing crosses a band. */
export const BAND = {
  /** The citation and the design tag. */
  citation: [48, 148],
  /** Figures, the table and the title. Camera layers are clipped to it. */
  content: [168, 852],
  /** Narration captions in the review build. Empty in the clean build. */
  caption: [868, 964],
  /** "Not medical advice" at the right. The review overlay at the left. */
  footer: [984, 1040],
} as const;

/** Baselines of the furniture. */
export const BASELINE = {
  citation: 92,
  tag: 132,
  captionLast: 952,
  captionFirst: 912,
  footer: 1024,
} as const;

/** Alignment verticals of the data figure. */
export const DATA_X = {
  /** Right edge of the value column. */
  value: 944,
  /** The zero line of the percent-change bars. */
  zero: 1380,
  /** Px per percentage point. The scale is not printed: the values carry it. */
  pxPerPoint: 7,
} as const;
