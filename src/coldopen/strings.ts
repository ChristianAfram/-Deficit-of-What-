// Every string the cold open and the title put on screen, in one place.
//
// The values are the "On screen" lines of script version 3, with the
// amendments that came out of the fact-check and the specialist review. Each
// amendment is recorded in docs/brief-cold-open.md (A1 to A8) and marked here.

import {GLYPH} from '../kit/theme';

const {minus, enDash} = GLYPH;

export const CITATION = `Pelham et al. (2022). J Consult Clin Psychol 90(5), 367${enDash}380.`;

export const DESIGN_TAG = [
  'RCT, TRIPLE-MASKED AB/BA CROSSOVER',
  `N = 173, AGES 7${enDash}12`,
  'OROS-MPH VS PLACEBO',
] as const;

export const NOT_MEDICAL_ADVICE = 'Not medical advice';

export type ResultRowText = {
  /** The measure, as the paper defines it. */
  label: string;
  /** The result as the narration speaks it. */
  value: string;
  /** Where it was measured, and the statistic the paper reports for it (A2). */
  note: string;
};

export const RESULT_ROWS: readonly ResultRowText[] = [
  {
    // A2: CORRECT added, because the measure is problems correctly completed.
    label: 'ARITHMETIC PROBLEMS CORRECT PER MINUTE',
    value: '+37%',
    note: 'Academic seatwork. Difference +1.79 per minute, 95% CI [1.68, 1.90]',
  },
  {
    label: 'RULE VIOLATIONS PER HOUR',
    value: `${minus}53%`,
    // The paper's name for this measure is "classroom behavior".
    note: `Classroom behaviour. Difference ${minus}2.02 per hour, 95% CI [${minus}2.18, ${minus}1.86]`,
  },
  {
    label: 'CURRICULUM CONTENT LEARNED',
    value: 'NO DETECTABLE EFFECT',
    note: 'Unit tests, before and after. Test × medication: p = .73 (subject area), p = .75 (vocabulary)',
  },
];

/** A7. The head of the plot: what the bars compare. It reuses the words of the design tag. */
export const PLOT_HEAD = 'OROS-MPH RELATIVE TO PLACEBO';

/**
 * A7. The two directions of the plot, at its two ends. Both results favour
 * methylphenidate, on opposite sides of zero: without these words, a bar to
 * the left of zero reads, by the convention of a forest plot, as "favours
 * placebo". They are the narration's own words: "more", "fewer".
 */
export const PLOT_DIRECTION = {left: 'FEWER', right: 'MORE'} as const;

/** The percent changes the two bars are drawn from. Row 3 has no bar. */
export const RESULT_PERCENT: readonly (number | null)[] = [37, -53, null];

/** A3: shown when the cold open ships as a film of its own. */
export const LIMITS = [
  'Limits: a summer programme, 3-week units, small groups with behaviour management, 80% of children on 18 mg, the lowest dose titrated.',
  'The authors call for replication in ordinary classrooms over a school year.',
] as const;

/** The crossover diagram (SCHEMATIC). A4: each block is one "3 WEEKS" phase. */
export const DIAGRAM = {
  sequences: ['SEQUENCE AB', 'SEQUENCE BA'],
  block: '3 WEEKS',
  masked: 'MASKED',
  methylphenidate: 'METHYLPHENIDATE',
  placebo: 'PLACEBO',
  randomised: 'RANDOMISED',
} as const;

export const DEFICIT_WORD = 'DEFICIT';

export const TABLE_ROWS = ['H1 MEMORY', 'H2 ATTENTION', 'H3 DOPAMINE'] as const;
export const TABLE_COLUMNS = ['PREDICTION', 'RESULT', 'STATUS'] as const;

export const TITLE = 'DEFICIT OF WHAT?';
export const SUBTITLE = 'Three hypotheses about ADHD, tested against their own predictions.';

// The words DATA and SCHEMATIC belong to the kit: src/kit/FigureMark.tsx.
