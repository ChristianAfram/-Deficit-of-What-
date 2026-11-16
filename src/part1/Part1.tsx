import React from 'react';
import {AbsoluteFill} from 'remotion';
import '../kit/fonts';
import {Layer} from '../kit/Layer';
import {PALETTE} from '../kit/theme';
import {Furniture} from './Furniture';
import {SoundTrack} from './SoundTrack';
import {ForestFigure} from './figures/ForestFigure';
import {Heritability, OverlapCurves} from './figures/Scope';
import {StageLine} from './figures/StageLine';
import {StatusTable} from './figures/StatusTable';

export type Part1Props = {
  /**
   * True when the part ships as a film of its own (script, "Cuts and slices":
   * "Part 1, memory. Open it with beat 0.1."). It then fades its sound out
   * under the held table. The joined film passes false.
   */
  standalone: boolean;
  /** The review build: narration as captions, and a frame counter. */
  review: boolean;
  /** The recorded narration, as a file under public/. Null until it exists. */
  voice: string | null;
};

/**
 * Part 0 and Part 1: beats 0.1 to 1.5, 1:17 to 4:33 of the joined film.
 *
 * Layers, bottom to top: the figures of each beat, each on a layer of its
 * own, then the furniture (citation band, footer, captions). No layer is
 * scaled: every element sits on its coordinates on every frame.
 */
export const Part1: React.FC<Part1Props> = ({standalone, review, voice}) => (
  <AbsoluteFill style={{backgroundColor: PALETTE.ground}}>
    <Layer>
      <Heritability />
      <OverlapCurves />
    </Layer>
    <Layer>
      <StageLine />
    </Layer>
    <Layer>
      <StatusTable />
    </Layer>
    <Layer>
      <ForestFigure />
    </Layer>
    <Furniture review={review} />
    <SoundTrack standalone={standalone} voice={voice} />
  </AbsoluteFill>
);
