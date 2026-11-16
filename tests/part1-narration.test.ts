import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {wordCount} from '../src/kit/cues';
import {NARRATION, TOTAL_WORDS} from '../src/part1/narration';

// A Windows checkout may hold the brief with CRLF line endings.
const brief = readFileSync(new URL('../docs/brief-part-1.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const unquote = (block: string): string =>
  block
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

/** The narration of each beat: the quoted lines between "Narration, word for word:" and "Picture.". */
const scriptNarration = (): Record<string, string> => {
  const fromTheScript = brief.slice(brief.indexOf('## From the script'), brief.indexOf('## Amendments'));
  const beats: Record<string, string> = {};
  for (const section of fromTheScript.split(/^### /m)) {
    const beat = /^\d:\d\d · (\d\.\d) /.exec(section)?.[1];
    if (!beat) continue;
    const from = section.indexOf('Narration, word for word:');
    const to = section.indexOf('\nPicture. ');
    expect(from, beat).toBeGreaterThan(-1);
    expect(to, beat).toBeGreaterThan(from);
    beats[beat] = unquote(
      section
        .slice(from, to)
        .split('\n')
        .filter((line) => line.startsWith('>'))
        .join('\n'),
    );
  }
  return beats;
};

/** The amended sentences: every "### P<n>. Narration, ..." section of the brief, as its Was and Now quotes. */
const amendments = (): {name: string; was: string; now: string}[] =>
  brief
    .split(/^### /m)
    .filter((section) => /^P\d+\. Narration/.test(section))
    .map((section) => {
      const quotes = section.split(/\n\n/).filter((block) => block.startsWith('>')).map(unquote);
      expect(quotes, section.slice(0, 40)).toHaveLength(2);
      return {name: section.slice(0, section.indexOf('\n')), was: quotes[0], now: quotes[1]};
    });

describe('narration of Part 0 and Part 1', () => {
  it('is the script, word for word, with exactly the three amended sentences', () => {
    const changes = amendments();
    expect(changes.map((c) => c.name)).toEqual([
      'P1. Narration, sentence p06',
      'P2. Narration, sentence p12',
      'P3. Narration, sentence p25',
    ]);
    const script = scriptNarration();
    expect(Object.keys(script)).toEqual(['0.1', '1.1', '1.2', '1.3', '1.4', '1.5']);
    for (const [beat, text] of Object.entries(script)) {
      let expected = text;
      for (const {was, now} of changes) expected = expected.replace(was, now);
      const built = NARRATION.filter((s) => s.beat === beat)
        .map((s) => s.text)
        .join(' ');
      expect(built, `beat ${beat}`).toBe(expected);
    }
    // Every amended sentence was in the script as the brief quotes it.
    const whole = Object.values(script).join(' ');
    for (const {was, name} of changes) expect(whole, name).toContain(was);
  });

  it('has the thirty-three sentences of the six beats, in order', () => {
    expect(NARRATION.map((s) => s.id)).toEqual(Array.from({length: 33}, (_, i) => `p${String(i + 1).padStart(2, '0')}`));
    expect(NARRATION.map((s) => s.beat).filter((beat, i, all) => beat !== all[i - 1])).toEqual([
      '0.1',
      '1.1',
      '1.2',
      '1.3',
      '1.4',
      '1.5',
    ]);
    // Paragraphs are counted through the part, and never run backwards.
    NARRATION.forEach((s, i) => {
      if (i > 0) expect(s.paragraph - NARRATION[i - 1].paragraph, s.id).toBeGreaterThanOrEqual(0);
    });
    expect(NARRATION[NARRATION.length - 1].paragraph).toBe(12);
  });

  it('counts 389 words: 385 in the script, plus 2 and 2 from the two re-dated sentences', () => {
    expect(TOTAL_WORDS).toBe(389);
    expect(wordCount('Visual memory did not.')).toBe(4);
  });

  it('addresses nobody: no second person and no "we" (register, rule 7)', () => {
    for (const {text} of NARRATION) {
      expect(text).not.toMatch(/\b(you|your|we|our|us)\b/i);
    }
  });

  it('dates a study by its publication, not by a year its work was not done in', () => {
    for (const {text} of NARRATION) expect(text, text).not.toMatch(/^In (19|20)\d\d,/);
    expect(NARRATION.find((s) => s.id === 'p06')!.text).toContain('published in 2017');
    expect(NARRATION.find((s) => s.id === 'p12')!.text).toContain('published in 2024');
  });

  it('counts the trials of cognitive training as the paper counts them', () => {
    const p25 = NARRATION.find((s) => s.id === 'p25')!.text;
    expect(p25).toContain('fifteen randomised trials');
    expect(NARRATION.map((s) => s.text).join(' ')).not.toMatch(/sixteen/);
  });

  it('keeps the status line at its strength', () => {
    const status = NARRATION.filter((s) => s.beat === '1.5')
      .map((s) => s.text)
      .join(' ');
    expect(status).toContain('Memory is involved');
    expect(status).toContain('As the defining deficit it is not supported.');
    // "Not supported as the defining deficit" must not turn into "memory is fine".
    expect(status).not.toMatch(/memory is (fine|normal|intact|unaffected)/i);
  });
});
