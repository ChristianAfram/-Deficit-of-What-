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
 * Start and end frame of each narration sentence (build spec, section 1.2).
 * Paced at 137 words a minute overall (script: "a calm 138 words a minute").
 * Each sentence's share is half by its words and half by its syllables, so
 * that short sentences are not rushed.
 */
export const SPEECH: Record<SentenceId, Span> = {
  s01: {start: 36, end: 205},
  s02: {start: 219, end: 533},
  s03: {start: 547, end: 813},
  s04: {start: 833, end: 951},
  // (pause, 2 seconds)
  s05: {start: 999, end: 1072},
  s06: {start: 1086, end: 1124},
  s07: {start: 1138, end: 1324},
  s08: {start: 1334, end: 1444},
  s09: {start: 1454, end: 1498},
  s10: {start: 1504, end: 1548},
  s11: {start: 1554, end: 1598},
  s12: {start: 1606, end: 1669},
  s13: {start: 1675, end: 1715},
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
