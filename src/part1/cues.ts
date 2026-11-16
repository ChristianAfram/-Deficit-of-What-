// The cue sheet of Part 0 and Part 1: when each beat starts, when each
// sentence is spoken, and when each word starts.
//
// Frames are counted from the first frame of this part. In the joined film
// the part starts at 1:17, straight after the title.
//
// There is no recorded voice yet (script, production path, step 6: "Record
// the voice after the review, not before"). SPEECH is therefore a paced
// estimate. When the voice is recorded, two tables change and nothing else:
// MEASURED_SPEECH (start and end of each sentence) and WORD_ONSETS (the
// measured start of each word a cue is placed on). Every picture and sound
// cue in shots.ts is placed on a spoken sentence or word, so the picture then
// follows the voice.

import {makeCues, pace, type Beat, type Pacing, type Span} from '../kit/cues';
import {at} from '../kit/time';
import {NARRATION, type SentenceId} from './narration';

/** Where this part starts in the joined film: 1:17, the end of the title. */
export const FILM_START = at(1, 17);

const inFilm = (minutes: number, seconds: number): number => at(minutes, seconds) - FILM_START;

/** The first frame of each beat. The script fixes these times. */
export const BEAT = {
  '0.1': inFilm(1, 17),
  '1.1': inFilm(1, 43),
  '1.2': inFilm(1, 55),
  '1.3': inFilm(2, 45),
  '1.4': inFilm(3, 19),
  '1.5': inFilm(4, 11),
} as const;

export type BeatId = keyof typeof BEAT;

/** 4:33, where Part 2 starts: 196 seconds after 1:17. */
export const DURATION = inFilm(4, 33);

/** The beats in order, each ending where the next one starts. */
export const BEATS: readonly Beat[] = (Object.keys(BEAT) as BeatId[]).map((id, i, ids) => ({
  id,
  start: BEAT[id],
  end: i + 1 < ids.length ? BEAT[ids[i + 1]] : DURATION,
}));

/**
 * Script: "a calm 138 words a minute", counted in written words. Read aloud,
 * "0.85" is four words, so the same pace is about 143 spoken words a minute.
 * The script's beat times leave almost no silence, so the gaps are short.
 */
export const PACING: Pacing = {
  wordsPerMinute: 143,
  fastestWordsPerMinute: 150,
  leadIn: 10,
  sentenceGap: 10,
  paragraphGap: 16,
  tail: 8,
};

/**
 * Silence added before a sentence, in frames, where the picture needs time
 * to change between two studies or two figures.
 */
const EXTRA_GAP: Partial<Record<SentenceId, number>> = {};

/** Measured start and end of each sentence, from the recorded voice. Empty until the voice exists. */
export const MEASURED_SPEECH: Partial<Record<SentenceId, Span>> = {};

const PACED = pace(NARRATION, BEATS, PACING, EXTRA_GAP);

/** The pace each beat is spoken at in the estimate, in spoken words a minute. */
export const BEAT_PACE = PACED.beatWordsPerMinute;

/** Start and end frame of each narration sentence: measured where the voice gives it, paced otherwise. */
export const SPEECH: Record<SentenceId, Span> = {...PACED.speech, ...MEASURED_SPEECH};

/**
 * Measured word starts, in frames, from the recorded voice. Empty until the
 * voice exists. A key is the word exactly as a cue names it, with "#2" added
 * for a second occurrence. docs/cue-sheet-part-1.md lists every key a cue
 * asks for, and a test rejects a key that no cue asks for.
 */
export const WORD_ONSETS: Partial<Record<SentenceId, Record<string, number>>> = {};

export const {atWord, afterWord, sentenceAt, cueWords} = makeCues(NARRATION, SPEECH, WORD_ONSETS);

/** The beat a frame belongs to. */
export const beatAt = (frame: number): BeatId => {
  const ids = Object.keys(BEAT) as BeatId[];
  return ids.filter((id) => frame >= BEAT[id]).pop() ?? ids[0];
};
