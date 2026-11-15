import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {NARRATION, TOTAL_WORDS, wordCount} from '../src/coldopen/narration';

// A Windows checkout may hold the brief with CRLF line endings.
const brief = readFileSync(new URL('../docs/brief-cold-open.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const unquote = (block: string): string =>
  block
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

/** The narration block of the brief: the quoted lines between its two markers. */
const scriptNarration = (): string => {
  const from = brief.indexOf('Narration, word for word:');
  const to = brief.indexOf('Picture. Black.');
  expect(from).toBeGreaterThan(-1);
  expect(to).toBeGreaterThan(from);
  return unquote(
    brief
      .slice(from, to)
      .split('\n')
      .filter((line) => line.startsWith('>'))
      .join('\n')
      .replace(/\*\(pause, 2 seconds\)\*/, ' '),
  );
};

/** The amended sentences: every "### A<n>. Narration, ..." section of the brief, as its Was and Now quotes. */
const amendments = (): {name: string; was: string; now: string}[] =>
  brief
    .split(/^### /m)
    .filter((section) => /^A\d+\. Narration/.test(section))
    .map((section) => {
      const quotes = section.split(/\n\n/).filter((block) => block.startsWith('>')).map(unquote);
      expect(quotes, section.slice(0, 40)).toHaveLength(2);
      return {name: section.slice(0, section.indexOf('\n')), was: quotes[0], now: quotes[1]};
    });

describe('narration', () => {
  it('is the script, word for word, with exactly the three amended sentences', () => {
    const changes = amendments();
    expect(changes.map((c) => c.name)).toEqual([
      'A1. Narration, third sentence',
      'A6. Narration, fourth sentence',
      'A8. Narration, first sentence',
    ]);
    let expected = scriptNarration();
    for (const {was, now} of changes) {
      expect(expected).toContain(was);
      expected = expected.replace(was, now);
    }
    expect(NARRATION.map((s) => s.text).join(' ')).toBe(expected);
  });

  it('has the thirteen sentences of the six script paragraphs, in order', () => {
    expect(NARRATION.map((s) => s.id)).toEqual(
      Array.from({length: 13}, (_, i) => `s${String(i + 1).padStart(2, '0')}`),
    );
    expect(NARRATION.map((s) => s.paragraph)).toEqual([1, 1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 6]);
  });

  it('counts 146 words: 140 in the script, plus 4, 1 and 1 from the three amended sentences', () => {
    expect(TOTAL_WORDS).toBe(146);
    expect(wordCount('Learning did not follow.')).toBe(4);
  });

  it('addresses nobody: no second person and no "we" (register, rule 7)', () => {
    for (const {text} of NARRATION) {
      expect(text).not.toMatch(/\b(you|your|we|our|us)\b/i);
    }
  });

  it('dates the trial by its publication, not by a year it did not run in', () => {
    const s01 = NARRATION.find((s) => s.id === 's01')!.text;
    expect(s01).toContain('published in 2022');
    expect(s01).not.toMatch(/^In 2022/);
  });

  it('says of the null what the screen says of it', () => {
    const s04 = NARRATION.find((s) => s.id === 's04')!.text;
    expect(s04).toContain('no detectable difference');
    expect(s04).not.toMatch(/did not differ|no difference between|the same amount/);
  });
});
