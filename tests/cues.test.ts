import {describe, expect, it} from 'vitest';
import '../src/coldopen/captions';
import {DURATION, PAUSE, SPEECH, TITLE_START, WORD_ONSETS, atWord, cueWords, sentenceAt} from '../src/coldopen/cues';
import '../src/coldopen/shots';
import {NARRATION, TOTAL_WORDS} from '../src/coldopen/narration';
import {FPS, at, sec} from '../src/kit/time';

const ids = NARRATION.map((s) => s.id);

/** The words the shot list and the captions place a cue on, before any test asks for one of its own. */
const cueWordsOfTheFilm = cueWords();

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
    expect(atWord('s03', 'seatwork')).toBeLessThan(atWord('s03', 'fifty-three'));
    expect(atWord('s03', 'fifty-three')).toBeLessThan(SPEECH.s03.end);
    expect(atWord('s02', 'three weeks', 2)).toBeGreaterThan(atWord('s02', 'three weeks', 1));
    expect(() => atWord('s01', 'classroom')).toThrow();
  });

  it('uses a measured word start where the recorded voice gives one', () => {
    const estimated = atWord('s03', 'thirty-seven');
    WORD_ONSETS.s03 = {'thirty-seven': estimated + 9, 'three weeks#2': 1};
    try {
      expect(atWord('s03', 'thirty-seven')).toBe(estimated + 9);
      // A word with no measured start is still estimated.
      expect(atWord('s03', 'fifty-three')).toBeGreaterThan(estimated);
    } finally {
      delete WORD_ONSETS.s03;
    }
    expect(atWord('s03', 'thirty-seven')).toBe(estimated);
  });

  it('accepts a measured word start only under a key that a cue asks for, and inside its sentence', () => {
    // Read before any test asks for a word of its own: these are the words the shot list and the captions use.
    for (const [id, words] of Object.entries(WORD_ONSETS)) {
      for (const [key, frame] of Object.entries(words)) {
        expect(cueWordsOfTheFilm, `WORD_ONSETS has "${id}: ${key}", which no cue asks for`).toContain(`${id}: ${key}`);
        expect(frame).toBeGreaterThanOrEqual(SPEECH[id as keyof typeof SPEECH].start);
        expect(frame).toBeLessThan(SPEECH[id as keyof typeof SPEECH].end);
      }
    }
    expect(cueWordsOfTheFilm).toContain('s03: thirty-seven');
    expect(cueWordsOfTheFilm).toContain('s02: three weeks#2');
  });

  it('knows which sentence is being spoken, and that none is in a gap, in the pause or under the title', () => {
    expect(sentenceAt(0)).toBeNull();
    expect(sentenceAt(SPEECH.s01.start)).toBe('s01');
    expect(sentenceAt(SPEECH.s06.start + 3)).toBe('s06');
    expect(sentenceAt(SPEECH.s01.end)).toBeNull();
    expect(sentenceAt(PAUSE.start + 10)).toBeNull();
    expect(sentenceAt(DURATION - 1)).toBeNull();
  });
});
