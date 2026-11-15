// Renders still frames of a composition, for checking the picture against the
// script without rendering the whole film. Bundles once, then renders each frame.
//
//   node scripts/render-stills.mjs                            ColdOpen, one frame every 2 s
//   node scripts/render-stills.mjs ColdOpenReview every=24     one frame a second
//   node scripts/render-stills.mjs ColdOpen "610,733,897"      these frames
//   node scripts/render-stills.mjs ColdOpen "610,733" out/check  into another folder
//
// Quote a list of frames: PowerShell reads a bare 610,733 as two arguments.
// A third argument sets the output folder (default: out/stills/<composition>).
//
// Options. None of them needs quoting in any shell:
//   --standalone=false                  an input prop of the composition. Any
//                                       --name=value other than --entry is
//                                       passed as a prop: true, false and
//                                       numbers are read as such
//   --entry=src/preview/entry-rows.tsx  another entry point, for checking one
//                                       figure on its own (its composition is
//                                       called Preview)

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const options = Object.fromEntries(
  args
    .filter((arg) => arg.startsWith('--') && arg.includes('='))
    .map((arg) => [arg.slice(2, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)]),
);
const [compositionId = 'ColdOpen', frameSpec = 'every=48', outArg] = args.filter((arg) => !arg.startsWith('--'));

const {entry, ...propOptions} = options;
const read = (value) =>
  value === 'true' ? true : value === 'false' ? false : value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
const inputProps = Object.fromEntries(Object.entries(propOptions).map(([name, value]) => [name, read(value)]));
const entryPoint = resolve(root, entry ?? join('src', 'index.ts'));

// The sound stems are build products. A composition that plays them needs them to exist.
if (!existsSync(join(root, 'public', 'audio', 'room-tone.wav'))) {
  execFileSync(process.execPath, [join(root, 'scripts', 'make-audio.mjs')], {stdio: 'inherit'});
}

const serveUrl = await bundle({entryPoint, publicDir: join(root, 'public')});
const composition = await selectComposition({serveUrl, id: compositionId, inputProps});

const last = composition.durationInFrames - 1;
const frames = frameSpec.startsWith('every=')
  ? Array.from(
      {length: Math.floor(last / Number(frameSpec.slice(6))) + 1},
      (_, i) => i * Number(frameSpec.slice(6)),
    ).concat(last)
  : frameSpec.split(',').map((f) => Math.min(last, Number(f)));

const outDir = resolve(root, outArg ?? join('out', 'stills', compositionId));
mkdirSync(outDir, {recursive: true});

for (const frame of [...new Set(frames)]) {
  const output = join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({composition, serveUrl, frame, output, inputProps, overwrite: true});
  console.log(output);
}
