// A composition that shows one figure on its own, with the furniture and the
// review overlay, at the film's own timing. For building and checking a
// figure without the others. Not part of the film.

import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame} from 'remotion';
import '../kit/fonts';
import {Layer} from '../kit/Layer';
import {CANVAS, PALETTE} from '../kit/theme';
import {Furniture} from '../coldopen/Furniture';
import {DURATION} from '../coldopen/cues';
import {BAND} from '../coldopen/layout';
import {CAMERA, SHOT, cameraAt, progress} from '../coldopen/shots';

type Kind = 'figure' | 'table' | 'title';

const Stage: React.FC<{kind: Kind; children: React.ReactNode}> = ({kind, children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.ground}}>
      {kind === 'figure' ? (
        <Layer
          camera={cameraAt(frame, CAMERA.figure)}
          opacity={1 - progress(frame, SHOT.figureRecedes)}
          clipRows={BAND.content}
        >
          {children}
        </Layer>
      ) : kind === 'table' ? (
        <Layer camera={cameraAt(frame, CAMERA.table)} clipRows={BAND.content}>
          {children}
        </Layer>
      ) : (
        <Layer>{children}</Layer>
      )}
      <Furniture review />
    </AbsoluteFill>
  );
};

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
