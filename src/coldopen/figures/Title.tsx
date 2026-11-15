// The title and its subtitle, in layer H, which has no camera. Build spec,
// section 2.2 (H01, H02) and section 5, shot 5.
//
// Script, title: "The table dims. The title alone, in capitals: DEFICIT OF
// WHAT? Under it, small: Three hypotheses about ADHD, tested against their own
// predictions."

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE} from '../../kit/time';
import {Txt} from '../../kit/Txt';
import {SHOT, progress} from '../shots';
import {SUBTITLE, TITLE} from '../strings';

// ------------------------------------------------------------------ geometry

/** H01, H02. Both lines are centred on the canvas, where DEFICIT stood. */
const CENTRE_X = 960;
/**
 * H01. Baseline of the title. Its capitals are 90 px high, so their tops sit
 * on y 260, the cap line of the word DEFICIT it replaces. (The spec had 368.
 * It was raised so that the subtitle stands clear of the dimmed table.)
 */
const TITLE_BASELINE = 350;
/**
 * H01. Txt centres the title by its advance, tracking corrected. At 128 px the
 * side bearings of D (left) and "?" (right) differ, so the ink sat 2.0 px right
 * of 960 in the render (ink 529.4–1394.6). This puts the ink on the centre
 * line, where DEFICIT's ink stood. The subtitle's ink is within half a pixel
 * of 960 and needs no correction.
 */
const TITLE_INK_CORRECTION = -2;
/**
 * H02. Baseline of the subtitle. Its descenders end near y 413, which leaves
 * 43 px to the top rule of the dimmed table at y 456.
 */
const SUBTITLE_BASELINE = 406;

// ---------------------------------------------------------------- components

/**
 * The title and the subtitle. The title dissolves in only after DEFICIT has
 * gone, at the same place, and the subtitle follows it. Both hold to the last
 * frame: "No fade to black."
 */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const title = progress(frame, SHOT.title, EASE.dissolve);
  const subtitle = progress(frame, SHOT.subtitle, EASE.dissolve);
  return (
    <g>
      <Txt role="title" x={CENTRE_X + TITLE_INK_CORRECTION} y={TITLE_BASELINE} anchor="middle" opacity={title}>
        {TITLE}
      </Txt>
      <Txt role="subtitle" x={CENTRE_X} y={SUBTITLE_BASELINE} anchor="middle" opacity={subtitle}>
        {SUBTITLE}
      </Txt>
    </g>
  );
};
