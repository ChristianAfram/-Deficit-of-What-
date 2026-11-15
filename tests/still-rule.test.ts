import {describe, expect, it} from 'vitest';
import {DURATION, PAUSE, SPEECH, TITLE_START} from '../src/coldopen/cues';
import {CAMERA, FREEZE, SHOT, SOUND, type Anim} from '../src/coldopen/shots';
import {sec} from '../src/kit/time';

const anims: [string, Anim][] = [
  ...(Object.entries(SHOT) as [string, Anim][]),
  ['camera.figure', CAMERA.figure.move],
  ['camera.table', CAMERA.table.move],
];

describe('the still rule', () => {
  it('lets nothing change on screen while a number is being spoken', () => {
    for (const [freezeName, {f0, f1, phrase}] of Object.entries(FREEZE)) {
      expect(f1, freezeName).toBeGreaterThan(f0);
      for (const [name, {from, to}] of anims) {
        // An animation is complete by the first frame of the number, or starts after the window.
        const clear = to <= f0 || from >= f1;
        expect(clear, `${name} (${from} to ${to}) moves during "${phrase}" (${f0} to ${f1})`).toBe(true);
      }
    }
  });

  it('has every spoken numeral on screen by the frame it is spoken', () => {
    expect(SHOT.tagSample.to).toBeLessThanOrEqual(FREEZE.sample.f0); // N = 173
    expect(SHOT.weeksPeriod1.to).toBeLessThanOrEqual(FREEZE.weeks1.f0); // 3 WEEKS
    expect(SHOT.weeksPeriod2.to).toBeLessThanOrEqual(FREEZE.weeks2.f0);
    expect(SHOT.row1Value.to).toBe(FREEZE.plus37.f0); // +37% cuts on with its word
    expect(SHOT.row2Value.to).toBe(FREEZE.minus53.f0);
  });

  it('lands each bar before its number, and stops the camera before a result', () => {
    expect(SHOT.row1Bar.to).toBeLessThanOrEqual(SHOT.row1Value.from);
    expect(SHOT.row2Bar.to).toBeLessThanOrEqual(SHOT.row2Value.from);
    expect(CAMERA.figure.move.to).toBeLessThanOrEqual(FREEZE.plus37.f0 - 6);
    for (const cut of [SHOT.row1Value, SHOT.row2Value, SHOT.row3Value]) {
      const moving = cut.from > CAMERA.figure.move.from && cut.from < CAMERA.figure.move.to;
      expect(moving).toBe(false);
    }
  });

  it('shows each note only after its number has been spoken', () => {
    expect(SHOT.row1Note.from).toBeGreaterThanOrEqual(FREEZE.plus37.f1);
    expect(SHOT.row2Note.from).toBeGreaterThanOrEqual(FREEZE.minus53.f1);
    expect(SHOT.row3Note.from).toBeGreaterThan(SHOT.row3Value.from);
  });
});

describe('the shot list', () => {
  it('keeps every animation inside the film, running forwards', () => {
    for (const [name, {from, to}] of anims) {
      expect(from, name).toBeGreaterThanOrEqual(0);
      expect(to, name).toBeGreaterThanOrEqual(from);
      expect(to, name).toBeLessThan(DURATION);
    }
  });

  it('shows the citation alone before the first word, and marks each figure before it draws', () => {
    expect(SHOT.citation.to).toBeLessThanOrEqual(SPEECH.s01.start);
    expect(SHOT.tagDesign.from).toBeGreaterThan(SHOT.citation.to);
    expect(SHOT.schematicMark.to).toBeLessThanOrEqual(SHOT.blocksPeriod1.from - 6);
    expect(SHOT.dataMark.to).toBeLessThanOrEqual(SHOT.zeroLine.from - 6);
  });

  it('holds the three rows in silence through the written pause', () => {
    expect(SHOT.row3Note.to).toBeLessThanOrEqual(PAUSE.start);
    for (const [name, {from, to}] of anims) {
      const insidePause = from < PAUSE.end && to > PAUSE.start;
      expect(insidePause, `${name} moves during the written pause`).toBe(false);
    }
    for (const tick of SOUND.ticks) expect(tick < PAUSE.start || tick >= PAUSE.end).toBe(true);
  });

  it('has the limits on screen before "Learning did not follow." and long enough to read', () => {
    expect(SHOT.limits.from).toBeGreaterThanOrEqual(PAUSE.end);
    expect(SHOT.limits.to).toBeLessThanOrEqual(SPEECH.s06.start);
    // 29 words: at least nine seconds at full strength.
    expect(SHOT.figureRecedes.from - SHOT.limits.to).toBeGreaterThanOrEqual(sec(9));
  });

  it('clears the trial figure before the word DEFICIT, and the word before the title', () => {
    expect(SHOT.figureRecedes.to).toBeLessThanOrEqual(SHOT.deficit.from);
    expect(SHOT.headResultStatus.to).toBeLessThanOrEqual(SPEECH.s12.end);
    expect(SHOT.deficitOut.from).toBe(TITLE_START);
    expect(SHOT.title.from).toBeGreaterThanOrEqual(SHOT.deficitOut.to);
  });

  it('plays three ticks, one per row, and nothing tonal before the last sentence', () => {
    expect(SOUND.ticks).toHaveLength(3);
    expect(SOUND.lowNote.from).toBeGreaterThan(SPEECH.s12.start);
    expect(SOUND.lowNote.from).toBeLessThan(SPEECH.s13.start);
    expect(SOUND.pulse.at[0]).toBe(TITLE_START);
  });

  it('matches the frames of the build spec for the current pacing', () => {
    expect(SHOT.row1Value.from).toBe(615);
    expect(SHOT.row2Value.from).toBe(738);
    expect(SHOT.row3Value.from).toBe(899);
    expect(SHOT.limits).toEqual({from: 1010, to: 1034});
    expect(SHOT.figureRecedes).toEqual({from: 1254, to: 1298});
    expect(SHOT.deficit.from).toBe(1309);
    expect(CAMERA.figure.move).toEqual({from: 429, to: 609});
    expect(CAMERA.table.move).toEqual({from: 1350, to: 1669});
    expect(SHOT.title).toEqual({from: 1748, to: 1772});
  });
});
