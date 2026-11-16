import {describe, expect, it} from 'vitest';
import {makeCues, pace, spoken, spokenWordCount, syllableCount, wordCount, type Line, type Pacing} from '../src/kit/cues';

const PACING: Pacing = {wordsPerMinute: 143, fastestWordsPerMinute: 150, leadIn: 10, sentenceGap: 10, paragraphGap: 16, tail: 8};

const LINES: readonly Line<'a' | 'b' | 'c'>[] = [
  {id: 'a', beat: '1', paragraph: 1, text: 'The estimate was 0.85 for storage.'},
  {id: 'b', beat: '1', paragraph: 2, text: 'It was published in 2017.'},
  {id: 'c', beat: '2', paragraph: 3, text: 'Nothing follows this sentence.'},
];

describe('the spoken form of a sentence', () => {
  it('reads an effect size digit by digit and a year as two pairs', () => {
    expect(spoken('0.85 for storage and 1.06')).toBe('zero point eight five for storage and one point zero six');
    expect(spoken('published in 2017')).toBe('published in twenty seventeen');
    expect(spoken('in 2024, a study')).toBe('in twenty twenty-four, a study');
    expect(spoken('starts at 0.01.')).toBe('starts at zero point zero one.');
  });

  it('counts written words as the script does, and spoken words for timing', () => {
    expect(wordCount('None exceeded 0.69, and')).toBe(4);
    expect(spokenWordCount('None exceeded 0.69, and')).toBe(7);
    expect(syllableCount('0.69')).toBeGreaterThanOrEqual(4);
  });
});

describe('the paced estimate', () => {
  const beats = [
    {id: '1', start: 0, end: 240},
    {id: '2', start: 240, end: 400},
  ];
  const {speech, beatWordsPerMinute} = pace(LINES, beats, PACING);

  it('starts every beat where the script starts it, and speaks its sentences in order', () => {
    expect(speech.a.start).toBe(PACING.leadIn);
    expect(speech.b.start).toBe(speech.a.end + PACING.paragraphGap);
    expect(speech.c.start).toBe(240 + PACING.leadIn);
    expect(speech.b.end).toBeLessThanOrEqual(240 - PACING.tail);
  });

  it("keeps the film's pace where a beat has room, and holds for the rest", () => {
    expect(beatWordsPerMinute['1']).toBeCloseTo(PACING.wordsPerMinute);
    expect(beatWordsPerMinute['2']).toBeCloseTo(PACING.wordsPerMinute);
  });

  it('speaks a little faster to fit a beat, and refuses a beat that cannot be spoken calmly', () => {
    // What the first beat needs at the film's pace: its last sentence and the hold after it.
    const needs = speech.b.end + PACING.tail;
    const tight = pace(LINES, [{id: '1', start: 0, end: needs - 4}, beats[1]], PACING);
    expect(tight.beatWordsPerMinute['1']).toBeGreaterThan(PACING.wordsPerMinute);
    expect(tight.beatWordsPerMinute['1']).toBeLessThanOrEqual(PACING.fastestWordsPerMinute);
    expect(tight.speech.b.end).toBeLessThanOrEqual(needs - 4 - PACING.tail);
    expect(() => pace(LINES, [{id: '1', start: 0, end: needs - 40}, beats[1]], PACING)).toThrow(/words a minute/);
  });

  it('adds silence before a sentence where it is asked to', () => {
    const waited = pace(LINES, beats, PACING, {b: 20});
    expect(waited.speech.b.start).toBe(speech.b.start + 20);
  });
});

describe('cues on spoken words', () => {
  const {speech} = pace(LINES, [{id: '1', start: 0, end: 240}, {id: '2', start: 240, end: 400}], PACING);
  const measured: Partial<Record<'a' | 'b' | 'c', Record<string, number>>> = {};
  const {atWord, afterWord, sentenceAt, cueWords} = makeCues(LINES, speech, measured);

  it('places a word inside its sentence, by its share of the spoken sentence', () => {
    expect(atWord('a', 'The')).toBe(speech.a.start);
    expect(atWord('a', '0.85')).toBeGreaterThan(speech.a.start);
    expect(atWord('a', 'for storage')).toBeGreaterThan(atWord('a', '0.85'));
    expect(atWord('a', 'for storage')).toBeLessThan(speech.a.end);
    expect(() => atWord('a', 'retrieval')).toThrow();
  });

  it('gives a figure the time it takes to say it', () => {
    // "0.85" is four spoken words of seven: far more than its four characters of thirty-four.
    const share = (afterWord('a', '0.85') - atWord('a', '0.85')) / (speech.a.end - speech.a.start);
    expect(share).toBeGreaterThan(0.3);
  });

  it('knows when a phrase is over: at the next word, or at the end of the sentence', () => {
    expect(afterWord('a', '0.85')).toBe(atWord('a', 'for storage'));
    expect(afterWord('b', '2017')).toBe(speech.b.end);
  });

  it('uses a measured start where the recorded voice gives one', () => {
    const estimated = atWord('a', '0.85');
    measured.a = {'0.85': estimated + 7};
    try {
      expect(atWord('a', '0.85')).toBe(estimated + 7);
    } finally {
      delete measured.a;
    }
    expect(atWord('a', '0.85')).toBe(estimated);
  });

  it('lists the words to measure, and knows which sentence is being spoken', () => {
    expect(cueWords()).toContain('a: 0.85');
    expect(sentenceAt(speech.a.start)).toBe('a');
    expect(sentenceAt(speech.a.end)).toBeNull();
    expect(sentenceAt(speech.c.start + 1)).toBe('c');
  });
});
