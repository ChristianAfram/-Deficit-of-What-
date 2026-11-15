// The two additions of a review build. A review build stands in for the
// voice, which is recorded only after the specialist review: it shows the
// narration as captions, and tells a reviewer which moment is on screen.

import React from 'react';
import {FONT} from './fonts';
import {BAND, BASELINE, LIVE} from './grid';
import {FPS} from './time';
import {GLYPH, PALETTE} from './theme';
import {TYPE} from './type';
import {Txt} from './Txt';

/** The narration being spoken, in the caption band. Up to two centred lines. */
export const Caption: React.FC<{children: string}> = ({children}) => {
  const role = TYPE.caption;
  return (
    <div
      style={{
        position: 'absolute',
        left: 240,
        width: 1440,
        top: BAND.caption[0],
        height: BAND.caption[1] - BAND.caption[0],
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        textAlign: 'center',
        color: PALETTE.bone,
        fontFamily: FONT.text,
        fontWeight: role.weight,
        fontSize: role.size,
        lineHeight: '40px',
        // Two lines of about equal length, not a full line and a short one.
        textWrap: 'balance',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Frames as minutes, seconds and frames. Colons throughout, so the frame
 * count cannot be read as a decimal fraction of a second.
 */
export const reviewTimecode = (frame: number): string => {
  const whole = Math.floor(frame / FPS);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${Math.floor(whole / 60)}:${pad(whole % 60)}:${pad(frame % FPS)}`;
};

/** What is on screen now, at the foot of the frame: what is being spoken, the frame, the timecode. */
export const ReviewOverlay: React.FC<{frame: number; speaking: string}> = ({frame, speaking}) => {
  const dot = ` ${GLYPH.middot} `;
  return (
    <Txt role="review" x={LIVE.left} y={BASELINE.footer}>
      {`REVIEW BUILD${dot}${speaking}${dot}f${String(frame).padStart(4, '0')}${dot}${reviewTimecode(frame)}`}
    </Txt>
  );
};
