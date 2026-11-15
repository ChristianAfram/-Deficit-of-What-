import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import * as strings from '../src/coldopen/strings';
import {PALETTE} from '../src/kit/theme';

// The brief as running text: quote marks of blockquotes and line breaks removed.
const brief = readFileSync(new URL('../docs/brief-cold-open.md', import.meta.url), 'utf8')
  .replace(/^>\s?/gm, '')
  .replace(/\s+/g, ' ');

const flatten = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flatten);
  return [];
};

const all = flatten(strings);

describe('on-screen strings', () => {
  it('uses real minus signs and en dashes, never a hyphen in their place', () => {
    for (const s of all) {
      expect(s, s).not.toMatch(/(^|\s)-\d/); // a hyphen used as a minus sign
      expect(s, s).not.toMatch(/\d-\d/); // a hyphen used in a range
    }
    expect(strings.RESULT_ROWS[1].value).toBe('−53%');
    expect(strings.CITATION).toContain('367–380');
    expect(strings.DESIGN_TAG.join(' ')).toContain('7–12');
  });

  it('carries the citation, the design tag and "Not medical advice"', () => {
    expect(strings.CITATION).toBe('Pelham et al. (2022). J Consult Clin Psychol 90(5), 367–380.');
    expect(strings.NOT_MEDICAL_ADVICE).toBe('Not medical advice');
    expect(brief).toContain(strings.CITATION);
    expect(brief).toContain('"Not medical advice"');
  });

  it('takes the table and the title from the script', () => {
    expect(strings.TABLE_ROWS).toEqual(['H1 MEMORY', 'H2 ATTENTION', 'H3 DOPAMINE']);
    expect(strings.TABLE_COLUMNS).toEqual(['PREDICTION', 'RESULT', 'STATUS']);
    expect(strings.TITLE).toBe('DEFICIT OF WHAT?');
    expect(brief).toContain(strings.TITLE);
    expect(brief).toContain(strings.SUBTITLE);
    for (const row of strings.TABLE_ROWS) expect(brief).toContain(row);
  });

  it('shows the three result rows as amended after the fact-check (A2)', () => {
    expect(strings.RESULT_ROWS.map((r) => r.value)).toEqual(['+37%', '\u221253%', 'NO DETECTABLE EFFECT']);
    expect(strings.RESULT_PERCENT).toEqual([37, -53, null]);
    for (const row of strings.RESULT_ROWS) {
      expect(brief, row.label).toContain(row.label);
      expect(brief, row.note).toContain(row.note);
    }
    // Intervals stand in square brackets, as the look requires.
    expect(strings.RESULT_ROWS[0].note).toContain('[1.68, 1.90]');
    expect(strings.RESULT_ROWS[1].note).toContain('[\u22122.18, \u22121.86]');
    // The two means are deliberately not shown beside the percentages.
    for (const s of all) expect(s, s).not.toMatch(/6\.7|5\.0\b|3\.9/);
  });

  it('states the limits of the trial when the cold open ships alone (A3)', () => {
    expect(brief).toContain(strings.LIMITS.join(' '));
    expect(strings.LIMITS.join(' ')).toContain('80% of children on 18 mg');
    expect(strings.LIMITS.join(' ')).not.toMatch(/plan/i);
  });

  it('never says the medication does not work', () => {
    for (const s of all) {
      expect(s.toLowerCase(), s).not.toMatch(/does not work|doesn.t work|not real|will not tell you/);
    }
  });
});

describe('palette', () => {
  it('is the palette of the script', () => {
    expect(PALETTE).toEqual({
      ground: '#0E0F12',
      bone: '#E9E4D8',
      graphite: '#5B6068',
      amber: '#E8A33D',
      blueGrey: '#7C93A8',
      red: '#D2452D',
      conjectureLine: '#F4F7FA',
      conjectureGround: '#0F2A4A',
    });
    for (const hex of Object.values(PALETTE)) expect(brief).toContain(hex);
  });
});
