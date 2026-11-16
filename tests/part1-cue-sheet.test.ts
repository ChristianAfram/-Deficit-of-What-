import {existsSync} from 'node:fs';
import {expect, it} from 'vitest';
import {wordCount} from '../src/kit/cues';
import {FPS} from '../src/kit/time';
import {CAPTIONS} from '../src/part1/captions';
import {BEATS, BEAT_PACE, DURATION, FILM_START, SPEECH, cueWords} from '../src/part1/cues';
import {NARRATION, TOTAL_WORDS} from '../src/part1/narration';
import {BANDS, FREEZE, SHOT, SOUND} from '../src/part1/shots';

// The cue sheet as a document, written from the code. docs/cue-sheet-part-1.md
// is a snapshot of it: this test fails when the timing changes and the
// document has not been regenerated. Regenerate it with: npx vitest run -u

const seconds = (frame: number): string => (frame / FPS).toFixed(2);
const clockOf = (total: number): string => `${Math.floor(total / 60)}:${(total % 60).toFixed(2).padStart(5, '0')}`;
/** Time from the start of this part. */
const clock = (frame: number): string => clockOf(frame / FPS);
/** Time in the joined film, where this part starts at 1:17. */
const filmClock = (frame: number): string => clockOf((frame + FILM_START) / FPS);
const row = (cells: (string | number)[]): string => `| ${cells.join(' | ')} |`;
const table = (head: string[], rows: (string | number)[][]): string =>
  [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');

const cueSheet = (): string => {
  const speaking = Object.values(SPEECH).reduce((sum, {start, end}) => sum + end - start, 0);
  return [
    '# Cue sheet: Part 0 and Part 1',
    '',
    'Generated from `src/part1/cues.ts` and `src/part1/shots.ts` by',
    '`tests/part1-cue-sheet.test.ts`. Do not edit it by hand. After a change of',
    'timing, regenerate it with `npx vitest run -u`.',
    '',
    `Frames are counted from 0 at ${FPS} frames a second, from the first frame of this`,
    `part. The part is ${DURATION} frames (${seconds(DURATION)} s). In the joined film it runs from`,
    `${filmClock(0)} to ${filmClock(DURATION)}.`,
    '',
    'There is no recorded voice yet. Sentence times are a paced estimate, and a',
    "word's start is estimated from its place in its sentence.",
    '',
    '## Pacing',
    '',
    `- ${TOTAL_WORDS} words, spoken in ${seconds(speaking)} s: ${((TOTAL_WORDS / speaking) * FPS * 60).toFixed(1)} written words a minute. The script's pace is 138.`,
    '- Every beat starts where the script starts it. What is left of a beat after its last sentence is a hold.',
    '',
    table(
      ['Beat', 'From', 'To', 'In the film', 'Spoken words a minute', 'Hold after the last sentence'],
      BEATS.map(({id, start, end}) => {
        const last = NARRATION.filter((s) => s.beat === id).pop()!;
        return [id, start, end, `${filmClock(start)} to ${filmClock(end)}`, BEAT_PACE[id].toFixed(1), `${seconds(end - SPEECH[last.id].end)} s`];
      }),
    ),
    '',
    '## Narration',
    '',
    table(
      ['Id', 'Beat', 'Sentence', 'Words', 'Start', 'End', 'From', 'To', 'In the film'],
      NARRATION.map(({id, beat, text}) => {
        const {start, end} = SPEECH[id];
        return [id, beat, text, wordCount(text), start, end, clock(start), clock(end), filmClock(start)];
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
    '## Citation band',
    '',
    'One study at a time. A band is complete on "Tag to" and has left on "Gone".',
    '',
    table(
      ['Study', 'Citation from', 'Tag to', 'Leaves from', 'Gone'],
      BANDS.map(({study, cite, tag, leaves}) => [study, cite.from, tag.to, leaves.from, leaves.to]),
    ),
    '',
    '## Sound',
    '',
    table(
      ['Sound', 'Frames'],
      [
        ['Room tone', `0 to ${DURATION - 1}, looped`],
        ['Pulse', `every ${SOUND.pulse.at[1] - SOUND.pulse.at[0]} frames, from ${SOUND.pulse.at[0]} to ${SOUND.pulse.at[SOUND.pulse.at.length - 1]}`],
        ['Tick: the cell, each marker, each row of data', SOUND.ticks.join(', ')],
        ['Lower tick: each failed box', SOUND.lowTicks.join(', ')],
        ['String line, first step: a note bowed at', SOUND.string.step0.join(', ')],
        ['String line, one step on, from the status line: a note bowed at', SOUND.string.step1.join(', ')],
        ['Fade, when the part ships alone', `${SOUND.standaloneFade.from} to ${SOUND.standaloneFade.to}`],
      ],
    ),
    '',
    '## Words a cue is placed on',
    '',
    'When the voice is recorded, the start of each of these words is measured',
    'and entered in `WORD_ONSETS` in `src/part1/cues.ts`, under exactly this key.',
    'A key of the form "a > b" is the start of the word b that follows the phrase',
    'a: the frame on which a spoken number is over.',
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

it('docs/cue-sheet-part-1.md is the cue sheet the code produces', async () => {
  // Without this, a deleted document would be written again and the test would pass.
  expect(existsSync(new URL('../docs/cue-sheet-part-1.md', import.meta.url)), 'docs/cue-sheet-part-1.md is missing').toBe(true);
  await expect(cueSheet()).toMatchFileSnapshot('../docs/cue-sheet-part-1.md');
});
