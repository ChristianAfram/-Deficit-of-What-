// Geometry that the figures of the cold open share. The film-wide grid is in
// src/kit/grid.ts. Each figure keeps its own geometry in its own file.

/** Alignment verticals of the data figure. */
export const DATA_X = {
  /** Right edge of the value column. */
  value: 944,
  /** The zero line of the percent-change bars. */
  zero: 1380,
  /** Px per percentage point. The scale is not printed: the values carry it. */
  pxPerPoint: 7,
} as const;
