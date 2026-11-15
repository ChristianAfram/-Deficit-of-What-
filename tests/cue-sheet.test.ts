import {existsSync} from 'node:fs';
import {expect, it} from 'vitest';
import {CAPTIONS} from '../src/coldopen/captions';
import {DURATION, PAUSE, SPEECH, TITLE_START, cueWords} from '../src/coldopen/cues';
import {NARRATION, TOTAL_WORDS, wordCount} from '../src/coldopen/narration';
import {FREEZE, SHOT, SOUND} from '../src/coldopen/shots';
import {FPS} from '../src/kit/time';

// The cue sheet as a document, written from the code. docs/cue-sheet.md is a
// snapshot of it: this test fails when the timing changes and the document
// has not been regenerated. Regenerate it with: npx vitest run -u

const seconds = (frame: number): string => (frame / FPS).toFixed(2);
const clock = (frame: number): string => {
  const total = frame / FPS;
  return `${Math.floor(total / 60)}:${(total % 60).toFixed(2).padStart(5, '0')}`;
};
const row = (cells: (string | number)[]): string => `| ${cells.join(' | ')} |`;
const table = (head: string[], rows: (string | number)[][]): string =>
  [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');

const cueSheet = (): string => {
  const speaking = Object.values(SPEECH).reduce((sum, {start, end}) => sum + end - start, 0);
  const span = SPEECH.s13.end - SPEECH.s01.start;
  return [
    '# Cue sheet: cold open and title',
    '',
    'Generated from `src/coldopen/cues.ts` and `src/coldopen/shots.ts` by',
    '`tests/cue-sheet.test.ts`. Do not edit it by hand. After a change of timing,',
    'regenerate it with `npx vitest run -u`.',
    '',
    `Frames are counted from 0 at ${FPS} frames a second. The film is ${DURATION} frames`,
    `(${seconds(DURATION)} s). The title beat starts on frame ${TITLE_START} (${clock(TITLE_START)}).`,
    '',
    'There is no recorded voice yet. Sentence times are a paced estimate, and a',
    "word's start is estimated from its place in its sentence.",
    '',
    '## Pacing',
    '',
    `- ${TOTAL_WORDS} words, spoken in ${seconds(speaking)} s: ${((TOTAL_WORDS / speaking) * FPS * 60).toFixed(1)} words a minute.`,
    `- From the first word to the last, with the written pause: ${seconds(span)} s. The script's target is 66 to 72 s.`,
    `- "Learning did not follow." starts at ${clock(SPEECH.s06.start)}. The script's ledger has 0:45.`,
    '',
    '## Narration',
    '',
    table(
      ['Id', 'Sentence', 'Words', 'Start', 'End', 'From', 'To'],
      NARRATION.flatMap(({id, text}) => {
        const {start, end} = SPEECH[id];
        const line = [id, text, wordCount(text), start, end, clock(start), clock(end)];
        return id === 's04'
          ? [line, ['', '*(pause, 2 seconds)*', '', PAUSE.start, PAUSE.end, clock(PAUSE.start), clock(PAUSE.end)]]
          : [line];
      }),
    ),
    '',
    '## Freeze windows',
    '',
    'While a number is being spoken, nothing on screen changes.',
    '',
    table(
      ['Spoken', 'From', 'To', 'Seconds'],
      Object.values(FREEZE).map(({phrase, f0, f1}) => [phrase, f0, f1, `${seconds(f0)} to ${seconds(f1)}`]),
    ),
    '',
    '## Shots',
    '',
    'A shot whose two frames are equal is a cut.',
    '',
    table(
      ['Shot', 'From', 'To', 'Seconds'],
      Object.entries(SHOT).map(([name, {from, to}]) => [
        name,
        from,
        to,
        from === to ? `cut at ${seconds(from)}` : `${seconds(from)} to ${seconds(to)}`,
      ]),
    ),
    '',
    '## Sound',
    '',
    table(
      ['Sound', 'Frames'],
      [
        ['Room tone', `0 to ${DURATION - 1}, looped`],
        ['Tick, one per row of data', SOUND.ticks.join(', ')],
        ['Low note', `from ${SOUND.lowNote.from}, fading out ${SOUND.lowNote.fadeOut.from} to ${SOUND.lowNote.fadeOut.to}`],
        ['Pulse', SOUND.pulse.at.join(', ')],
        ['String line', `from ${SOUND.string.from}`],
        ['Fade, when the cold open ships alone', `${SOUND.standaloneFade.from} to ${SOUND.standaloneFade.to}`],
      ],
    ),
    '',
    '## Words a cue is placed on',
    '',
    'When the voice is recorded, the start of each of these words is measured',
    'and entered in `WORD_ONSETS` in `src/coldopen/cues.ts`, under exactly this key.',
    '',
    ...cueWords().map((word) => `- ${word}`),
    '',
    '## Captions of the review build',
    '',
    table(
      ['From', 'To', 'Caption'],
      CAPTIONS.map(({start, end, text}) => [start, end, text]),
    ),
    '',
  ].join('\n');
};

it('docs/cue-sheet.md is the cue sheet the code produces', async () => {
  // Without this, a deleted document would be written again and the test would pass.
  expect(existsSync(new URL('../docs/cue-sheet.md', import.meta.url)), 'docs/cue-sheet.md is missing').toBe(true);
  await expect(cueSheet()).toMatchFileSnapshot('../docs/cue-sheet.md');
});
