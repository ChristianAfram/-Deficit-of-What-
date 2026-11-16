import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile, useCurrentFrame} from 'remotion';
import {progress} from '../kit/anim';
import {EASE} from '../kit/time';
import {SOUND} from './shots';

type Props = {
  /** Fades the sound out under the held table, for the part as a film of its own. */
  standalone: boolean;
  /** The recorded narration, as a file under public/. None exists until after the specialist review. */
  voice: string | null;
};

/**
 * The sound of Part 0 and Part 1, placed on the same cues as the picture.
 * The stems are synthesised by scripts/make-audio.mjs.
 */
export const SoundTrack: React.FC<Props> = ({standalone, voice}) => {
  const frame = useCurrentFrame();
  const master = standalone ? 1 - progress(frame, SOUND.standaloneFade, EASE.linear) : 1;
  const {roomTone, pulse, string} = SOUND;
  return (
    <>
      {/* The silences are room tone, not digital zero, which would read as a dropout. */}
      <Audio
        src={staticFile('audio/room-tone.wav')}
        loop
        volume={roomTone.gain * progress(frame, roomTone.fadeIn, EASE.linear) * master}
      />
      {pulse.at.map((at) => (
        <Audio key={at} src={staticFile('audio/pulse.wav')} from={at} volume={pulse.gain * master} />
      ))}
      {SOUND.ticks.map((at) => (
        <Audio key={at} src={staticFile('audio/tick.wav')} from={at} volume={SOUND.tickGain * master} />
      ))}
      {SOUND.lowTicks.map((at) => (
        <Audio key={at} src={staticFile('audio/tick-low.wav')} from={at} volume={SOUND.lowTickGain * master} />
      ))}
      {string.step0.map((at) => (
        <Audio key={at} src={staticFile('audio/string-step0.wav')} from={at} volume={string.gain * master} />
      ))}
      {string.step1.map((at) => (
        <Audio key={at} src={staticFile('audio/string-step1.wav')} from={at} volume={string.gain * master} />
      ))}
      {voice ? <Audio src={staticFile(voice)} /> : null}
    </>
  );
};
