import React from 'react';
import {PALETTE} from './theme';
import {BONE} from './type';
import {Txt} from './Txt';

/**
 * Script, "The look": "A figure marked DATA is drawn from values the paper
 * reports. A figure marked SCHEMATIC shows a design or a direction and has no
 * scale. Nothing is drawn that looks like data and is not."
 */
export type FigureKind = 'data' | 'schematic';

/**
 * The SCHEMATIC box is 126 by 28 so that 6 px dashes fit each side with
 * whole-pixel gaps: thirteen dashes and 4 px gaps across, three dashes and
 * 5 px gaps down. No dash then ends on a part of a pixel.
 */
const MARK = {
  data: {text: 'DATA', width: 69},
  schematic: {text: 'SCHEMATIC', width: 126},
} as const;

const HEIGHT = 28;
const STROKE = 2;
/** The dash of the SCHEMATIC box, and the gap it aims for between dashes. */
const DASH = {length: 6, gap: 4} as const;

type Props = {
  kind: FigureKind;
  /** Left edge of the box, in canvas px. */
  x: number;
  /** Top edge of the box, in canvas px. */
  y: number;
  opacity?: number;
};

/**
 * One side of the dashed box. The dashes are fitted to the side, so it starts
 * and ends on a whole dash and all four corners of the box are closed alike.
 */
const DashedSide: React.FC<{x1: number; y1: number; x2: number; y2: number}> = ({x1, y1, x2, y2}) => {
  const length = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  const dashes = Math.max(2, Math.round((length + DASH.gap) / (DASH.length + DASH.gap)));
  const gap = (length - dashes * DASH.length) / (dashes - 1);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={`${DASH.length} ${gap}`} />;
};

/**
 * The boxed mark at the top left of every figure. DATA has a solid box. The
 * box of SCHEMATIC is dashed, so the two differ in form as well as in word.
 * A mark arrives before its figure draws and leaves with it.
 */
export const FigureMark: React.FC<Props> = ({kind, x, y, opacity = 1}) => {
  if (opacity <= 0) return null;
  const {text, width} = MARK[kind];
  const half = STROKE / 2;
  return (
    <g opacity={opacity}>
      {kind === 'data' ? (
        <rect
          x={x + half}
          y={y + half}
          width={width - STROKE}
          height={HEIGHT - STROKE}
          fill="none"
          stroke={PALETTE.bone}
          strokeWidth={STROKE}
        />
      ) : (
        // Each side runs the full length of the box, so the sides overlap in
        // the corners and no corner is left notched. The strength is set on
        // the group, so a corner is no brighter than a dash.
        <g stroke={PALETTE.bone} opacity={BONE.b72} strokeWidth={STROKE}>
          <DashedSide x1={x} y1={y + half} x2={x + width} y2={y + half} />
          <DashedSide x1={x} y1={y + HEIGHT - half} x2={x + width} y2={y + HEIGHT - half} />
          <DashedSide x1={x + half} y1={y} x2={x + half} y2={y + HEIGHT} />
          <DashedSide x1={x + width - half} y1={y} x2={x + width - half} y2={y + HEIGHT} />
        </g>
      )}
      {/* The word stands in the middle of its box, with equal space on both sides. */}
      <Txt role="mark" x={x + width / 2} y={y + 21} anchor="middle">
        {text}
      </Txt>
    </g>
  );
};
