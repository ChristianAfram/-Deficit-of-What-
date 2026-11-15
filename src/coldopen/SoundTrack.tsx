import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile, useCurrentFrame} from 'remotion';
import {EASE} from '../kit/time';
import {DURATION} from './cues';
import {SOUND, progress} from './shots';

type Props = {
  /** Fades the sound out under the held title, for the cold open as a film of its own. */
  standalone: boolean;
  /** The recorded narration, as a file under public/. None exists until after the specialist review. */
  voice: string | null;
};

/**
 * The sound of the cold open, placed on the same cues as the picture. The
 * stems are synthesised by scripts/make-audio.mjs.
 */
export const SoundTrack: React.FC<Props> = ({standalone, voice}) => {
  const frame = useCurrentFrame();
  const master = standalone ? 1 - progress(frame, SOUND.standaloneFade, EASE.linear) : 1;
  const {roomTone, lowNote, pulse, string} = SOUND;
  return (
    <>
      {/* The silences are room tone, not digital zero, which would read as a dropout. */}
      <Audio
        src={staticFile('audio/room-tone.wav')}
        loop
        volume={roomTone.gain * progress(frame, roomTone.fadeIn, EASE.linear) * master}
      />
      {SOUND.ticks.map((at) => (
        <Audio key={at} src={staticFile('audio/tick.wav')} from={at} volume={SOUND.tickGain * master} />
      ))}
      <Audio
        src={staticFile('audio/low-note.wav')}
        from={lowNote.from}
        durationInFrames={lowNote.fadeOut.to - lowNote.from}
        volume={lowNote.gain * (1 - progress(frame, lowNote.fadeOut, EASE.linear)) * master}
      />
      {pulse.at.map((at) => (
        <Audio key={at} src={staticFile('audio/pulse.wav')} from={at} volume={pulse.gain * master} />
      ))}
      <Audio
        src={staticFile('audio/string-step0.wav')}
        from={string.from}
        durationInFrames={DURATION - string.from}
        volume={string.gain * master}
      />
      {voice ? <Audio src={staticFile(voice)} /> : null}
    </>
  );
};
