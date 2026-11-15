// Every string the cold open and the title put on screen, in one place.
// The values come from the "On screen" lines of script version 3. Where the
// fact-check against the paper changed a string, the change is recorded in
// docs/fact-check-cold-open.md and noted beside the string.

import {GLYPH} from '../kit/theme';

const {minus, enDash} = GLYPH;

export const CITATION = `Pelham et al. (2022). J Consult Clin Psychol 90(5), 367${enDash}380.`;

export const DESIGN_TAG = [
  'RCT, TRIPLE-MASKED AB/BA CROSSOVER',
  `N = 173, AGES 7${enDash}12`,
  'OROS-MPH VS PLACEBO',
] as const;

export const NOT_MEDICAL_ADVICE = 'Not medical advice';

export type ResultRowText = {label: string; value: string};

export const RESULT_ROWS: readonly ResultRowText[] = [
  {label: 'ARITHMETIC PROBLEMS PER MINUTE', value: '+37%'},
  {label: 'RULE VIOLATIONS PER HOUR', value: `${minus}53%`},
  {label: 'CURRICULUM CONTENT LEARNED', value: 'NO DETECTABLE EFFECT'},
];

export const DEFICIT_WORD = 'DEFICIT';

export const TABLE_ROWS = ['H1 MEMORY', 'H2 ATTENTION', 'H3 DOPAMINE'] as const;
export const TABLE_COLUMNS = ['PREDICTION', 'RESULT', 'STATUS'] as const;

export const TITLE = 'DEFICIT OF WHAT?';
export const SUBTITLE = 'Three hypotheses about ADHD, tested against their own predictions.';

export const FIGURE_MARK = {data: 'DATA', schematic: 'SCHEMATIC'} as const;
