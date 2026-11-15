import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {NARRATION, TOTAL_WORDS, wordCount} from '../src/coldopen/narration';

const brief = readFileSync(new URL('../docs/brief-cold-open.md', import.meta.url), 'utf8');

/** The narration block of the brief: the quoted lines between its two markers. */
const scriptNarration = (): string => {
  const from = brief.indexOf('Narration, word for word:');
  const to = brief.indexOf('Picture. Black.');
  expect(from).toBeGreaterThan(-1);
  expect(to).toBeGreaterThan(from);
  return brief
    .slice(from, to)
    .split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, ''))
    .join(' ')
    .replace(/\*\(pause, 2 seconds\)\*/, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

describe('narration', () => {
  it('is the script, word for word', () => {
    const built = NARRATION.map((s) => s.text).join(' ');
    expect(built).toBe(scriptNarration());
  });

  it('has the thirteen sentences of the six script paragraphs, in order', () => {
    expect(NARRATION.map((s) => s.id)).toEqual(
      Array.from({length: 13}, (_, i) => `s${String(i + 1).padStart(2, '0')}`),
    );
    expect(NARRATION.map((s) => s.paragraph)).toEqual([1, 1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 6]);
  });

  it('counts 140 words', () => {
    expect(TOTAL_WORDS).toBe(140);
    expect(wordCount('Learning did not follow.')).toBe(4);
  });

  it('addresses nobody: no second person and no "we" (register, rule 7)', () => {
    for (const {text} of NARRATION) {
      expect(text).not.toMatch(/\b(you|your|we|our|us)\b/i);
    }
  });
});
