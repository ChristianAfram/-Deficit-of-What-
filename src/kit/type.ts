// Every text role of the film: family, weight, size, tracking and case.
// No role is below 20 px, and every note is 24 px. Ids such as Y01 name the
// role in the design, docs/build-spec-cold-open.md, section 3.

import {FONT} from './fonts';
import {PALETTE} from './theme';

/**
 * The three strengths of bone used for text. B72 is 8.1:1 on the ground and
 * B56 is 5.3:1. Graphite is for lines only and is never used for text.
 */
export const BONE = {b100: 1, b72: 0.72, b56: 0.56} as const;

export type TypeRole = {
  family: string;
  weight: 400 | 500 | 600;
  /** Font size in px on the 1920 x 1080 canvas. */
  size: number;
  /** Letter spacing in em. */
  tracking: number;
  /** Default colour and strength. A figure may override both. */
  fill: string;
  opacity: number;
  /**
   * Tabular, lining figures. On for citations, values and statistics. Off for
   * running sentences: in Inter the feature also widens the hyphen, which
   * would set "3-week" as "3 - week".
   */
  tabular: boolean;
};

const condensed = (weight: 500 | 600, size: number, tracking: number, opacity: number = BONE.b100): TypeRole => ({
  family: FONT.condensed,
  weight,
  size,
  tracking,
  fill: PALETTE.bone,
  opacity,
  tabular: false,
});

const text = (weight: 400 | 500 | 600, size: number, opacity: number = BONE.b100, tabular = false): TypeRole => ({
  family: FONT.text,
  weight,
  size,
  tracking: 0,
  fill: PALETTE.bone,
  opacity,
  tabular,
});

export const TYPE = {
  /** Y01. The citation of the study under discussion. */
  citation: text(500, 28, BONE.b100, true),
  /** Y02. The design tag and its separators. */
  tag: condensed(600, 22, 0.08, BONE.b72),
  /** Y03. The DATA or SCHEMATIC mark. */
  mark: condensed(600, 20, 0.14, BONE.b72),
  /** Y04. The head of a plot. */
  plotHead: condensed(600, 20, 0.1, BONE.b72),
  /** Y05. Sequence labels of the crossover diagram. */
  sequence: condensed(600, 22, 0.06),
  /** Y06. The letter in the randomisation node. */
  node: condensed(600, 24, 0),
  /** Y06. The same letter in the legend. */
  nodeLegend: condensed(600, 20, 0),
  /** Y07. Condition labels in the unmasked blocks. */
  condition: condensed(600, 22, 0.06),
  /** Y08. The duration label in each block. */
  blockNote: condensed(500, 20, 0.08, BONE.b72),
  /** Y09. Legend words. */
  legend: condensed(500, 20, 0.1, BONE.b72),
  /** Y10. Row labels of a data figure. */
  rowLabel: condensed(600, 26, 0.05),
  /** Y11. A value: +37%, −53%. Amber by default, as "the result". */
  value: {...text(600, 32, BONE.b100, true), fill: PALETTE.amber},
  /** Y12. A value given in words: NO DETECTABLE EFFECT. */
  valueWords: {...condensed(600, 26, 0.05), fill: PALETTE.amber},
  /** Y13. The note under a row: measure, statistic, interval. */
  note: text(400, 24, BONE.b72, true),
  /** Y14. The limits note under a figure. */
  limits: text(400, 24, BONE.b72),
  /** Y15. The word DEFICIT. */
  deficit: condensed(600, 200, 0.04),
  /** Y16. Column heads of the evidence table. */
  tableHead: condensed(600, 22, 0.1),
  /** Y17. Row ids and names of the evidence table. */
  tableRow: condensed(600, 26, 0.05),
  /** Y18. The title. */
  title: condensed(600, 128, 0.03),
  /** Y19. The subtitle. */
  subtitle: text(400, 32, BONE.b72),
  /** Y20. "Not medical advice". */
  footer: text(500, 24, BONE.b72),
  /** Y21. Narration captions of the review build. */
  caption: text(400, 32),
  /** Y22. The review overlay. */
  review: text(400, 20, BONE.b56, true),
} as const satisfies Record<string, TypeRole>;

export type TypeRoleName = keyof typeof TYPE;
