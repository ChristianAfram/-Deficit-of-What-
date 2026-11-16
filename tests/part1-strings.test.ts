import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import * as coldOpen from '../src/coldopen/strings';
import {evidenceCellBaselines, evidenceTableCells} from '../src/kit/EvidenceTable';
import {forestX} from '../src/kit/ForestRow';
import {BAND, LIVE} from '../src/kit/grid';
import {FINDINGS, FOREST, PLOT, STAGE, TABLE, TESTS_BOX} from '../src/part1/layout';
import {NARRATION} from '../src/part1/narration';
import * as strings from '../src/part1/strings';
import {widthOf} from './helpers/measure';

// The brief as running text: quote marks of blockquotes and line breaks removed.
const brief = readFileSync(new URL('../docs/brief-part-1.md', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/^>\s?/gm, '')
  .replace(/\s+/g, ' ');

const flatten = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flatten);
  return [];
};

const all = flatten(strings);
const rows = [...strings.WM_CHILDREN, ...strings.WM_ADULTS, ...strings.TRAINING_ROWS];

describe('on-screen strings of Part 0 and Part 1', () => {
  it('uses real minus signs and en dashes, never a hyphen in their place', () => {
    for (const s of all) {
      expect(s, s).not.toMatch(/(^|[\s[(])-\d/); // a hyphen used as a minus sign
      expect(s, s).not.toMatch(/\d-\d/); // a hyphen used in a range
    }
    expect(strings.EF_BAND.value).toBe('0.46–0.69');
    expect(strings.PAWLEY_FINDINGS[1].note).toContain('[−0.70, −0.06]');
    expect(strings.TRAINING_NOTE[0]).toContain('[−0.31, 0.31]');
  });

  it('puts every string in the brief, as the script has it or as an amendment gives it', () => {
    for (const s of all) expect(brief, s).toContain(s);
  });

  it('cites every study with journal, volume and pages, and a design tag', () => {
    expect(Object.keys(strings.STUDY)).toEqual(['faraone', 'skodzik', 'pawley', 'martinussen', 'alderson', 'willcutt', 'cortese']);
    for (const {citation, tag, short} of Object.values(strings.STUDY) as strings.Study[]) {
      expect(citation, citation).toMatch(/^[A-Z][^()]+ \((19|20)\d\d\)\. .+ \d+(\(\d+\))?, \d+(–\d+)?\.$/);
      expect(tag, tag).toMatch(/^[A-Z0-9 ,=-]+$/);
      // The short form names the same authors and the same year.
      if (short) {
        expect(citation.toUpperCase(), short).toContain(short.split(' ')[0]);
        expect(citation, short).toContain(short.slice(-4));
      }
    }
    expect(strings.STUDY.cortese.tag).toBe('META-ANALYSIS, 15 RCTS, N = 759');
    expect(strings.STUDY.willcutt.tag).toBe('META-ANALYSIS, 83 STUDIES, N = 3,734 WITH ADHD');
  });

  it('prints each estimate with the interval it is drawn from, in square brackets', () => {
    const show = (n: number): string => (n < 0 ? `−${Math.abs(n).toFixed(2)}` : n.toFixed(2));
    for (const {label, value, interval, drawn} of rows) {
      if (!drawn) continue;
      const [estimate, low, high] = drawn;
      expect(value, label).toBe(show(estimate));
      expect(interval, label).toBe(`[${show(low)}, ${show(high)}]`);
      expect(low, label).toBeLessThan(estimate);
      expect(high, label).toBeGreaterThan(estimate);
    }
    expect(strings.WM_CHILDREN.map((r) => `${r.label} ${r.value} ${r.interval}`)).toEqual([
      'SPATIAL STORAGE 0.85 [0.62, 1.08]',
      'SPATIAL CENTRAL EXECUTIVE 1.06 [0.72, 1.39]',
      'VERBAL STORAGE 0.47 [0.36, 0.59]',
      'VERBAL CENTRAL EXECUTIVE 0.43 [0.24, 0.62]',
    ]);
    expect(strings.TRAINING_ROWS.map((r) => `${r.value} ${r.interval}`)).toEqual([
      '0.52 [0.24, 0.80]',
      '0.47 [0.23, 0.70]',
      '0.37 [0.09, 0.66]',
      '0.20 [0.01, 0.40]',
    ]);
  });

  it('draws no mark where no number was read from the paper', () => {
    for (const {label, value, interval, drawn} of rows) {
      if (drawn) continue;
      expect(value, label).not.toMatch(/\d/);
      expect(interval, label).toBe('');
    }
  });

  it('speaks the numbers the screen shows', () => {
    const narration = NARRATION.map((s) => s.text).join(' ');
    for (const spoken of ['0.85', '1.06', '0.69', '0.20', '0.01']) expect(narration).toContain(spoken);
    expect(strings.WM_CHILDREN[0].value).toBe('0.85');
    expect(strings.WM_CHILDREN[1].value).toBe('1.06');
    expect(strings.EF_BAND.value).toContain('0.69');
    expect(strings.TRAINING_ROWS[3].value).toBe('0.20');
    expect(strings.TRAINING_ROWS[3].interval).toContain('0.01');
    expect(strings.HERITABILITY.line).toContain('0.74');
  });

  it('computes the overlap it shows', () => {
    // The shared area of two normal curves d apart: twice the area beyond d / 2.
    const erf = (x: number): number => {
      const t = 1 / (1 + 0.3275911 * Math.abs(x));
      const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return x >= 0 ? y : -y;
    };
    const shared = 1 - erf(strings.OVERLAP_D / 2 / Math.SQRT2);
    expect(strings.OVERLAP_D).toBe(0.5);
    expect((shared * 100).toFixed(1)).toBe('80.3');
    expect(strings.OVERLAP.note).toContain('80.3%');
    expect(strings.OVERLAP.value).toBe('DISTRIBUTIONS OVERLAP BY 80%');
  });

  it('keeps the evidence table of the cold open, and fills row H1 as the script has it', () => {
    expect(strings.TABLE_ROWS).toEqual(coldOpen.TABLE_ROWS);
    expect(strings.TABLE_COLUMNS).toEqual(coldOpen.TABLE_COLUMNS);
    expect(strings.NOT_MEDICAL_ADVICE).toBe(coldOpen.NOT_MEDICAL_ADVICE);
    expect(strings.H1.prediction.join(' ')).toBe('LOSS IN RETENTION AND RETRIEVAL');
    expect(strings.H1.result.join(' ')).toBe('ENCODING AND WORKING MEMORY WEAKER, MODERATE, NOT UNIVERSAL');
    expect(strings.H1.status.join(' ')).toBe('INVOLVED. NOT SUPPORTED AS THE DEFINING DEFICIT.');
  });

  it('gives a null at the strength the paper gives it', () => {
    expect(strings.SKODZIK_FINDINGS.map((f) => f.value)).toEqual(['WEAKER', 'NO SIGNIFICANT DIFFERENCE', 'NO DEFICIT OBSERVED']);
    // The estimate behind each word is on screen, with the kind of interval its paper reports.
    expect(strings.SKODZIK_FINDINGS.map((f) => f.note)).toEqual([
      'd = −0.49, 99% CI [−0.71, −0.27]',
      'd = −0.36, 99% CI [−0.94, 0.22]',
      undefined,
    ]);
    for (const {note} of strings.PAWLEY_FINDINGS) expect(note).toContain('95% CI');
    for (const s of all) expect(s, s).not.toMatch(/\bNO DIFFERENCE\b/);
    // The paper's rater is "typically unblinded", and not always.
    for (const s of all) expect(s, s).not.toMatch(/UNBLINDED/);
  });

  it('never says that memory is fine, or that the medication does not work', () => {
    for (const s of all) {
      expect(s.toLowerCase(), s).not.toMatch(/memory is (fine|normal|intact)|does not work|doesn.t work|not real/);
    }
  });
});

describe('layout of Part 0 and Part 1', () => {
  it('places every figure on whole pixels, inside the content field', () => {
    const numbers = (value: unknown): number[] =>
      typeof value === 'number' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(numbers) : [];
    for (const n of [TABLE, FOREST, PLOT, STAGE, FINDINGS, TESTS_BOX].flatMap(numbers)) expect(Number.isInteger(n), String(n)).toBe(true);
    const [top, bottom] = BAND.content;
    for (const y of [...TABLE.rowEdges, PLOT.top, PLOT.axisY, STAGE.top, STAGE.top + STAGE.height]) {
      expect(y).toBeGreaterThanOrEqual(top);
      expect(y).toBeLessThanOrEqual(bottom);
    }
    expect(PLOT.noteBaseline[1]).toBeLessThan(bottom - 8);
  });

  it('draws every estimate and bound on a whole pixel, left of the check boxes', () => {
    for (const {label, drawn} of rows) {
      if (!drawn) continue;
      for (const value of drawn) {
        const x = forestX(FOREST, value);
        expect(Number.isInteger(x), label).toBe(true);
        expect(x, label).toBeGreaterThanOrEqual(FOREST.zeroX);
        expect(x, label).toBeLessThanOrEqual(PLOT.right);
      }
    }
    // "The last interval almost touches zero": it stops a few pixels short of the zero line.
    const lowest = forestX(FOREST, strings.TRAINING_ROWS[3].drawn![1]);
    expect(lowest - FOREST.zeroX).toBeGreaterThanOrEqual(2);
    expect(lowest - FOREST.zeroX).toBeLessThanOrEqual(6);
  });

  it('keeps every forest label clear of its estimate, and every interval clear of the zero line', () => {
    for (const {label, value, interval, drawn} of [...rows, {label: strings.EF_BAND.label, value: strings.EF_BAND.value, interval: '', drawn: null}]) {
      const valueWidth = widthOf(value, /\d/.test(value) ? 'estimate' : 'valueWords');
      expect(FOREST.left + widthOf(label, 'rowLabel'), label).toBeLessThanOrEqual(FOREST.valueRight - valueWidth - 16);
      if (drawn) expect(FOREST.intervalLeft + widthOf(interval, 'interval'), label).toBeLessThanOrEqual(FOREST.zeroX - 16);
    }
    for (const box of strings.TESTS.boxes) {
      expect(TESTS_BOX.x + 28 + 16 + widthOf(box, 'rowLabel'), box).toBeLessThanOrEqual(LIVE.right);
    }
    for (const line of strings.TRAINING_NOTE) expect(FOREST.left + widthOf(line, 'limits'), line).toBeLessThanOrEqual(PLOT.right);
  });

  it('fits every line of a table cell into its cell', () => {
    const [prediction, result, status] = evidenceTableCells(TABLE)[0];
    for (const [cell, lines] of [
      [prediction, strings.H1.prediction],
      [result, strings.H1.result],
      [status, strings.H1.status],
    ] as const) {
      for (const line of lines) expect(widthOf(line, 'tableCell'), line).toBeLessThanOrEqual(cell.width - 2 * TABLE.textInset);
      const baselines = evidenceCellBaselines(cell, lines.length);
      expect(baselines[0] - 17, lines[0]).toBeGreaterThanOrEqual(cell.y + 12);
      expect(baselines[baselines.length - 1], lines[0]).toBeLessThanOrEqual(cell.y + cell.height - 12);
    }
    // A row holds three lines, for the longer cells of the rows to come.
    const three = evidenceCellBaselines(prediction, 3);
    expect(three[0] - 17).toBeGreaterThanOrEqual(prediction.y + 8);
    expect(three[2]).toBeLessThanOrEqual(prediction.y + prediction.height - 8);
  });

  it('fits the findings of each study into its block, and every citation into the live width', () => {
    const blocks = [strings.SKODZIK_FINDINGS, strings.PAWLEY_FINDINGS];
    blocks.forEach((findings, block) => {
      const {left, valueRight} = FINDINGS.block[block];
      const limit = block === 0 ? FINDINGS.block[1].left - 24 : LIVE.right;
      for (const {label, value, note} of findings) {
        expect(left + widthOf(label, 'rowLabel'), label).toBeLessThanOrEqual(valueRight - widthOf(value, 'valueWords') - 16);
        if (note) expect(left + widthOf(note, 'note'), note).toBeLessThanOrEqual(limit);
      }
      expect(valueRight).toBeLessThanOrEqual(limit);
    });
    for (const {citation, tag} of Object.values(strings.STUDY)) {
      expect(LIVE.left + widthOf(citation, 'citation'), citation).toBeLessThanOrEqual(LIVE.right);
      expect(LIVE.left + widthOf(tag, 'tag'), tag).toBeLessThanOrEqual(LIVE.right);
    }
    expect(LIVE.left + widthOf(strings.HERITABILITY.note, 'note')).toBeLessThanOrEqual(LIVE.right);
    expect(LIVE.left + widthOf(strings.OVERLAP.note, 'note')).toBeLessThanOrEqual(LIVE.right);
    for (const stage of strings.STAGES) expect(widthOf(stage, 'stage'), stage).toBeLessThanOrEqual(STAGE.width - 32);
  });
});
