import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../kit/fonts';
import {Layer} from '../kit/Layer';
import {PALETTE} from '../kit/theme';
import {Furniture} from './Furniture';
import {SoundTrack} from './SoundTrack';
import {CrossoverDiagram} from './figures/CrossoverDiagram';
import {DeficitTable} from './figures/DeficitTable';
import {ResultRows} from './figures/ResultRows';
import {Title} from './figures/Title';
import {BAND} from './layout';
import {CAMERA, SHOT, cameraAt, progress} from './shots';

export type ColdOpenProps = {
  /**
   * True when the cold open ships as a film of its own (it is also the
   * trailer). It then states the trial's limits on screen and fades its sound
   * out under the held title. The joined film passes false.
   */
  standalone: boolean;
  /** The review build: narration as captions, and a frame counter. */
  review: boolean;
  /** The recorded narration, as a file under public/. Null until it exists. */
  voice: string | null;
};

/**
 * The cold open and the title, 0:00 to 1:17.
 *
 * Layers, bottom to top: the trial figure (diagram and result rows) with its
 * own camera, the word DEFICIT and the evidence table with theirs, the title,
 * and the furniture (citation band, footer, captions), which never moves.
 */
export const ColdOpen: React.FC<ColdOpenProps> = ({standalone, review, voice}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.ground}}>
      <Layer
        camera={cameraAt(frame, CAMERA.figure)}
        opacity={1 - progress(frame, SHOT.figureRecedes)}
        clipRows={BAND.content}
      >
        <CrossoverDiagram />
        <ResultRows standalone={standalone} />
      </Layer>
      <Layer camera={cameraAt(frame, CAMERA.table)} clipRows={BAND.content}>
        <DeficitTable />
      </Layer>
      <Layer>
        <Title />
      </Layer>
      <Furniture review={review} />
      <SoundTrack standalone={standalone} voice={voice} />
    </AbsoluteFill>
  );
};
