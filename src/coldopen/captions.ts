// The captions of the review build: which words are on screen when.

import {SPEECH, atWord, type Span} from './cues';
import {NARRATION, type SentenceId} from './narration';
import {FREEZE} from './shots';

export type CaptionChunk = Span & {text: string};

/**
 * A long sentence is shown in two parts, split at a spoken comma. The second
 * part starts on `frame`.
 */
const splitAt = (id: SentenceId, word: string, frame: number): CaptionChunk[] => {
  const text = NARRATION.find((s) => s.id === id)!.text;
  const index = text.indexOf(word);
  if (index < 0) throw new Error(`"${word}" is not in ${id}`);
  return [
    {start: SPEECH[id].start, end: frame, text: text.slice(0, index).trim()},
    {start: frame, end: SPEECH[id].end, text: text.slice(index)},
  ];
};

/**
 * Each caption is on exactly while its words are spoken. A caption changes at
 * a sentence boundary or at one of the two splits below, and never while a
 * number is being spoken: the first split waits for the freeze on the second
 * "three weeks" to end.
 */
export const CAPTIONS: readonly CaptionChunk[] = NARRATION.flatMap(({id, text}): CaptionChunk[] => {
  if (id === 's02') return splitAt(id, 'in randomised', Math.max(FREEZE.weeks2.f1, atWord('s02', 'in randomised')));
  if (id === 's03') return splitAt(id, 'and committed', atWord('s03', 'and committed'));
  return [{...SPEECH[id], text}];
});

export const captionAt = (frame: number): CaptionChunk | undefined =>
  CAPTIONS.find((chunk) => frame >= chunk.start && frame < chunk.end);
