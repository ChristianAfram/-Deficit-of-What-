import {describe, expect, it} from 'vitest';
import {CAPTIONS} from '../src/part1/captions';
import {BEAT, DURATION, SPEECH} from '../src/part1/cues';
import {BANDS, FREEZE, SHOT, SOUND} from '../src/part1/shots';
import type {Anim} from '../src/kit/anim';
import {sec} from '../src/kit/time';

const anims = Object.entries(SHOT) as [string, Anim][];

/** Every frame on which the picture changes for a reason other than an animation in SHOT. */
const captionChanges = CAPTIONS.flatMap(({start, end}) => [start, end]);

describe('the still rule in Part 0 and Part 1', () => {
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

  it('freezes on every number the narration speaks', () => {
    expect(Object.values(FREEZE).map((f) => f.phrase)).toEqual([
      'seventy-four percent',
      '2017',
      'half a standard deviation (long-term memory)',
      'two hundred and five',
      '2024',
      '0.85',
      '1.06',
      'two (further tests)',
      'eighty-three',
      '0.69',
      'fifteen',
      'half a standard deviation (training)',
      '0.20',
      '0.01',
    ]);
  });

  it('has every spoken numeral on screen by the frame it is spoken', () => {
    expect(SHOT.heritability.to).toBe(FREEZE.heritability.f0); // NEAR 0.74 cuts on with its word
    expect(SHOT.skodzikCite.to).toBeLessThanOrEqual(FREEZE.year2017.f0); // (2017)
    expect(SHOT.pawleyTag.to).toBeLessThanOrEqual(FREEZE.sample205.f0); // 205 VS 50
    expect(SHOT.pawleyCite.to).toBeLessThanOrEqual(FREEZE.year2024.f0); // (2024)
    expect(SHOT.wm1Value.to).toBe(FREEZE.storage.f0); // 0.85 cuts on with its word
    expect(SHOT.wm2Value.to).toBe(FREEZE.manipulation.f0); // 1.06
    expect(SHOT.willcuttTag.to).toBeLessThanOrEqual(FREEZE.studies83.f0); // 83 STUDIES
    expect(SHOT.bandValue.to).toBe(FREEZE.ceiling.f0); // 0.46–0.69
    expect(SHOT.corteseTag.to).toBeLessThanOrEqual(FREEZE.trials15.f0); // 15 RCTS
    expect(SHOT.tr2Value.to).toBeLessThanOrEqual(FREEZE.halfTraining.f0); // 0.52 and 0.47
    expect(SHOT.tr4Value.to).toBe(FREEZE.blinded.f0); // 0.20 [0.01, 0.40]
    expect(SHOT.tr4Value.to).toBeLessThanOrEqual(FREEZE.lowerBound.f0);
  });

  it('lands each estimate before its number is spoken', () => {
    for (const row of ['wm1', 'wm2', 'wm3', 'wm4', 'tr1', 'tr2', 'tr3', 'tr4'] as const) {
      expect(SHOT[`${row}Mark`].to, row).toBeLessThan(SHOT[`${row}Value`].from);
      expect(SHOT[`${row}Label`].to, row).toBeLessThanOrEqual(SHOT[`${row}Value`].from);
    }
    expect(SHOT.band.to).toBeLessThan(SHOT.bandValue.from);
  });
});

describe('the order of the shots in Part 0 and Part 1', () => {
  /** `first` is complete before `then` starts. */
  const before = (first: keyof typeof SHOT, then: keyof typeof SHOT): void => {
    expect(SHOT[first].to, `${first} must be complete before ${then} starts`).toBeLessThanOrEqual(SHOT[then].from);
  };

  it('keeps every animation inside the part, running forwards', () => {
    for (const [name, {from, to}] of anims) {
      expect(from, name).toBeGreaterThanOrEqual(0);
      expect(to, name).toBeGreaterThanOrEqual(from);
      expect(to, name).toBeLessThan(DURATION);
    }
  });

  it('shows one study in the citation band at a time, its citation before its tag', () => {
    BANDS.forEach(({study, cite, tag, leaves}, i) => {
      expect(cite.to, study).toBeLessThanOrEqual(tag.from);
      expect(tag.to, study).toBeLessThanOrEqual(leaves.from);
      if (i > 0) expect(BANDS[i - 1].leaves.to, `${BANDS[i - 1].study} has left before ${study}`).toBeLessThanOrEqual(cite.from);
    });
    expect(BANDS.map((b) => b.study)).toEqual(['faraone', 'skodzik', 'pawley', 'martinussen', 'alderson', 'willcutt', 'cortese']);
  });

  it("keeps the film's own figures out from under a study's citation", () => {
    // The computed curves, the prediction, the two tests and the status line are the film's own.
    before('heritabilityLeaves', 'curvesMark');
    before('curvesLeave', 'tableReturns');
    before('tableLeaves', 'skodzikCite');
    before('aldersonBandLeaves', 'testsHead');
    before('testsLeave', 'statusTable');
  });

  it('states the first limit under its citation, then draws the second', () => {
    before('faraoneCite', 'faraoneTag');
    before('faraoneTag', 'heritability');
    before('heritability', 'heritabilityLeaves');
    before('curvesMark', 'curveComparison');
    before('curvesAxis', 'curveComparison');
    expect(SHOT.curveComparison.from).toBeLessThan(SHOT.curveAdhd.from);
    before('curveAdhd', 'overlapFill');
    before('overlapFill', 'overlapValue');
    before('overlapValue', 'singleCase');
    expect(SHOT.singleCase.to).toBeLessThanOrEqual(SPEECH.p04.end);
  });

  it('draws the three stages in order, and fills the first cell on the words of the prediction', () => {
    before('tableReturns', 'stagesMark');
    expect(SHOT.stagesMark.to).toBeLessThanOrEqual(SHOT.stage1.from - 6);
    before('stage1', 'stage2');
    before('stage2', 'stage3');
    before('stage3', 'predictionCell');
    expect(SHOT.predicted2.from).toBe(SHOT.predictionCell.from);
    before('predicted2', 'predicted3');
    expect(SHOT.predicted3.to).toBeLessThanOrEqual(SPEECH.p05.end);
    // The filled cell is held for two seconds before the table leaves.
    expect(SHOT.tableLeaves.from - SHOT.predictionCell.to).toBeGreaterThanOrEqual(sec(2));
  });

  it('settles the first marker, clears the predicted sites, then settles the second', () => {
    before('skodzikCite', 'skodzikTag');
    before('skodzikHead', 'verbalLabel');
    before('verbalLabel', 'verbalValue');
    before('verbalValue', 'visualLabel');
    before('visualLabel', 'visualValue');
    before('visualValue', 'marker1');
    before('marker1', 'retrievalLabel');
    before('retrievalLabel', 'retrievalValue');
    before('retrievalValue', 'predictedClear');
    before('predictedClear', 'skodzikBandLeaves');
    before('pawleyTag', 'pawleyHead');
    before('pawleyHead', 'learningLabel');
    before('learningLabel', 'learningValue');
    before('learningValue', 'recallLabel');
    before('recallLabel', 'recallValue');
    before('recallValue', 'marker2');
    // "The two markers stay where they are, in disagreement."
    expect(SHOT.stagesLeave.from - SHOT.marker2.to).toBeGreaterThanOrEqual(sec(4));
    expect(SHOT.stagesLeave.to).toBeLessThanOrEqual(BEAT['1.3']);
  });

  it('builds the forest plot row by row, the children first, then the adults, then the two boxes', () => {
    expect(SHOT.plotMark.to).toBeLessThanOrEqual(SHOT.zeroLine.from - 6);
    before('zeroLine', 'wm1Label');
    before('wm1Value', 'wm2Mark');
    before('wm2Value', 'wm3Label');
    before('wm3Value', 'wm4Label');
    before('wm4Value', 'martinussenBandLeaves');
    before('aldersonCite', 'wm5Value');
    before('wm5Value', 'wm6Value');
    before('wm6Value', 'aldersonBandLeaves');
    before('testsHead', 'box1');
    before('box1', 'box2');
    before('box2', 'wmRowsLeave');
    expect(SHOT.wmRowsLeave.to).toBeLessThanOrEqual(BEAT['1.4']);
  });

  it('marks each box as failed after the result that fails it', () => {
    before('wmRowsLeave', 'willcuttCite');
    before('bandLabel', 'band');
    before('bandValue', 'box1Failed');
    before('box1Failed', 'willcuttLeaves');
    before('willcuttLeaves', 'corteseCite');
    before('corteseTag', 'trainingHead');
    before('trainingHead', 'tr1Label');
    before('tr1Value', 'tr2Mark');
    before('tr2Value', 'tr3Label');
    before('tr3Value', 'tr4Label');
    before('tr4Value', 'trainingNote');
    before('trainingNote', 'box2Failed');
    before('box2Failed', 'testsLeave');
    expect(SHOT.testsLeave.to).toBeLessThanOrEqual(BEAT['1.5']);
  });

  it('fills row H1 as the status line is spoken, and holds', () => {
    before('statusTable', 'statusInvolved');
    before('statusInvolved', 'resultCell');
    before('resultCell', 'statusNotSupported');
    expect(SHOT.statusNotSupported.to).toBeLessThanOrEqual(SPEECH.p32.end);
    expect(DURATION - SHOT.statusNotSupported.to).toBeGreaterThanOrEqual(sec(8));
  });
});

describe('the sound of Part 0 and Part 1', () => {
  it('plays one tick for the cell, for each marker and for each row of data', () => {
    expect(SOUND.ticks).toEqual(
      (
        [
          'predictionCell',
          'marker1',
          'marker2',
          'wm1Value',
          'wm2Value',
          'wm3Value',
          'wm4Value',
          'wm5Value',
          'wm6Value',
          'bandValue',
          'tr1Value',
          'tr2Value',
          'tr3Value',
          'tr4Value',
          'resultCell',
        ] as const
      ).map((shot) => SHOT[shot].from),
    );
    expect(new Set(SOUND.ticks).size).toBe(SOUND.ticks.length);
  });

  it('plays a lower tick for each failed box', () => {
    expect(SOUND.lowTicks).toEqual([SHOT.box1Failed.from, SHOT.box2Failed.from]);
  });

  it('keeps the pulse alone under beat 0.1, and moves the string line one step at the status line', () => {
    expect(SOUND.pulse.at[0]).toBe(0);
    expect(SOUND.string.step0[0]).toBe(BEAT['1.1']);
    expect(Math.max(...SOUND.string.step0)).toBeLessThan(SOUND.string.step1[0]);
    expect(SOUND.string.step1[0]).toBe(SHOT.statusNotSupported.from);
    for (const start of [...SOUND.pulse.at, ...SOUND.string.step0, ...SOUND.string.step1]) {
      expect(start).toBeGreaterThanOrEqual(0);
      expect(start).toBeLessThan(DURATION);
    }
  });
});
