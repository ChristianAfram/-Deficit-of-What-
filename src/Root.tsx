import React from 'react';
import {Composition} from 'remotion';
import {ColdOpen, type ColdOpenProps} from './coldopen/ColdOpen';
import {DURATION} from './coldopen/cues';
import {CANVAS} from './kit/theme';

const shared = {
  component: ColdOpen,
  durationInFrames: DURATION,
  fps: CANVAS.fps,
  width: CANVAS.width,
  height: CANVAS.height,
} as const;

const clean: ColdOpenProps = {standalone: true, review: false, voice: null};

export const Root: React.FC = () => (
  <>
    {/* The film: no captions, no counters. */}
    <Composition id="ColdOpen" {...shared} defaultProps={clean} />
    {/* For review before the voice is recorded: narration as captions, and a frame counter. */}
    <Composition id="ColdOpenReview" {...shared} defaultProps={{...clean, review: true}} />
  </>
);
