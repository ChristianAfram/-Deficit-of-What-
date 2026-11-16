import {describe, expect, it} from 'vitest';
import '../src/part1/captions';
import {BEAT, BEATS, BEAT_PACE, DURATION, FILM_START, PACING, SPEECH, WORD_ONSETS, atWord, beatAt, cueWords, sentenceAt} from '../src/part1/cues';
import '../src/part1/shots';
import {NARRATION, TOTAL_WORDS} from '../src/part1/narration';
import {syllableCount} from '../src/kit/cues';
import {FPS, at, sec} from '../src/kit/time';

/** The words the shot list places a cue on, before any test asks for one of its own. */
const cueWordsOfTheFilm = cueWords();

/** A time of the joined film, as a frame of this part. */
const film = (minutes: number, seconds: number): number => at(minutes, seconds) - FILM_START;

describe('cue sheet of Part 0 and Part 1', () => {
  it('runs from 1:17 to 4:33 of the film: 196 seconds at 24 frames a second', () => {
    expect(FILM_START).toBe(at(1, 17));
    expect(DURATION).toBe(sec(196));
    expect(DURATION).toBe(4704);
  });

  it('starts every beat where the script starts it', () => {
    expect(BEAT).toEqual({
      '0.1': film(1, 17),
      '1.1': film(1, 43),
      '1.2': film(1, 55),
      '1.3': film(2, 45),
      '1.4': film(3, 19),
      '1.5': film(4, 11),
    });
    expect(BEATS[BEATS.length - 1].end).toBe(DURATION);
    expect(beatAt(0)).toBe('0.1');
    expect(beatAt(BEAT['1.2'])).toBe('1.2');
    expect(beatAt(DURATION - 1)).toBe('1.5');
  });

  it('speaks every sentence once, in order, without overlap, inside its own beat', () => {
    expect(Object.keys(SPEECH)).toEqual(NARRATION.map((s) => s.id));
    let previousEnd = 0;
    for (const {id, beat} of NARRATION) {
      const {start, end} = SPEECH[id];
      const window = BEATS.find((b) => b.id === beat)!;
      expect(start, id).toBeGreaterThanOrEqual(previousEnd);
      expect(end, id).toBeGreaterThan(start);
      expect(start, id).toBeGreaterThanOrEqual(window.start);
      expect(end, id).toBeLessThanOrEqual(window.end);
      previousEnd = end;
    }
  });

  it('speaks at the script\'s calm pace: about 138 written words a minute', () => {
    const speakingSeconds = NARRATION.reduce((sum, {id}) => sum + (SPEECH[id].end - SPEECH[id].start), 0) / FPS;
    const wordsPerMinute = (TOTAL_WORDS / speakingSeconds) * 60;
    expect(wordsPerMinute).toBeGreaterThan(132);
    expect(wordsPerMinute).toBeLessThan(142);
    // No beat has to be hurried to fit the time the script gives it.
    for (const {id} of BEATS) expect(BEAT_PACE[id], id).toBeLessThanOrEqual(PACING.fastestWordsPerMinute);
  });

  it('paces every sentence so that it can be said calmly', () => {
    for (const {id, text} of NARRATION) {
      const seconds = (SPEECH[id].end - SPEECH[id].start) / FPS;
      const rate = syllableCount(text) / seconds;
      expect(rate, `${id}: ${rate.toFixed(2)} syllables a second`).toBeGreaterThan(2.2);
      expect(rate, `${id}: ${rate.toFixed(2)} syllables a second`).toBeLessThan(5.4);
    }
  });

  it('holds every beat for a moment after its last sentence', () => {
    for (const beat of BEATS) {
      const last = NARRATION.filter((s) => s.beat === beat.id).pop()!;
      expect(beat.end - SPEECH[last.id].end, beat.id).toBeGreaterThanOrEqual(PACING.tail);
    }
    // "Row H1 fills its second and third cells. Hold."
    expect(DURATION - SPEECH.p33.end).toBeGreaterThanOrEqual(sec(2));
  });

  it('opens and pays the two loops of the ledger near the times the ledger gives', () => {
    const near = (frame: number, minutes: number, seconds: number, within: number): void => {
      expect(Math.abs(frame - film(minutes, seconds)), `${minutes}:${seconds}`).toBeLessThanOrEqual(sec(within));
    };
    // L02, "Where does the memory loss arise?": opens 1:47, pays 2:23.
    near(atWord('p05', 'the loss'), 1, 47, 3);
    near(atWord('p10', 'at encoding'), 2, 23, 3);
    // L03, "Does working memory pass as the core deficit?": opens 3:08, pays 3:36 and 3:51.
    near(SPEECH.p18.start, 3, 8, 3);
    near(atWord('p24', 'neither'), 3, 36, 3);
    near(atWord('p27', '0.20'), 3, 51, 5);
  });

  it('accepts a measured word start only under a key that a cue asks for, and inside its sentence', () => {
    for (const [id, words] of Object.entries(WORD_ONSETS)) {
      for (const [key, frame] of Object.entries(words)) {
        expect(cueWordsOfTheFilm, `WORD_ONSETS has "${id}: ${key}", which no cue asks for`).toContain(`${id}: ${key}`);
        expect(frame).toBeGreaterThanOrEqual(SPEECH[id as keyof typeof SPEECH].start);
        expect(frame).toBeLessThanOrEqual(SPEECH[id as keyof typeof SPEECH].end);
      }
    }
    expect(cueWordsOfTheFilm).toContain('p15: 0.85');
    expect(cueWordsOfTheFilm).toContain('p27: 0.20');
  });

  it('knows which sentence is being spoken, and that none is in a gap or a hold', () => {
    expect(sentenceAt(0)).toBeNull();
    expect(sentenceAt(SPEECH.p01.start)).toBe('p01');
    expect(sentenceAt(SPEECH.p01.end)).toBeNull();
    expect(sentenceAt(SPEECH.p15.start + 30)).toBe('p15');
    expect(sentenceAt(DURATION - 1)).toBeNull();
  });
});
