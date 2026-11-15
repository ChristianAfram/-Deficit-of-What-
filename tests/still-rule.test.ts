import {describe, expect, it} from 'vitest';
import {CAPTIONS} from '../src/coldopen/captions';
import {DURATION, PAUSE, SPEECH, TITLE_START} from '../src/coldopen/cues';
import {FREEZE, SHOT, SOUND} from '../src/coldopen/shots';
import type {Anim} from '../src/kit/anim';
import {sec} from '../src/kit/time';

const anims = Object.entries(SHOT) as [string, Anim][];

/** Every frame on which the picture changes for a reason other than an animation in SHOT. */
const captionChanges = CAPTIONS.flatMap(({start, end}) => [start, end]);

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

  it('holds for the captions of the review build too', () => {
    for (const {f0, f1, phrase} of Object.values(FREEZE)) {
      for (const frame of captionChanges) {
        expect(frame <= f0 || frame >= f1, `a caption changes on ${frame}, during "${phrase}" (${f0} to ${f1})`).toBe(true);
      }
    }
  });

  it('has every spoken numeral on screen by the frame it is spoken', () => {
    expect(SHOT.citation.to).toBeLessThanOrEqual(FREEZE.year.f0); // (2022)
    expect(SHOT.tagSample.to).toBeLessThanOrEqual(FREEZE.sample.f0); // N = 173
    expect(SHOT.weeksPeriod1.to).toBeLessThanOrEqual(FREEZE.weeks1.f0); // 3 WEEKS
    expect(SHOT.weeksPeriod2.to).toBeLessThanOrEqual(FREEZE.weeks2.f0);
    expect(SHOT.row1Value.to).toBe(FREEZE.plus37.f0); // +37% cuts on with its word
    expect(SHOT.row2Value.to).toBe(FREEZE.minus53.f0);
  });

  it('lands each bar before its number is spoken', () => {
    expect(SHOT.row1Bar.to).toBeLessThan(SHOT.row1Value.from);
    expect(SHOT.row2Bar.to).toBeLessThan(SHOT.row2Value.from);
  });
});

describe('the order of the shots', () => {
  /** `first` is complete before `then` starts. */
  const before = (first: keyof typeof SHOT, then: keyof typeof SHOT): void => {
    expect(SHOT[first].to, `${first} must be complete before ${then} starts`).toBeLessThanOrEqual(SHOT[then].from);
  };

  it('keeps every animation inside the film, running forwards', () => {
    for (const [name, {from, to}] of anims) {
      expect(from, name).toBeGreaterThanOrEqual(0);
      expect(to, name).toBeGreaterThanOrEqual(from);
      expect(to, name).toBeLessThan(DURATION);
    }
  });

  it('shows the citation alone before the first word, then its tag part by part', () => {
    expect(SHOT.citation.to).toBeLessThanOrEqual(SPEECH.s01.start);
    before('citation', 'tagDesign');
    before('tagDesign', 'tagSample');
    before('tagSample', 'tagDrug');
  });

  it('marks each figure before it draws', () => {
    expect(SHOT.schematicMark.to).toBeLessThanOrEqual(SHOT.blocksPeriod1.from - 6);
    expect(SHOT.dataMark.to).toBeLessThanOrEqual(SHOT.zeroLine.from - 6);
  });

  it('builds the diagram in the order the design is named', () => {
    before('sequenceLabels', 'blocksPeriod1');
    before('blocksPeriod1', 'blocksPeriod2');
    before('blocksPeriod2', 'randomNode');
    // The hatch clears only after the whole design has been named, and the
    // conditions show only once the hatch has gone.
    before('randomBranches', 'hatchClears');
    before('hatchClears', 'conditionsShown');
    before('conditionsShown', 'dataMark');
  });

  it('builds each row as label, bar, then value', () => {
    before('zeroLine', 'row1Bar');
    before('row1Label', 'row1Bar');
    before('row1Bar', 'row1Value');
    before('row1Value', 'row2Label');
    expect(SHOT.row2Label.from).toBeLessThan(SHOT.row2Bar.from);
    before('row2Bar', 'row2Value');
    before('row2Value', 'separator');
    before('separator', 'row3Label');
    before('row3Label', 'row3Value');
  });

  it('holds the three rows in silence through the written pause', () => {
    expect(SHOT.row3Value.to).toBeLessThan(PAUSE.start);
    for (const [name, {from, to}] of anims) {
      const insidePause = from < PAUSE.end && to > PAUSE.start;
      expect(insidePause, `${name} moves during the written pause`).toBe(false);
    }
    for (const tick of SOUND.ticks) expect(tick < PAUSE.start || tick >= PAUSE.end).toBe(true);
    for (const frame of captionChanges) expect(frame <= PAUSE.start || frame >= PAUSE.end).toBe(true);
  });

  it('has the limits on screen before "Learning did not follow." and long enough to read', () => {
    expect(SHOT.limits.from).toBeGreaterThanOrEqual(PAUSE.end);
    expect(SHOT.limits.to).toBeLessThanOrEqual(SPEECH.s06.start);
    // 34 words: at least nine seconds at full strength.
    expect(SHOT.figureRecedes.from - SHOT.limits.to).toBeGreaterThanOrEqual(sec(9));
  });

  it('clears the trial figure by the frame DEFICIT cuts on, with no empty frame between', () => {
    expect(SHOT.figureRecedes.to).toBe(SHOT.deficit.from);
  });

  it('draws the whole empty table before any label, and labels it as the words are spoken', () => {
    before('deficit', 'tableTopRule');
    before('tableColumnRules', 'rowMemory');
    before('rowMemory', 'rowAttention');
    before('rowAttention', 'rowDopamine');
    before('rowDopamine', 'headPrediction');
    before('headPrediction', 'headResultStatus');
    expect(SHOT.headResultStatus.to).toBeLessThanOrEqual(SPEECH.s12.end);
  });

  it('sets the title only after DEFICIT has gone, then the subtitle', () => {
    expect(SHOT.deficitOut.from).toBe(TITLE_START);
    before('deficitOut', 'title');
    before('title', 'subtitle');
  });

  it('plays three ticks, one per row, and the low note under the last sentence only', () => {
    expect(SOUND.ticks).toEqual([SHOT.row1Value.from, SHOT.row2Value.from, SHOT.row3Value.from]);
    expect(SOUND.lowNote.from).toBeGreaterThanOrEqual(SPEECH.s12.end);
    expect(SOUND.lowNote.from).toBeLessThanOrEqual(SPEECH.s13.start);
    expect(SOUND.pulse.at[0]).toBe(TITLE_START);
  });
});
