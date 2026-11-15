// The cue sheet of the cold open and title: when each sentence is spoken, and
// when each word starts.
//
// There is no recorded voice yet (script, production path, step 6: "Record the
// voice after the review, not before"). SPEECH is therefore a paced estimate,
// and a word's start is estimated from its place in its sentence.
//
// When the voice is recorded, two tables change and nothing else: SPEECH
// (start and end of each sentence) and WORD_ONSETS (the measured start of each
// word a cue is placed on). Every picture and sound cue in shots.ts is placed
// on a spoken sentence or word, so the picture then follows the voice.

import {at, sec} from '../kit/time';
import {NARRATION, type SentenceId} from './narration';

/** 77 seconds at 24 frames a second. The script fixes this length. */
export const DURATION = sec(77);

/** 1:12, where the title beat starts. The script fixes this frame. */
export const TITLE_START = at(1, 12);

export type Span = {start: number; end: number};

/**
 * Start and end frame of each narration sentence. Paced at 137 words a minute
 * overall (script: "a calm 138 words a minute"). Each sentence's share is half
 * by its words and half by its syllables, so that short sentences are not
 * rushed.
 */
export const SPEECH: Record<SentenceId, Span> = {
  s01: {start: 29, end: 207},
  s02: {start: 219, end: 533},
  s03: {start: 545, end: 811},
  s04: {start: 825, end: 962},
  // (pause, 2 seconds)
  s05: {start: 1010, end: 1083},
  s06: {start: 1095, end: 1133},
  s07: {start: 1145, end: 1331},
  s08: {start: 1340, end: 1450},
  s09: {start: 1459, end: 1503},
  s10: {start: 1509, end: 1553},
  s11: {start: 1559, end: 1603},
  s12: {start: 1611, end: 1674},
  s13: {start: 1680, end: 1720},
};

/** The written pause: "(pause, 2 seconds)", the first of the film's five silences. */
export const PAUSE: Span = {start: SPEECH.s04.end, end: SPEECH.s05.start};

/**
 * Measured word starts, in frames, from the recorded voice. Empty until the
 * voice exists. A key is the word exactly as a cue names it, with "#2" added
 * for a second occurrence: {s03: {'thirty-seven': 610, 'fifty-three': 741}}.
 * docs/cue-sheet.md lists every key a cue asks for, and a test rejects a key
 * that no cue asks for. Where a word is missing here, its start is estimated.
 */
export const WORD_ONSETS: Partial<Record<SentenceId, Record<string, number>>> = {};

const textOf = (id: SentenceId): string => {
  const sentence = NARRATION.find((s) => s.id === id);
  if (!sentence) throw new Error(`No sentence ${id}`);
  return sentence.text;
};

/** The key of a word in WORD_ONSETS: the word, with "#2" added for a second occurrence. */
const onsetKey = (word: string, occurrence: number): string => (occurrence === 1 ? word : `${word}#${occurrence}`);

const requested = new Set<string>();

/**
 * Every word a cue is placed on, as "s03: thirty-seven". These are the words
 * whose starts have to be measured when the voice is recorded.
 */
export const cueWords = (): string[] => [...requested].sort();

/**
 * The frame at which a word of a sentence starts to be spoken. `occurrence`
 * picks the nth match (from 1). The measured start is used where WORD_ONSETS
 * has one. Otherwise the start is estimated from the word's position in the
 * sentence.
 */
export const atWord = (id: SentenceId, word: string, occurrence = 1): number => {
  const text = textOf(id);
  let index = -1;
  for (let n = 0; n < occurrence; n++) {
    index = text.indexOf(word, index + 1);
    if (index < 0) throw new Error(`"${word}" (occurrence ${occurrence}) is not in ${id}: "${text}"`);
  }
  const key = onsetKey(word, occurrence);
  requested.add(`${id}: ${key}`);
  const measured = WORD_ONSETS[id]?.[key];
  if (measured !== undefined) return measured;
  const {start, end} = SPEECH[id];
  return Math.round(start + (index / text.length) * (end - start));
};

/** The sentence being spoken at a frame, or null in a gap, in the pause and under the title. */
export const sentenceAt = (frame: number): SentenceId | null =>
  NARRATION.find(({id}) => frame >= SPEECH[id].start && frame < SPEECH[id].end)?.id ?? null;
