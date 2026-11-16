// Measures a line of text from the bundled font files, so that a test can
// hold a layout in place without rendering a frame: a cell line fits its
// cell, a label ends before the column beside it.

import {createRequire} from 'node:module';
import * as fontkit from 'fontkit';
import {FONT} from '../../src/kit/fonts';
import {TYPE, type TypeRole, type TypeRoleName} from '../../src/kit/type';

const require = createRequire(import.meta.url);

const FILE: Record<string, Record<number, string>> = {
  [FONT.condensed]: {
    500: '@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2',
    600: '@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',
  },
  [FONT.text]: {
    400: '@fontsource/inter/files/inter-latin-400-normal.woff2',
    500: '@fontsource/inter/files/inter-latin-500-normal.woff2',
    600: '@fontsource/inter/files/inter-latin-600-normal.woff2',
  },
};

const opened = new Map<string, fontkit.Font>();
const open = (family: string, weight: number): fontkit.Font => {
  const file = FILE[family]?.[weight];
  if (!file) throw new Error(`No bundled face for ${family} ${weight}`);
  if (!opened.has(file)) opened.set(file, fontkit.openSync(require.resolve(file)) as fontkit.Font);
  return opened.get(file)!;
};

/**
 * The advance width of a line in a type role, in canvas px. Tracking is added
 * after every glyph but the last, which is how the kit's Txt places a line.
 */
export const widthOf = (text: string, role: TypeRoleName | TypeRole): number => {
  const r = typeof role === 'string' ? TYPE[role] : role;
  const font = open(r.family, r.weight);
  const run = font.layout(text, r.tabular ? ['tnum', 'lnum'] : []);
  const advance = run.positions.reduce((sum, position) => sum + position.xAdvance, 0);
  return (advance / font.unitsPerEm) * r.size + r.tracking * r.size * Math.max(0, [...text].length - 1);
};
