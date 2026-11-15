// The shot list of the cold open and title as data: when every mark appears,
// when the camera moves, and when each sound plays. Build spec, sections 5 to 7.
//
// Nothing here is an absolute frame chosen by hand. Every cue is placed on a
// spoken word (through `atWord`) or on a freeze window, so when the voice is
// recorded and SPEECH changes, the picture and the sound follow it.
// tests/still-rule.test.ts checks this table against the still rule.

import {EASE, ramp} from '../kit/time';
import {DURATION, PAUSE, SPEECH, TITLE_START, atWord} from './cues';

/** An animation from frame `from` (progress 0) to frame `to` (progress 1). A cut has from === to. */
export type Anim = {from: number; to: number};

const starting = (from: number, frames: number): Anim => ({from, to: from + frames});
const ending = (to: number, frames: number): Anim => ({from: to - frames, to});
const cutAt = (frame: number): Anim => ({from: frame, to: frame});

/** Progress of an animation at a frame, 0 to 1. A cut is 0 before its frame and 1 from it on. */
export const progress = (frame: number, anim: Anim, easing: (t: number) => number = EASE.dissolve): number =>
  anim.from === anim.to ? (frame >= anim.to ? 1 : 0) : ramp(frame, anim.from, anim.to - anim.from, easing);

// ------------------------------------------------------------ the still rule

/**
 * While a number is being spoken, nothing on screen changes. A freeze window
 * runs from the first frame of the numeral phrase to six frames after the
 * next word starts.
 */
export type Freeze = {phrase: string; f0: number; f1: number};

const SETTLE = 6;

export const FREEZE = {
  year: {phrase: '2022', f0: atWord('s01', '2022'), f1: atWord('s01', 'a triple') + SETTLE},
  sample: {
    phrase: 'One hundred and seventy-three',
    f0: atWord('s02', 'One hundred'),
    f1: atWord('s02', 'children') + SETTLE,
  },
  weeks1: {phrase: 'three weeks (first)', f0: atWord('s02', 'three weeks', 1), f1: atWord('s02', 'and placebo') + SETTLE},
  weeks2: {phrase: 'three weeks (second)', f0: atWord('s02', 'three weeks', 2), f1: atWord('s02', 'in randomised') + SETTLE},
  plus37: {phrase: 'thirty-seven percent more', f0: atWord('s03', 'thirty-seven'), f1: atWord('s03', 'arithmetic') + SETTLE},
  minus53: {phrase: 'fifty-three percent fewer', f0: atWord('s03', 'fifty-three'), f1: atWord('s03', 'rule') + SETTLE},
  three: {phrase: 'Three (candidates)', f0: atWord('s08', 'Three'), f1: atWord('s08', 'candidates') + SETTLE},
} as const satisfies Record<string, Freeze>;

const F = FREEZE;

// -------------------------------------------------------------------- shots

export const SHOT = {
  // Shot 1: the citation, alone, then its design tag on the words that name it.
  citation: ending(SPEECH.s01.start - 6, 18),
  tagDesign: starting(F.year.f1, 18),
  tagSample: starting(SPEECH.s01.end, 12),
  tagDrug: starting(atWord('s02', 'methylphenidate'), 18),

  // Shot 2: the crossover diagram (SCHEMATIC). The mark arrives before the figure.
  schematicMark: starting(F.sample.f1, 12),
  sequenceLabels: starting(F.sample.f1 + 12, 18),
  blocksPeriod1: ending(F.weeks1.f0 - 2, 18),
  weeksPeriod1: ending(F.weeks1.f0 - 2, 10),
  legendMasked: ending(F.weeks1.f0 - 2, 10),
  blocksPeriod2: starting(F.weeks1.f1, 18),
  weeksPeriod2: ending(F.weeks2.f0, 10),
  randomNode: starting(F.weeks2.f1, 18),
  randomLetter: starting(F.weeks2.f1 + 6, 12),
  randomBranches: starting(F.weeks2.f1 + 12, 18),
  legendRandomised: starting(F.weeks2.f1 + 18, 12),
  /** The hatching clears in all four blocks at once, after the whole design has been named. */
  unmask: starting(F.weeks2.f1 + 24, 36),
  conditionLabels: starting(F.weeks2.f1 + 36, 24),

  // Shot 3: the three result rows (DATA).
  dataMark: ending(SPEECH.s03.start, 12),
  zeroLine: starting(SPEECH.s03.start + 6, 18),
  row1Label: starting(SPEECH.s03.start + 26, 12),
  /** The bar has landed before its number is spoken. */
  row1Bar: ending(F.plus37.f0 - SETTLE, 24),
  row1Value: cutAt(F.plus37.f0),
  row1Note: ending(atWord('s03', 'seatwork'), 20),
  row2Label: starting(atWord('s03', 'seatwork'), 12),
  row2Bar: ending(F.minus53.f0, 24),
  row2Value: cutAt(F.minus53.f0),
  row2Note: starting(F.minus53.f1, 18),
  /** Closes the plotted region. The third row sits below it and is not plotted. */
  separator: starting(SPEECH.s04.start, 18),
  row3Label: starting(atWord('s04', 'content'), 12),
  row3Value: cutAt(atWord('s04', 'did not differ')),
  row3Note: starting(atWord('s04', 'between') - 2, 18),
  /** After the written pause, so the silence stays a pure hold. Complete before "Learning did not follow." */
  limits: starting(PAUSE.end + 11, 24),
  /** "Then the diagram recedes": the whole figure layer dissolves out. */
  figureRecedes: {from: atWord('s07', 'in the name') + 3, to: atWord('s07', 'deficit') - 11},

  // Shot 4: the word DEFICIT and the empty evidence table.
  deficit: cutAt(atWord('s07', 'deficit')),
  tableTopRule: starting(F.three.f1, 24),
  tableHeaderRule: starting(F.three.f1 + 12, 24),
  tableRowRules: starting(F.three.f1 + 24, 24),
  tableBottomRule: starting(F.three.f1 + 36, 24),
  tableColumnRules: starting(F.three.f1 + 48, 24),
  rowMemory: ending(atWord('s09', 'memory'), 12),
  rowAttention: ending(atWord('s10', 'attention'), 12),
  rowDopamine: ending(atWord('s11', 'dopamine'), 12),
  headPrediction: ending(atWord('s12', 'predictions'), 12),
  headResultStatus: ending(atWord('s12', 'checked'), 12),

  // Shot 5: the title. "The table dims. The title alone, in capitals."
  deficitOut: starting(TITLE_START, 20),
  tableDims: starting(TITLE_START, 36),
  bandDims: starting(TITLE_START, 36),
  title: starting(TITLE_START + 20, 24),
  subtitle: starting(TITLE_START + 44, 18),
} as const satisfies Record<string, Anim>;

/** How far the table and the citation band dim under the title. */
export const TITLE_DIM = {table: 0.2} as const;

// ------------------------------------------------------------------- camera

/**
 * "A slow push-in on a figure while it draws. A hold on every result."
 * Each figure layer has its own camera, so no hidden reset is ever needed.
 * A push is linear and has stopped six frames before a result is spoken.
 */
export const CAMERA = {
  figure: {move: {from: F.weeks2.f1, to: F.plus37.f0 - SETTLE} as Anim, scale: 1.03, fixed: [960, 510]},
  table: {move: {from: F.three.f1, to: SPEECH.s12.end} as Anim, scale: 1.02, fixed: [960, 500]},
} as const;

export const cameraAt = (frame: number, camera: (typeof CAMERA)[keyof typeof CAMERA]) => ({
  scale: 1 + (camera.scale - 1) * progress(frame, camera.move, EASE.linear),
  fixed: camera.fixed,
});

// -------------------------------------------------------------------- sound

const dB = (value: number): number => 10 ** (value / 20);

/**
 * "Almost nothing. A low room tone. One soft tick as each row lands. Two
 * seconds of silence after the third row. A single sustained low note under
 * the last sentence." Then, at the title: "The low note resolves into the
 * film's only musical material: a slow pulse and one sustained string line."
 */
export const SOUND = {
  roomTone: {gain: dB(0), fadeIn: starting(0, 24)},
  /** One tick per row of data, all three at the same level: the null gets equal weight. */
  ticks: [SHOT.row1Value.from, SHOT.row2Value.from, SHOT.row3Value.from],
  tickGain: dB(-4),
  /** Starts early enough to be at level under "This film checks them." */
  lowNote: {from: SPEECH.s13.start - 35, gain: dB(-8), fadeOut: starting(TITLE_START, 48)},
  /** 48 beats a minute. The low note resolves onto the same pitch: the pedal becomes the pulse. */
  pulse: {at: [0, 30, 60, 90].map((offset) => TITLE_START + offset), gain: dB(-9)},
  /** The string line, at its first step. It does not move in this cut. */
  string: {from: TITLE_START + 12, gain: dB(-8)},
  /** Only when the cold open ships alone. The picture holds while the sound leaves. */
  standaloneFade: {from: DURATION - 30, to: DURATION - 1} as Anim,
} as const;
