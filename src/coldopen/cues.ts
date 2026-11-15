// The cue sheet of the cold open and title: when each sentence is spoken, and
// when each mark on screen appears.
//
// There is no recorded voice yet (script, production path, step 6: "Record the
// voice after the review, not before"). SPEECH is therefore a paced estimate.
// When the voice is recorded, SPEECH is the only table that has to change:
// every picture and sound cue below is placed relative to a spoken sentence or
// word, so the picture follows the voice.

import {at, sec} from '../kit/time';
import {NARRATION, type SentenceId} from './narration';

/** 77 seconds at 24 frames a second. */
export const DURATION = sec(77);

/** 1:12, where the title beat starts. */
export const TITLE_START = at(1, 12);

export type Span = {start: number; end: number};

/**
 * Start and end frame of each narration sentence. Paced at 138 words a minute
 * overall (script: "2,147 spoken words at a calm 138 words a minute"), with
 * each sentence's share set by its syllable count.
 */
export const SPEECH: Record<SentenceId, Span> = {
  s01: {start: 24, end: 207},
  s02: {start: 219, end: 550},
  s03: {start: 570, end: 800},
  s04: {start: 822, end: 934},
  // (pause, 2 seconds)
  s05: {start: 982, end: 1035},
  s06: {start: 1046, end: 1089},
  s07: {start: 1112, end: 1289},
  s08: {start: 1301, end: 1419},
  s09: {start: 1431, end: 1478},
  s10: {start: 1487, end: 1534},
  s11: {start: 1543, end: 1590},
  s12: {start: 1602, end: 1655},
  s13: {start: 1671, end: 1707},
};

/** The written pause: "(pause, 2 seconds)", the first of the film's five silences. */
export const PAUSE: Span = {start: SPEECH.s04.end, end: SPEECH.s05.start};

const textOf = (id: SentenceId): string => {
  const sentence = NARRATION.find((s) => s.id === id);
  if (!sentence) throw new Error(`No sentence ${id}`);
  return sentence.text;
};

/**
 * The frame at which a word of a sentence starts to be spoken, estimated from
 * its position in the sentence. `occurrence` picks the nth match (from 1).
 * Replace with measured timings once the voice exists.
 */
export const atWord = (id: SentenceId, word: string, occurrence = 1): number => {
  const text = textOf(id);
  let index = -1;
  for (let n = 0; n < occurrence; n++) {
    index = text.indexOf(word, index + 1);
    if (index < 0) throw new Error(`"${word}" (occurrence ${occurrence}) is not in ${id}: "${text}"`);
  }
  const {start, end} = SPEECH[id];
  return Math.round(start + (index / text.length) * (end - start));
};

/** How much of a sentence has been spoken at a frame, 0 to 1. */
export const spokenShare = (id: SentenceId, frame: number): number => {
  const {start, end} = SPEECH[id];
  return Math.min(1, Math.max(0, (frame - start) / (end - start)));
};

/** The sentence being spoken at a frame, or the one just finished while its gap lasts. */
export const sentenceAt = (frame: number): SentenceId | null => {
  let current: SentenceId | null = null;
  for (const {id} of NARRATION) {
    if (frame >= SPEECH[id].start) current = id;
  }
  return current;
};
