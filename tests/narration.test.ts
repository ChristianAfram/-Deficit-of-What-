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

/** Amendment A1 of the brief: the one sentence the writer changed after the fact-check. */
const amendment = (): {was: string; now: string} => {
  const from = brief.indexOf('### A1. Narration, third sentence');
  const to = brief.indexOf('### A2.');
  expect(from).toBeGreaterThan(-1);
  const quotes = brief
    .slice(from, to)
    .split(/\n\n/)
    .filter((block) => block.startsWith('>'))
    .map((block) => block.replace(/^>\s?/gm, '').replace(/\s+/g, ' ').trim());
  expect(quotes).toHaveLength(2);
  return {was: quotes[0], now: quotes[1]};
};

describe('narration', () => {
  it('is the script, word for word, with the one agreed amendment', () => {
    const {was, now} = amendment();
    const script = scriptNarration();
    expect(script).toContain(was);
    const built = NARRATION.map((s) => s.text).join(' ');
    expect(built).toBe(script.replace(was, now));
  });

  it('has the thirteen sentences of the six script paragraphs, in order', () => {
    expect(NARRATION.map((s) => s.id)).toEqual(
      Array.from({length: 13}, (_, i) => `s${String(i + 1).padStart(2, '0')}`),
    );
    expect(NARRATION.map((s) => s.paragraph)).toEqual([1, 1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 6]);
  });

  it('counts 144 words: 140 in the script, plus 4 from the amended sentence', () => {
    expect(TOTAL_WORDS).toBe(144);
    expect(wordCount('Learning did not follow.')).toBe(4);
  });

  it('addresses nobody: no second person and no "we" (register, rule 7)', () => {
    for (const {text} of NARRATION) {
      expect(text).not.toMatch(/\b(you|your|we|our|us)\b/i);
    }
  });
});
