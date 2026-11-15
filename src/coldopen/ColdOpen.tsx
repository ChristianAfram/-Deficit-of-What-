import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {progress} from '../kit/anim';
import '../kit/fonts';
import {Layer} from '../kit/Layer';
import {PALETTE} from '../kit/theme';
import {Furniture} from './Furniture';
import {SoundTrack} from './SoundTrack';
import {CrossoverDiagram} from './figures/CrossoverDiagram';
import {DeficitTable} from './figures/DeficitTable';
import {ResultRows} from './figures/ResultRows';
import {Title} from './figures/Title';
import {SHOT} from './shots';

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
 * The layer of the trial's figure: the crossover diagram and the result
 * rows. "Then the diagram recedes": the whole layer dissolves out.
 */
export const TrialFigureLayer: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return <Layer opacity={1 - progress(frame, SHOT.figureRecedes)}>{children}</Layer>;
};

/**
 * The cold open and the title, 0:00 to 1:17.
 *
 * Layers, bottom to top: the trial's figure, the word DEFICIT with the
 * evidence table, the title, and the furniture (citation band, footer,
 * captions).
 */
export const ColdOpen: React.FC<ColdOpenProps> = ({standalone, review, voice}) => (
  <AbsoluteFill style={{backgroundColor: PALETTE.ground}}>
    <TrialFigureLayer>
      <CrossoverDiagram />
      <ResultRows standalone={standalone} />
    </TrialFigureLayer>
    <Layer>
      <DeficitTable />
    </Layer>
    <Layer>
      <Title />
    </Layer>
    <Furniture review={review} />
    <SoundTrack standalone={standalone} voice={voice} />
  </AbsoluteFill>
);
