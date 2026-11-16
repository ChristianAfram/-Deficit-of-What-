// Geometry that the figures of Part 0 and Part 1 share. The film-wide grid is
// in src/kit/grid.ts. Every value is in whole canvas px.

import type {EvidenceTableGeometry} from '../kit/EvidenceTable';
import type {ForestAxis} from '../kit/ForestRow';
import {LIVE} from '../kit/grid';

/** Top left corner of a figure's DATA or SCHEMATIC mark, and the baseline of the head beside it. */
export const MARK = {x: LIVE.left, y: 176, headBaseline: 197} as const;

/**
 * The evidence table, drawn to be filled. It spans the live width, so that a
 * cell holds a line of 432 px, and each row holds three lines.
 * Columns: stub 128–400, PREDICTION 400–864, RESULT 864–1328, STATUS 1328–1792.
 * Rows: header 400–456, H1 456–568, H2 568–680, H3 680–792.
 */
export const TABLE: EvidenceTableGeometry = {
  columnEdges: [LIVE.left, 400, 864, 1328, LIVE.right],
  rowEdges: [400, 456, 568, 680, 792],
  textInset: 16,
  nameOffset: 40,
  headBaselineOffset: 36,
  rowBaselineOffset: 65,
};

/** The columns of the two forest plots. Both plots share one zero line and one scale. */
export const FOREST: ForestAxis = {
  left: LIVE.left,
  valueRight: 624,
  intervalLeft: 640,
  zeroX: 830,
  pxPerUnit: 310,
};

/** The frame of the forest plots: the zero line, the printed axis and the baselines of the rows. */
export const PLOT = {
  /** The zero line runs from here down to the axis. */
  top: 216,
  axisY: 668,
  /** The right end of the axis. The check boxes stand to the right of it. */
  right: 1280,
  tickLabelBaseline: 700,
  /** The line that names the study of a group of rows. */
  groupBaseline: [252, 532],
  /** Baselines of the rows: four under the first group, two under the second. */
  rowBaseline: [300, 356, 412, 468, 580, 636],
  /** The note under the axis. */
  noteBaseline: [760, 792],
} as const;

/** The two check boxes, to the right of the plot. Each stands on the baseline of a row. */
export const TESTS_BOX = {
  x: 1340,
  headBaseline: PLOT.groupBaseline[0],
  /** Top of each box: 23 px above the baseline its label shares with a row. */
  y: [PLOT.rowBaseline[0] - 23, PLOT.rowBaseline[1] - 23],
} as const;

/** The three stages of a memory test, in a line across the live width. */
export const STAGE = {
  top: 224,
  height: 80,
  width: 480,
  left: [128, 720, 1312],
  labelBaseline: 273,
  /** The tag under a stage that the hypothesis predicts. */
  predictedBaseline: 338,
  /** The middle of a study's marker, under the stage it settles on, and its label under that. */
  markerY: 332,
  markerLabelBaseline: 372,
} as const;

/** The findings of the two studies, in two blocks under the stages. */
export const FINDINGS = {
  headBaseline: 440,
  /** Left edge and value column of each block. */
  block: [
    {left: 128, valueRight: 680},
    {left: 720, valueRight: 1200},
  ],
  /** Baselines of the rows of each block. A note sits 32 px under its row. */
  rowBaseline: [
    [496, 552, 608],
    [496, 584],
  ],
  noteBelow: 32,
} as const;

/** The two normal curves of beat 0.1. */
export const CURVES = {
  /** The middle of the figure: halfway between the two means. */
  centreX: 960,
  /** Px per standard deviation. */
  sd: 180,
  baselineY: 700,
  /** Height of each curve at its mean. */
  peak: 360,
  /** The axis runs this far to each side of the middle. */
  halfWidth: 696,
} as const;
