// Checks the still rule on rendered pixels: for every freeze window of a
// part, the first frame, a middle frame and the last frame of the window are
// rendered and compared pixel by pixel. They have to be identical.
//
//   node scripts/check-freeze.mjs part1
//
// It checks the film. The review build adds a frame counter, which changes on
// every frame by design, and captions, which tests/part1-still-rule.test.ts
// holds to the same rule from the cue tables.
//
// The windows are read from docs/cue-sheet-part-1.md, which is generated from
// the code and held in place by a test.

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PARTS = {part1: {sheet: 'cue-sheet-part-1.md', composition: 'Part1'}};
const [partName = 'part1'] = process.argv.slice(2);
const part = PARTS[partName];
if (!part) throw new Error(`Unknown part "${partName}". Known: ${Object.keys(PARTS).join(', ')}`);
const compositionId = part.composition;

// The "Freeze windows" table of the cue sheet: | phrase | from | to | seconds |
const sheet = readFileSync(join(root, 'docs', part.sheet), 'utf8').replace(/\r\n/g, '\n');
const section = sheet.slice(sheet.indexOf('## Freeze windows'), sheet.indexOf('## Shots'));
const windows = section
  .split('\n')
  .filter((line) => /^\| .+ \| \d+ \| \d+ \|/.test(line))
  .map((line) => {
    const [phrase, from, to] = line.split('|').slice(1).map((cell) => cell.trim());
    return {phrase, from: Number(from), to: Number(to)};
  });
if (windows.length === 0) throw new Error('No freeze window found in the cue sheet');

if (!existsSync(join(root, 'public', 'audio', 'room-tone.wav'))) {
  execFileSync(process.execPath, [join(root, 'scripts', 'make-audio.mjs')], {stdio: 'inherit'});
}

const serveUrl = await bundle({entryPoint: join(root, 'src', 'index.ts'), publicDir: join(root, 'public')});
const composition = await selectComposition({serveUrl, id: compositionId});
const outDir = join(root, 'out', 'freeze', compositionId);
mkdirSync(outDir, {recursive: true});

const render = async (frame) => {
  const output = join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({composition, serveUrl, frame, output, overwrite: true});
  // A PNG of the same pixels, written by the same encoder, is the same file.
  return readFileSync(output);
};

let failed = 0;
for (const {phrase, from, to} of windows) {
  // The window runs from its first frame to the frame before the first change is allowed.
  const frames = [from, Math.floor((from + to) / 2), to - 1];
  const [first, ...rest] = await Promise.all(frames.map(render));
  const same = rest.every((png) => png.equals(first));
  if (!same) failed++;
  console.log(`${same ? 'identical' : 'DIFFERENT'}  frames ${frames.join(', ')}  "${phrase}"`);
}
console.log(
  failed === 0
    ? `Still rule on pixels, ${compositionId}: PASS (${windows.length} of ${windows.length} windows identical)`
    : `Still rule on pixels, ${compositionId}: FAIL (${failed} of ${windows.length} windows change)`,
);
process.exit(failed === 0 ? 0 : 1);
