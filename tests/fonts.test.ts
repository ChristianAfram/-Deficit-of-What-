import {createRequire} from 'node:module';
import * as fontkit from 'fontkit';
import {describe, expect, it} from 'vitest';
import {GLYPH} from '../src/kit/theme';

const require = createRequire(import.meta.url);
const open = (file: string) => fontkit.openSync(require.resolve(file)) as fontkit.Font;

// The same files src/kit/fonts.ts loads.
const FACES = {
  'Barlow Condensed 500': '@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2',
  'Barlow Condensed 600': '@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',
  'Inter 400': '@fontsource/inter/files/inter-latin-400-normal.woff2',
  'Inter 500': '@fontsource/inter/files/inter-latin-500-normal.woff2',
  'Inter 600': '@fontsource/inter/files/inter-latin-600-normal.woff2',
};

/** Every character the film sets that is easy to lose to a fallback font. */
const REQUIRED = {
  'minus sign': GLYPH.minus,
  'en dash': GLYPH.enDash,
  'middle dot': GLYPH.middot,
  'multiplication sign': '×',
  'percent sign': '%',
  'plus sign': '+',
  'square brackets': '[]',
  'question mark': '?',
};

describe('the bundled typefaces', () => {
  it.each(Object.entries(FACES))('%s has every special character the film sets', (_name, file) => {
    const font = open(file);
    for (const [what, characters] of Object.entries(REQUIRED)) {
      for (const character of characters) {
        expect(font.hasGlyphForCodePoint(character.codePointAt(0)!), what).toBe(true);
      }
    }
  });

  it.each(['Inter 400', 'Inter 500', 'Inter 600'] as const)('%s sets tabular figures', (name) => {
    const font = open(FACES[name]);
    expect(font.availableFeatures).toContain('tnum');
    const advances = [...'0123456789'].map((digit) => font.layout(digit, ['tnum']).positions[0].xAdvance);
    expect(new Set(advances).size, `digit advances with tnum: ${advances.join(', ')}`).toBe(1);
  });

  it('keeps the minus sign distinct from the hyphen', () => {
    const font = open(FACES['Inter 400']);
    const glyph = (character: string) => font.glyphForCodePoint(character.codePointAt(0)!).id;
    expect(glyph(GLYPH.minus)).not.toBe(glyph('-'));
    expect(glyph(GLYPH.enDash)).not.toBe(glyph('-'));
  });
});
