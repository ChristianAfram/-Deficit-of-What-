import {describe, expect, it} from 'vitest';
import {DURATION, PAUSE, SPEECH, TITLE_START, atWord, sentenceAt} from '../src/coldopen/cues';
import {NARRATION, TOTAL_WORDS} from '../src/coldopen/narration';
import {FPS, at, sec} from '../src/kit/time';

const ids = NARRATION.map((s) => s.id);

describe('cue sheet', () => {
  it('runs 77 seconds at 24 frames a second, with the title at 1:12', () => {
    expect(FPS).toBe(24);
    expect(DURATION).toBe(1848);
    expect(TITLE_START).toBe(1728);
  });

  it('speaks every sentence once, in order, without overlap, before the title', () => {
    expect(Object.keys(SPEECH)).toEqual(ids);
    let previousEnd = 0;
    for (const id of ids) {
      const {start, end} = SPEECH[id];
      expect(start, id).toBeGreaterThanOrEqual(previousEnd);
      expect(end, id).toBeGreaterThan(start);
      previousEnd = end;
    }
    expect(previousEnd).toBeLessThanOrEqual(TITLE_START);
  });

  it('keeps the written two-second pause after the null result', () => {
    expect(PAUSE.start).toBe(SPEECH.s04.end);
    expect(PAUSE.end).toBe(SPEECH.s05.start);
    expect(PAUSE.end - PAUSE.start).toBeGreaterThanOrEqual(sec(2));
  });

  it('lasts 66 to 72 seconds from the first word to the last, pause counted in', () => {
    const seconds = (SPEECH.s13.end - SPEECH.s01.start) / FPS;
    expect(seconds).toBeGreaterThanOrEqual(66);
    expect(seconds).toBeLessThanOrEqual(72);
  });

  it('paces every sentence so that it can be said calmly', () => {
    for (const {id, text} of NARRATION) {
      const seconds = (SPEECH[id].end - SPEECH[id].start) / FPS;
      // A rough syllable count: groups of vowels, with digits read as words.
      const spoken = text.replace('2022', 'twenty twenty-two');
      const syllables = (spoken.toLowerCase().match(/[aeiouy]+/g) ?? []).length;
      const rate = syllables / seconds;
      expect(rate, `${id}: ${rate.toFixed(2)} syllables a second`).toBeGreaterThan(2.2);
      expect(rate, `${id}: ${rate.toFixed(2)} syllables a second`).toBeLessThan(5.2);
    }
    const speakingSeconds = ids.reduce((sum, id) => sum + (SPEECH[id].end - SPEECH[id].start), 0) / FPS;
    const wordsPerMinute = (TOTAL_WORDS / speakingSeconds) * 60;
    expect(wordsPerMinute).toBeGreaterThan(125);
    expect(wordsPerMinute).toBeLessThan(150);
  });

  it('opens loop L01, "Learning did not follow.", at about 0:45', () => {
    expect(Math.abs(SPEECH.s06.start - at(0, 45))).toBeLessThanOrEqual(sec(1.5));
  });

  it('places a cue on a spoken word', () => {
    expect(atWord('s03', 'thirty-seven')).toBeGreaterThan(SPEECH.s03.start);
    expect(atWord('s03', 'fifty-three')).toBeGreaterThan(atWord('s03', 'thirty-seven'));
    expect(atWord('s03', 'fifty-three')).toBeLessThan(SPEECH.s03.end);
    expect(atWord('s02', 'three weeks', 2)).toBeGreaterThan(atWord('s02', 'three weeks', 1));
    expect(() => atWord('s01', 'classroom')).toThrow();
  });

  it('knows which sentence is being spoken', () => {
    expect(sentenceAt(0)).toBeNull();
    expect(sentenceAt(SPEECH.s01.start)).toBe('s01');
    expect(sentenceAt(SPEECH.s06.start + 3)).toBe('s06');
    expect(sentenceAt(DURATION - 1)).toBe('s13');
  });
});
