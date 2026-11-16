// The shot list of Part 0 and Part 1 as data: when every mark appears and
// when each sound plays.
//
// Nothing here is an absolute frame chosen by hand. Every cue is placed on a
// spoken word (through `atWord`), on a sentence, on a beat or on a freeze
// window, so when the voice is recorded and the cue sheet changes, the
// picture and the sound follow it. tests/part1-still-rule.test.ts checks this
// table against the still rule and against the order of the shots.

import {cutAt, ending, starting, type Anim} from '../kit/anim';
import {BEAT, DURATION, SPEECH, afterWord, atWord} from './cues';
import type {SentenceId} from './narration';
import type {StudyId} from './strings';

const S = SPEECH;

// ------------------------------------------------------------ the still rule

/**
 * While a number is being spoken, nothing on screen changes. A freeze window
 * runs from the first frame of the numeral phrase to six frames after the
 * next word starts, or after the sentence ends.
 */
export type Freeze = {phrase: string; f0: number; f1: number};

const SETTLE = 6;

/**
 * A freeze window on a numeral phrase of a sentence. `first` is the word the
 * numeral starts with, `whole` the whole phrase. A numeral that ends its
 * sentence is over when the sentence is.
 */
const freeze = (phrase: string, id: SentenceId, first: string, whole: string = first): Freeze => ({
  phrase,
  f0: atWord(id, first),
  f1: Math.min(afterWord(id, whole) + SETTLE, S[id].end),
});

export const FREEZE = {
  heritability: freeze('seventy-four percent', 'p02', 'seventy-four', 'seventy-four percent'),
  year2017: freeze('2017', 'p06', '2017'),
  halfMemory: freeze('half a standard deviation (long-term memory)', 'p07', 'half', 'half a standard deviation'),
  sample205: freeze('two hundred and five', 'p12', 'two hundred', 'two hundred and five'),
  year2024: freeze('2024', 'p12', '2024'),
  storage: freeze('0.85', 'p15', '0.85'),
  manipulation: freeze('1.06', 'p15', '1.06'),
  twoTests: freeze('two (further tests)', 'p18', 'two'),
  studies83: freeze('eighty-three', 'p21', 'eighty-three'),
  ceiling: freeze('0.69', 'p23', '0.69'),
  trials15: freeze('fifteen', 'p25', 'fifteen'),
  halfTraining: freeze('half a standard deviation (training)', 'p26', 'half', 'half a standard deviation'),
  blinded: freeze('0.20', 'p27', '0.20'),
  lowerBound: freeze('0.01', 'p27', '0.01'),
} as const satisfies Record<string, Freeze>;

const F = FREEZE;

// -------------------------------------------------------------------- shots

export const SHOT = {
  // ---- 0.1 What is not in question. First limit: the heritability figure.
  faraoneCite: starting(atWord('p02', 'twin studies'), 16),
  faraoneTag: ending(F.heritability.f0 - 2, 12),
  /** The figure cuts on with its word, and its note with it. */
  heritability: cutAt(F.heritability.f0),
  /** The line and its citation leave together before the second limit. */
  heritabilityLeaves: starting(S.p02.end + 2, 12),

  // Second limit: two normal curves half a standard deviation apart (DATA, computed).
  curvesMark: starting(S.p03.start, 12),
  curvesAxis: starting(atWord('p03', 'every figure'), 18),
  curveComparison: starting(atWord('p03', 'a difference'), 22),
  curveAdhd: starting(atWord('p03', 'between groups'), 22),
  curvesEffect: starting(atWord('p03', 'moderate'), 12),
  /** "The shared area fills slowly." */
  overlapFill: starting(atWord('p04', 'overlap'), 44),
  overlapValue: starting(atWord('p04', 'overlap') + 44, 10),
  /** "A single case is marked under both curves at once." */
  singleCase: starting(atWord('p04', 'classifies'), 12),
  curvesLeave: starting(S.p05.start - 4, 12),

  // ---- 1.1 The prediction. The evidence table returns, and the three stages draw.
  tableReturns: starting(S.p05.start + 10, 18),
  stagesMark: starting(atWord('p05', 'the loss'), 12),
  stage1: starting(atWord('p05', 'where memories'), 14),
  stage2: starting(atWord('p05', 'kept'), 14),
  stage3: starting(atWord('p05', 'recovered'), 14),
  /**
   * The first cell of row H1 fills on the words that state the prediction,
   * and the second stage is outlined as a predicted site on the same words.
   */
  predictionCell: cutAt(atWord('p05', 'in retention')),
  predicted2: cutAt(atWord('p05', 'in retention')),
  predicted3: cutAt(atWord('p05', 'in retrieval')),
  /** The table is the film's own. It leaves before a study's citation arrives. */
  tableLeaves: ending(BEAT['1.2'] - 2, 12),

  // ---- 1.2 Long-term memory. The 2017 meta-analysis.
  skodzikCite: starting(S.p06.start - 8, 16),
  skodzikTag: starting(atWord('p06', 'in a meta-analysis'), 14),
  skodzikHead: starting(atWord('p06', 'long-term memory'), 12),
  verbalLabel: starting(S.p07.start, 10),
  verbalValue: cutAt(atWord('p07', 'weaker')),
  visualLabel: starting(S.p08.start, 10),
  visualValue: cutAt(atWord('p08', 'did not')),
  /** "A marker settles on the first stage, acquisition." */
  marker1: starting(atWord('p09', 'acquired'), 12),
  retrievalLabel: starting(atWord('p09', 'and the analysis'), 10),
  retrievalValue: cutAt(atWord('p09', 'no sign')),
  /** "And the other two clear": the two predicted sites lose their outline. */
  predictedClear: starting(atWord('p09', 'retrieval problem'), 14),

  // The 2024 study. The band changes study; the 2017 findings keep their own head.
  skodzikBandLeaves: starting(S.p11.start, 12),
  pawleyCite: starting(S.p11.start + 14, 16),
  pawleyTag: ending(F.sample205.f0 - 2, 12),
  pawleyHead: starting(F.sample205.f1, 12),
  learningLabel: starting(F.year2024.f1, 8),
  learningValue: cutAt(atWord('p12', 'preserved')),
  recallLabel: starting(atWord('p12', 'and delayed'), 8),
  recallValue: cutAt(atWord('p12', 'reduced')),
  /** "A second marker, in the comparison colour, settles on the second stage." */
  marker2: starting(atWord('p12', 'reduced') + 6, 12),
  stagesLeave: ending(BEAT['1.3'] - 2, 14),

  // ---- 1.3 Working memory. The forest plot builds row by row.
  martinussenCite: starting(S.p14.start, 16),
  plotMark: starting(atWord('p14', 'stronger'), 12),
  martinussenTag: starting(S.p15.start, 12),
  childrenHead: starting(atWord('p15', 'the meta-analytic'), 12),
  zeroLine: starting(atWord('p15', 'differences'), 18),
  wm1Label: starting(atWord('p15', 'large'), 8),
  wm2Label: starting(atWord('p15', 'for spatial'), 8),
  /** Each estimate has landed before its number is spoken. */
  wm1Mark: ending(F.storage.f0 - 2, 12),
  wm1Value: cutAt(F.storage.f0),
  wm2Mark: {from: F.storage.f1, to: F.manipulation.f0 - 2},
  wm2Value: cutAt(F.manipulation.f0),
  wm3Label: starting(F.manipulation.f1, 8),
  wm3Mark: ending(atWord('p15', 'moderate') - 1, 10),
  wm3Value: cutAt(atWord('p15', 'moderate')),
  wm4Label: starting(atWord('p15', 'moderate') + 2, 8),
  wm4Mark: ending(atWord('p15', 'verbal tasks') - 1, 10),
  wm4Value: cutAt(atWord('p15', 'verbal tasks')),
  // The adult estimates, under their own study.
  martinussenBandLeaves: starting(S.p15.end, 8),
  aldersonCite: starting(S.p16.start, 14),
  aldersonTag: starting(atWord('p16', 'they are'), 12),
  adultsHead: starting(S.p16.start, 12),
  wm5Label: starting(atWord('p16', 'adults'), 8),
  wm6Label: starting(atWord('p16', 'they are'), 8),
  wm5Value: cutAt(atWord('p16', 'moderate')),
  wm6Value: cutAt(atWord('p16', 'for both')),
  /** The two tests are the film's own. The band leaves before they are named. */
  aldersonBandLeaves: starting(S.p17.end + 2, 12),
  testsHead: starting(F.twoTests.f1, 12),
  box1: starting(atWord('p19', 'present'), 10),
  box2: starting(atWord('p20', 'reducing'), 10),
  /** The working-memory rows leave. The plot's frame and the two boxes stay. */
  wmRowsLeave: ending(BEAT['1.4'] - 2, 14),

  // ---- 1.4 Two tests. The first: the range of all executive measures.
  willcuttCite: starting(S.p21.start, 16),
  willcuttTag: ending(F.studies83.f0 - 2, 12),
  bandLabel: starting(S.p22.start, 12),
  band: ending(F.ceiling.f0 - 2, 22),
  bandValue: cutAt(F.ceiling.f0),
  /** "The first check box is marked as failed." */
  box1Failed: cutAt(atWord('p24', 'neither')),
  willcuttLeaves: starting(S.p24.end, 10),

  // The second: the trials of cognitive training.
  corteseCite: starting(S.p24.end + 10, 12),
  corteseTag: ending(F.trials15.f0 - 1, 10),
  trainingHead: starting(F.trials15.f1, 12),
  tr1Label: starting(S.p25.end - 10, 10),
  tr2Label: starting(S.p25.end, 8),
  tr1Mark: starting(S.p26.start, 10),
  tr1Value: cutAt(atWord('p26', 'improved')),
  tr2Mark: starting(atWord('p26', 'improved') + 2, 10),
  tr2Value: cutAt(F.halfTraining.f0 - 4),
  tr3Label: starting(S.p27.start, 8),
  tr3Mark: starting(atWord('p27', 'symptoms'), 10),
  tr3Value: cutAt(atWord('p27', 'rated')),
  tr4Label: starting(atWord('p27', 'probably blind'), 8),
  tr4Mark: ending(F.blinded.f0 - 2, 12),
  tr4Value: cutAt(F.blinded.f0),
  /** The paper's answer for training of working memory alone, as a note under the plot. */
  trainingNote: starting(S.p28.end, 12),
  /** "The second check box is marked as failed." */
  box2Failed: cutAt(atWord('p29', 'not what')),
  testsLeave: ending(BEAT['1.5'] - 2, 14),

  // ---- 1.5 Status: memory. The table returns, and row H1 fills.
  statusTable: starting(S.p30.start - 4, 18),
  statusInvolved: cutAt(atWord('p31', 'involved')),
  resultCell: cutAt(atWord('p31', 'encoding')),
  statusNotSupported: cutAt(atWord('p32', 'not supported')),
} as const satisfies Record<string, Anim>;

// ---------------------------------------------------------- citation bands

/**
 * "Always on screen. The citation of the study under discussion, its design
 * tag." One study stands in the band at a time. A band has left before the
 * next one arrives, and it is away while the film speaks for itself: under
 * the computed curves, the prediction, the two tests and the status line.
 */
export const BANDS: readonly {study: StudyId; cite: Anim; tag: Anim; leaves: Anim}[] = [
  {study: 'faraone', cite: SHOT.faraoneCite, tag: SHOT.faraoneTag, leaves: SHOT.heritabilityLeaves},
  {study: 'skodzik', cite: SHOT.skodzikCite, tag: SHOT.skodzikTag, leaves: SHOT.skodzikBandLeaves},
  {study: 'pawley', cite: SHOT.pawleyCite, tag: SHOT.pawleyTag, leaves: SHOT.stagesLeave},
  {study: 'martinussen', cite: SHOT.martinussenCite, tag: SHOT.martinussenTag, leaves: SHOT.martinussenBandLeaves},
  {study: 'alderson', cite: SHOT.aldersonCite, tag: SHOT.aldersonTag, leaves: SHOT.aldersonBandLeaves},
  {study: 'willcutt', cite: SHOT.willcuttCite, tag: SHOT.willcuttTag, leaves: SHOT.willcuttLeaves},
  {study: 'cortese', cite: SHOT.corteseCite, tag: SHOT.corteseTag, leaves: SHOT.testsLeave},
];

// -------------------------------------------------------------------- sound

const dB = (value: number): number => 10 ** (value / 20);

/** One beat of the pulse every 30 frames: 48 beats a minute, as under the title. */
const PULSE_EVERY = 30;
/** A note of the string line is re-bowed every nine seconds, into the tail of the note before it. */
const BOW_EVERY = 216;

const every = (from: number, to: number, step: number): number[] =>
  Array.from({length: Math.max(0, Math.ceil((to - from) / step))}, (_, i) => from + i * step);

/** The status line: where the string line moves one step. */
const STATUS_LINE = SHOT.statusNotSupported.from;

/**
 * Script, beat by beat. 0.1: "The pulse alone." 1.1: "One tick as the cell
 * fills." 1.2: "A tick for each marker. No resolution in the music." 1.3: "A
 * tick for each row." 1.4: "A tick for each row. A lower tick for each failed
 * box." 1.5: "The string line moves one step. It does not resolve."
 */
export const SOUND = {
  roomTone: {gain: dB(0), fadeIn: starting(0, 24)},
  pulse: {at: every(0, DURATION - 24, PULSE_EVERY), gain: dB(-11)},
  /** One soft tick for the cell, for each marker and for each row of data. */
  ticks: [
    SHOT.predictionCell.from,
    SHOT.marker1.from,
    SHOT.marker2.from,
    SHOT.wm1Value.from,
    SHOT.wm2Value.from,
    SHOT.wm3Value.from,
    SHOT.wm4Value.from,
    SHOT.wm5Value.from,
    SHOT.wm6Value.from,
    SHOT.bandValue.from,
    SHOT.tr1Value.from,
    SHOT.tr2Value.from,
    SHOT.tr3Value.from,
    SHOT.tr4Value.from,
    SHOT.resultCell.from,
  ],
  tickGain: dB(-4),
  /** "A lower tick for each failed box." */
  lowTicks: [SHOT.box1Failed.from, SHOT.box2Failed.from],
  lowTickGain: dB(-3),
  /**
   * The string line. It enters with Part 1 on its first step, where the title
   * left it, and moves one step at the status line. It does not resolve.
   */
  string: {
    step0: every(BEAT['1.1'], STATUS_LINE - 72, BOW_EVERY),
    step1: every(STATUS_LINE, DURATION, BOW_EVERY),
    gain: dB(-10),
  },
  /** Only when the part ships as a film of its own. The picture holds while the sound leaves. */
  standaloneFade: {from: DURATION - 36, to: DURATION - 1} as Anim,
} as const;
