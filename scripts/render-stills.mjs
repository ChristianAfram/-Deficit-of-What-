// Renders still frames of a composition, for checking the picture against the
// script without rendering the whole film. Bundles once, then renders each frame.
//
//   node scripts/render-stills.mjs                         ColdOpen, one frame every 2 s
//   node scripts/render-stills.mjs ColdOpenReview every=24  one frame a second
//   node scripts/render-stills.mjs ColdOpen 0,480,1728      these frames
//   node scripts/render-stills.mjs ColdOpen 0,480 out/check  into another folder
//
// A third argument sets the output folder (default: out/stills/<composition>).
// PROPS='{"standalone":false}' passes input props to the composition.
// ENTRY=src/preview/entry-rows.tsx renders from another entry point, for
// checking one figure on its own (its composition is called Preview).

import {mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [compositionId = 'ColdOpen', frameSpec = 'every=48', outArg] = process.argv.slice(2);
const inputProps = process.env.PROPS ? JSON.parse(process.env.PROPS) : {};

const serveUrl = await bundle({
  entryPoint: resolve(root, process.env.ENTRY ?? join('src', 'index.ts')),
  publicDir: join(root, 'public'),
});
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
