// A composition that shows one figure on its own, with the furniture and the
// review overlay, at the film's own timing. For building and checking a
// figure without the others. Not part of the film.

import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import '../kit/fonts';
import {Layer} from '../kit/Layer';
import {CANVAS, PALETTE} from '../kit/theme';
import {TrialFigureLayer} from '../coldopen/ColdOpen';
import {Furniture} from '../coldopen/Furniture';
import {DURATION} from '../coldopen/cues';

/** 'figure' gives the figure the layer of the trial's figure, which dissolves out. 'plain' gives it a layer of its own. */
type Kind = 'figure' | 'plain';

const Stage: React.FC<{kind: Kind; children: React.ReactNode}> = ({kind, children}) => (
  <AbsoluteFill style={{backgroundColor: PALETTE.ground}}>
    {kind === 'figure' ? <TrialFigureLayer>{children}</TrialFigureLayer> : <Layer>{children}</Layer>}
    <Furniture review />
  </AbsoluteFill>
);

/** The root of a preview entry point: one composition, called Preview. */
export const previewOf = (kind: Kind, figure: React.ReactNode): React.FC => {
  const Figure: React.FC = () => <Stage kind={kind}>{figure}</Stage>;
  const PreviewRoot: React.FC = () => (
    <Composition
      id="Preview"
      component={Figure}
      durationInFrames={DURATION}
      fps={CANVAS.fps}
      width={CANVAS.width}
      height={CANVAS.height}
    />
  );
  return PreviewRoot;
};
