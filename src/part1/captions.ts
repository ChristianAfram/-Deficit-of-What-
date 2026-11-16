// The captions of the review build: which words are on screen when.

import type {Span} from '../kit/cues';
import {SPEECH} from './cues';
import {NARRATION} from './narration';

export type CaptionChunk = Span & {text: string};

/**
 * Each caption is on exactly while its sentence is spoken. No sentence of
 * this part is longer than two lines, so a caption changes only at a
 * sentence boundary, and never while a number is being spoken.
 */
export const CAPTIONS: readonly CaptionChunk[] = NARRATION.map(({id, text}) => ({...SPEECH[id], text}));

export const captionAt = (frame: number): CaptionChunk | undefined =>
  CAPTIONS.find((chunk) => frame >= chunk.start && frame < chunk.end);
