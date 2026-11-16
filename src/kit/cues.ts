// The cue machinery every part after the cold open is built on: when each
// sentence is spoken, and when each word starts.
//
// There is no recorded voice until after the specialist review (script,
// production path, step 6). Until then a part runs on a paced estimate of its
// narration: `pace` gives each sentence its span, and `atWord` estimates a
// word's start from its place in its sentence. When the voice is recorded,
// a part's measured spans and word starts replace the estimates, and every
// cue that was placed on a word follows.

import {FPS} from './time';

export type Span = {start: number; end: number};

export type Line<Id extends string = string> = {
  id: Id;
  /** The beat of the script the sentence belongs to, for example "1.2". */
  beat: string;
  /** Paragraph of the script within the part, counted from 1. */
  paragraph: number;
  text: string;
};

// ------------------------------------------------------------ spoken length

const DIGIT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEEN = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const twoDigits = (n: number): string => {
  if (n < 10) return `oh ${DIGIT[n]}`;
  if (n < 20) return TEEN[n - 10];
  const ones = n % 10;
  return ones === 0 ? TENS[Math.floor(n / 10)] : `${TENS[Math.floor(n / 10)]}-${DIGIT[ones]}`;
};

/**
 * A sentence as it is spoken, for timing only. The script writes most numbers
 * as words and sets effect sizes and years in figures. An effect size is read
 * digit by digit ("zero point eight five": script, "The voice"), and a year as
 * two pairs ("twenty seventeen").
 */
export const spoken = (text: string): string =>
  text
    .replace(/\d+\.\d+/g, (number) => {
      const [whole, fraction] = number.split('.');
      return `${[...whole].map((d) => DIGIT[Number(d)]).join(' ')} point ${[...fraction].map((d) => DIGIT[Number(d)]).join(' ')}`;
    })
    .replace(/\b(19|20)(\d\d)\b/g, (_year, century: string, rest: string) => `${twoDigits(Number(century))} ${twoDigits(Number(rest))}`);

/** Words as the script counts them: whitespace-separated tokens of the written sentence. */
export const wordCount = (text: string): number => text.trim().split(/\s+/).length;

/** Words as they are spoken: a figure counts as the words it is read as. */
export const spokenWordCount = (text: string): number => wordCount(spoken(text));

/** A rough syllable count: groups of vowels in the spoken sentence. */
export const syllableCount = (text: string): number => (spoken(text).toLowerCase().match(/[aeiouy]+/g) ?? []).length;

// -------------------------------------------------------------------- pacing

export type Pacing = {
  /**
   * Words a minute while speaking, counted as they are spoken (a figure
   * counts as the words it is read as). The script's "calm 138 words a
   * minute" counts written words, which comes to a few more spoken ones.
   */
  wordsPerMinute: number;
  /** The fastest a beat may be spoken, in the same count. A beat that needs more does not fit. */
  fastestWordsPerMinute: number;
  /** Frames of silence before the first sentence of a beat. */
  leadIn: number;
  /** Frames of silence between two sentences of one paragraph. */
  sentenceGap: number;
  /** Frames of silence between two paragraphs of one beat. */
  paragraphGap: number;
  /** Frames a beat holds after its last sentence, at the least. */
  tail: number;
};

export type Beat = {id: string; start: number; end: number};

export type Paced<Id extends string> = {
  speech: Record<Id, Span>;
  /** The pace each beat is spoken at, in spoken words a minute. */
  beatWordsPerMinute: Record<string, number>;
};

/**
 * A paced estimate of when each sentence is spoken. Each beat starts where
 * the script says it starts. Within a beat the sentences follow one another,
 * and what is left of the beat after the last sentence is a hold. A
 * sentence's length is half by its words and half by its syllables, so that
 * short sentences are not rushed. A beat is spoken at the film's pace, and
 * a little faster where its words would otherwise run past the start of the
 * next beat. `extraGapBefore` adds silence before a sentence, for a written
 * pause or for a figure that needs time to change.
 */
export const pace = <Id extends string>(
  lines: readonly Line<Id>[],
  beats: readonly Beat[],
  pacing: Pacing,
  extraGapBefore: Partial<Record<Id, number>> = {},
): Paced<Id> => {
  const words = lines.reduce((sum, line) => sum + spokenWordCount(line.text), 0);
  const syllables = lines.reduce((sum, line) => sum + syllableCount(line.text), 0);
  const wordsPerSecond = pacing.wordsPerMinute / 60;
  const syllablesPerSecond = wordsPerSecond * (syllables / words);
  /** Frames a sentence takes at the film's pace. */
  const framesOf = (text: string): number =>
    (0.5 * (spokenWordCount(text) / wordsPerSecond) + 0.5 * (syllableCount(text) / syllablesPerSecond)) * FPS;
  const speech = {} as Record<Id, Span>;
  const beatWordsPerMinute: Record<string, number> = {};
  for (const beat of beats) {
    const spoken = lines.filter((line) => line.beat === beat.id);
    if (spoken.length === 0) throw new Error(`Beat ${beat.id} has no sentence`);
    const gaps = spoken.map((line, i) =>
      (i === 0 ? pacing.leadIn : spoken[i - 1].paragraph === line.paragraph ? pacing.sentenceGap : pacing.paragraphGap) +
      (extraGapBefore[line.id] ?? 0),
    );
    const silence = gaps.reduce((sum, gap) => sum + gap, 0) + pacing.tail;
    const atPace = spoken.reduce((sum, line) => sum + framesOf(line.text), 0);
    const room = beat.end - beat.start - silence;
    // Slower than the film's pace is never needed: the rest of the beat is a hold.
    const stretch = Math.min(1, room / atPace);
    const rate = pacing.wordsPerMinute / stretch;
    if (rate > pacing.fastestWordsPerMinute) {
      throw new Error(`Beat ${beat.id} needs ${rate.toFixed(1)} words a minute to fit ${beat.end - beat.start} frames`);
    }
    beatWordsPerMinute[beat.id] = rate;
    let cursor = beat.start;
    spoken.forEach((line, i) => {
      cursor += gaps[i];
      const frames = Math.round(framesOf(line.text) * stretch);
      speech[line.id] = {start: cursor, end: cursor + frames};
      cursor += frames;
    });
    if (cursor > beat.end) throw new Error(`Beat ${beat.id} runs ${cursor - beat.end} frames past its end`);
  }
  for (const line of lines) if (!(line.id in speech)) throw new Error(`Sentence ${line.id} is in no beat`);
  return {speech, beatWordsPerMinute};
};

// ---------------------------------------------------------------- word cues

export type Cues<Id extends string> = {
  /**
   * The frame at which a word or phrase of a sentence starts to be spoken.
   * `occurrence` picks the nth match (from 1). A measured start is used where
   * the part has one. Otherwise the start is estimated from the place of the
   * word in the spoken sentence.
   */
  atWord: (id: Id, word: string, occurrence?: number) => number;
  /**
   * The frame at which a word or phrase has been spoken: the start of
   * whatever follows it, or the end of the sentence if nothing does.
   */
  afterWord: (id: Id, word: string, occurrence?: number) => number;
  /** The sentence being spoken at a frame, or null in a gap or a hold. */
  sentenceAt: (frame: number) => Id | null;
  /** Every word a cue is placed on, as "s03: thirty-seven": the starts to measure when the voice is recorded. */
  cueWords: () => string[];
};

/** The key of a word in a table of measured starts: the word, with "#2" added for a second occurrence. */
const onsetKey = (word: string, occurrence: number): string => (occurrence === 1 ? word : `${word}#${occurrence}`);

export const makeCues = <Id extends string>(
  lines: readonly Line<Id>[],
  speech: Record<Id, Span>,
  measured: Partial<Record<Id, Record<string, number>>>,
): Cues<Id> => {
  const requested = new Set<string>();
  const textOf = (id: Id): string => {
    const line = lines.find((l) => l.id === id);
    if (!line) throw new Error(`No sentence ${id}`);
    return line.text;
  };
  const indexOf = (id: Id, word: string, occurrence: number): number => {
    const text = textOf(id);
    let index = -1;
    for (let n = 0; n < occurrence; n++) {
      index = text.indexOf(word, index + 1);
      if (index < 0) throw new Error(`"${word}" (occurrence ${occurrence}) is not in ${id}: "${text}"`);
    }
    return index;
  };
  /** The frame at which the character at `index` of the written sentence is reached, by its share of the spoken sentence. */
  const frameAt = (id: Id, index: number): number => {
    const text = textOf(id);
    const {start, end} = speech[id];
    const share = spoken(text.slice(0, index)).length / spoken(text).length;
    return Math.round(start + share * (end - start));
  };
  const atWord = (id: Id, word: string, occurrence = 1): number => {
    const index = indexOf(id, word, occurrence);
    const key = onsetKey(word, occurrence);
    requested.add(`${id}: ${key}`);
    return measured[id]?.[key] ?? frameAt(id, index);
  };
  const afterWord = (id: Id, word: string, occurrence = 1): number => {
    const text = textOf(id);
    const index = indexOf(id, word, occurrence);
    // The next word starts after the phrase and whatever punctuation and space follow it.
    const rest = text.slice(index + word.length);
    const next = rest.search(/[A-Za-z0-9]/);
    if (next < 0) return speech[id].end;
    const following = rest.slice(next).split(/\s+/)[0];
    const key = `${onsetKey(word, occurrence)} > ${following}`;
    requested.add(`${id}: ${key}`);
    return measured[id]?.[key] ?? frameAt(id, index + word.length + next);
  };
  const sentenceAt = (frame: number): Id | null =>
    lines.find(({id}) => frame >= speech[id].start && frame < speech[id].end)?.id ?? null;
  return {atWord, afterWord, sentenceAt, cueWords: () => [...requested].sort()};
};
