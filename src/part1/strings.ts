// Every string Part 0 and Part 1 put on screen, in one place.
//
// The values are the "On screen" lines of script version 3 for beats 0.1 to
// 1.5, with the amendments that came out of the fact-check. Each amendment is
// recorded in docs/brief-part-1.md (P1 to P12) and marked here.

import {GLYPH} from '../kit/theme';

const {minus, enDash, middot} = GLYPH;

export const NOT_MEDICAL_ADVICE = 'Not medical advice';

// ------------------------------------------------------------- the studies

export type Study = {
  /** The citation of the study under discussion, for the band at the top. */
  citation: string;
  /** Its design tag. */
  tag: string;
  /** The short form that stays beside a study's figures when the band has moved on. */
  short?: string;
};

export const STUDY = {
  // P4: the journal reference, which the script left to be confirmed, and a design tag.
  faraone: {
    citation: `Faraone and Larsson (2019). Mol Psychiatry 24(4), 562${enDash}575.`,
    tag: 'REVIEW, 37 TWIN STUDIES',
  },
  skodzik: {
    citation: `Skodzik, Holling and Pedersen (2017). J Atten Disord 21(4), 267${enDash}283.`,
    tag: 'META-ANALYSIS, ADULTS',
    short: 'SKODZIK ET AL. 2017',
  },
  pawley: {
    citation: 'Pawley et al. (2024). Neuroscience Applied 3, 103941.',
    tag: 'CASE-CONTROL, 205 VS 50',
    short: 'PAWLEY ET AL. 2024',
  },
  // P4: the journal reference, which the script does not give.
  martinussen: {
    citation: `Martinussen et al. (2005). J Am Acad Child Adolesc Psychiatry 44(4), 377${enDash}384.`,
    tag: 'META-ANALYSIS, 26 STUDIES, CHILDREN',
    short: 'MARTINUSSEN ET AL. 2005',
  },
  alderson: {
    citation: `Alderson et al. (2013). Neuropsychology 27(3), 287${enDash}302.`,
    tag: 'META-ANALYSIS, 38 STUDIES, ADULTS',
    short: 'ALDERSON ET AL. 2013',
  },
  willcutt: {
    citation: `Willcutt et al. (2005). Biol Psychiatry 57(11), 1336${enDash}1346.`,
    tag: 'META-ANALYSIS, 83 STUDIES, N = 3,734 WITH ADHD',
    short: 'WILLCUTT ET AL. 2005',
  },
  // P3: fifteen trials, reported in sixteen papers. The script has 16 RCTS.
  cortese: {
    citation: `Cortese et al. (2015). J Am Acad Child Adolesc Psychiatry 54(3), 164${enDash}174.`,
    tag: 'META-ANALYSIS, 15 RCTS, N = 759',
    short: 'CORTESE ET AL. 2015',
  },
} as const satisfies Record<string, Study>;

export type StudyId = keyof typeof STUDY;

// ------------------------------------------------- 0.1 What is not in question

export const HERITABILITY = {
  line: 'HERITABILITY NEAR 0.74, TWIN STUDIES',
  /** P5: what the figure is, in the paper's words. The paper gives no interval. */
  note: 'Mean heritability across 37 twin studies of ADHD or of inattention and hyperactivity: 74%',
} as const;

export const OVERLAP = {
  /** P6: the script marks this figure "DATA, computed". The word says so on screen. */
  head: 'COMPUTED',
  comparison: 'COMPARISON',
  adhd: 'ADHD',
  effect: 'd = 0.5',
  value: 'DISTRIBUTIONS OVERLAP BY 80%',
  note: 'Two normal curves of equal spread, half a standard deviation apart. Shared area: 80.3%',
  axis: 'SCORE, IN STANDARD DEVIATIONS',
  single: 'A SINGLE CASE',
} as const;

/** What the two curves are drawn from. */
export const OVERLAP_D = 0.5;

// --------------------------------------------------------- the evidence table

export const TABLE_ROWS = ['H1 MEMORY', 'H2 ATTENTION', 'H3 DOPAMINE'] as const;
export const TABLE_COLUMNS = ['PREDICTION', 'RESULT', 'STATUS'] as const;

/** Row H1, cell by cell, in the lines it is set in. */
export const H1 = {
  prediction: ['LOSS IN RETENTION AND RETRIEVAL'],
  result: ['ENCODING AND WORKING MEMORY WEAKER,', 'MODERATE, NOT UNIVERSAL'],
  status: ['INVOLVED.', 'NOT SUPPORTED AS THE DEFINING DEFICIT.'],
} as const;

// ------------------------------------------------- 1.1 and 1.2 the three stages

export const STAGES = ['ACQUISITION', 'RETENTION', 'RETRIEVAL'] as const;
export const PREDICTED_SITE = 'PREDICTED SITE';

export type Finding = {
  label: string;
  value: string;
  /** The statistic the paper reports for it, where it reports one. */
  note?: string;
};

export const SKODZIK_FINDINGS: readonly Finding[] = [
  {label: 'VERBAL LONG-TERM MEMORY', value: 'WEAKER'},
  // P7: the script has NO DIFFERENCE. The paper found no significant difference.
  {label: 'VISUAL', value: 'NO SIGNIFICANT DIFFERENCE'},
  {label: 'RETRIEVAL', value: 'NO DEFICIT OBSERVED'},
];

export const PAWLEY_FINDINGS: readonly Finding[] = [
  // P8: each finding carries the statistic the paper reports for it.
  {
    label: 'INITIAL LEARNING',
    value: 'PRESERVED',
    note: `Standardised difference ${minus}0.22, 95% CI [${minus}0.55, 0.10], p = .175`,
  },
  {
    label: 'DELAYED RECALL',
    value: 'REDUCED',
    note: `Standardised difference ${minus}0.38, 95% CI [${minus}0.70, ${minus}0.06], p = .021`,
  },
];

// --------------------------------------------------------- 1.3 working memory

export type ForestRowText = {
  label: string;
  /** The point estimate as it is printed. */
  value: string;
  /** Its interval, in square brackets. */
  interval: string;
  /** The numbers the row is drawn from: estimate, lower bound, upper bound. Null where the paper was not read. */
  drawn: readonly [number, number, number] | null;
};

const row = (label: string, estimate: number, low: number, high: number): ForestRowText => {
  const show = (n: number): string => (n < 0 ? `${minus}${Math.abs(n).toFixed(2)}` : n.toFixed(2));
  return {label, value: show(estimate), interval: `[${show(low)}, ${show(high)}]`, drawn: [estimate, low, high]};
};

export const WM_PLOT = {
  head: 'EFFECT SIZE, ADHD AGAINST COMPARISON GROUP',
  /** The direction of the plot, at its right end, as in the cold open (A7). */
  direction: 'WEAKER IN ADHD',
  children: `CHILDREN ${middot} ${STUDY.martinussen.short}`,
  adults: `ADULTS ${middot} ${STUDY.alderson.short}`,
} as const;

/** P9: each estimate carries its interval. The script draws point estimates only. */
export const WM_CHILDREN: readonly ForestRowText[] = [
  row('SPATIAL STORAGE', 0.85, 0.62, 1.08),
  row('SPATIAL CENTRAL EXECUTIVE', 1.06, 0.72, 1.39),
  row('VERBAL STORAGE', 0.47, 0.36, 0.59),
  row('VERBAL CENTRAL EXECUTIVE', 0.43, 0.24, 0.62),
];

/**
 * The adult estimates. The script: "The film speaks no number here, so draw
 * none without the paper." The paper's abstract gives the size in a word.
 */
export const WM_ADULTS: readonly ForestRowText[] = [
  {label: 'PHONOLOGICAL', value: 'MODERATE', interval: '', drawn: null},
  {label: 'VISUOSPATIAL', value: 'MODERATE', interval: '', drawn: null},
];

export const TESTS = {
  head: 'TWO FURTHER TESTS',
  boxes: ['PRESENT IN MOST CASES', 'REDUCING IT REDUCES THE DISORDER'],
} as const;

// -------------------------------------------------------------- 1.4 two tests

export const EF_BAND = {
  group: `EXECUTIVE FUNCTION ${middot} ${STUDY.willcutt.short}`,
  label: 'ALL EXECUTIVE MEASURES',
  value: `0.46${enDash}0.69`,
  /** The two ends the band is drawn from. */
  drawn: [0.46, 0.69],
} as const;

export const TRAINING_PLOT = {
  head: 'STANDARDISED MEAN DIFFERENCE, TRAINING AGAINST CONTROL',
  direction: 'IMPROVED WITH TRAINING',
  group: `COGNITIVE TRAINING ${middot} ${STUDY.cortese.short}`,
} as const;

export const TRAINING_ROWS: readonly ForestRowText[] = [
  row('VERBAL WORKING MEMORY', 0.52, 0.24, 0.8),
  row('VISUAL WORKING MEMORY', 0.47, 0.23, 0.7),
  // P10: the script has SYMPTOMS, UNBLINDED. The paper's rater is the one most
  // proximal to the treatment, "typically unblinded", and not always.
  row('SYMPTOMS, MOST PROXIMAL RATER', 0.37, 0.09, 0.66),
  row('SYMPTOMS, PROBABLY BLINDED RATER', 0.2, 0.01, 0.4),
];

/** P11: the paper's own answer to the second test, for training of working memory alone. */
export const TRAINING_NOTE = [
  `Training of working memory alone, 6 trials: ADHD symptoms 0.00 [${minus}0.31, 0.31],`,
  'rated by the most proximal rater.',
] as const;

/** Ticks of the effect-size axis the two plots share. */
export const AXIS_TICKS = [
  {at: 0, label: '0'},
  {at: 0.5, label: '0.5'},
  {at: 1, label: '1.0'},
] as const;

// The words DATA and SCHEMATIC belong to the kit: src/kit/FigureMark.tsx.
