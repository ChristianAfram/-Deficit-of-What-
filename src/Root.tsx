import React from 'react';
import {Composition} from 'remotion';
import {ColdOpen, type ColdOpenProps} from './coldopen/ColdOpen';
import {DURATION} from './coldopen/cues';
import {Part1, type Part1Props} from './part1/Part1';
import {DURATION as PART1_DURATION} from './part1/cues';
import {CANVAS} from './kit/theme';

const shared = {
  component: ColdOpen,
  durationInFrames: DURATION,
  fps: CANVAS.fps,
  width: CANVAS.width,
  height: CANVAS.height,
} as const;

const clean: ColdOpenProps = {standalone: true, review: false, voice: null};

const part1 = {
  component: Part1,
  durationInFrames: PART1_DURATION,
  fps: CANVAS.fps,
  width: CANVAS.width,
  height: CANVAS.height,
} as const;

const part1Clean: Part1Props = {standalone: true, review: false, voice: null};

export const Root: React.FC = () => (
  <>
    {/* The film: no captions, no counters. */}
    <Composition id="ColdOpen" {...shared} defaultProps={clean} />
    {/* For review before the voice is recorded: narration as captions, and a frame counter. */}
    <Composition id="ColdOpenReview" {...shared} defaultProps={{...clean, review: true}} />
    {/* Part 0 and Part 1, beats 0.1 to 1.5: as a film of its own, and for review. */}
    <Composition id="Part1" {...part1} defaultProps={part1Clean} />
    <Composition id="Part1Review" {...part1} defaultProps={{...part1Clean, review: true}} />
  </>
);
