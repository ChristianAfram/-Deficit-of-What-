// Animations as data: a start frame and an end frame. A part's shot list is a
// table of these, each placed on a spoken word, and a figure reads its
// progress from the table. Keeping them as data is what lets a test check the
// whole shot list against the film's rules.

import {EASE, ramp} from './time';

/** An animation from frame `from` (progress 0) to frame `to` (progress 1). A cut has from === to. */
export type Anim = {from: number; to: number};

/** An animation that starts on a frame and lasts so many frames. */
export const starting = (from: number, frames: number): Anim => ({from, to: from + frames});

/** An animation that is complete on a frame, having lasted so many frames. */
export const ending = (to: number, frames: number): Anim => ({from: to - frames, to});

/** An instant change: hidden on the frame before, final on this frame. */
export const cutAt = (frame: number): Anim => ({from: frame, to: frame});

/** Progress of an animation at a frame, 0 to 1. A cut is 0 before its frame and 1 from it on. */
export const progress = (frame: number, anim: Anim, easing: (t: number) => number = EASE.dissolve): number =>
  anim.from === anim.to ? (frame >= anim.to ? 1 : 0) : ramp(frame, anim.from, anim.to - anim.from, easing);
