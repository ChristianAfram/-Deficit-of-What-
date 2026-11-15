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

const MARK = {
  data: {text: 'DATA', width: 69},
  schematic: {text: 'SCHEMATIC', width: 129},
} as const;

const HEIGHT = 28;

type Props = {
  kind: FigureKind;
  /** Left edge of the box, in canvas px. */
  x: number;
  /** Top edge of the box, in canvas px. */
  y: number;
  opacity?: number;
};

/**
 * The boxed mark at the top left of every figure. DATA has a solid box. The
 * box of SCHEMATIC is dashed, so the two differ in form as well as in word.
 * A mark arrives before its figure draws and leaves with it.
 */
export const FigureMark: React.FC<Props> = ({kind, x, y, opacity = 1}) => {
  if (opacity <= 0) return null;
  const {text, width} = MARK[kind];
  const solid = kind === 'data';
  return (
    <g opacity={opacity}>
      <rect
        x={x + 0.75}
        y={y + 0.75}
        width={width - 1.5}
        height={HEIGHT - 1.5}
        fill="none"
        stroke={PALETTE.bone}
        strokeOpacity={solid ? BONE.b100 : BONE.b72}
        strokeWidth={1.5}
        strokeDasharray={solid ? undefined : '4 3'}
      />
      <Txt role="mark" x={x + 10} y={y + 21}>
        {text}
      </Txt>
    </g>
  );
};
