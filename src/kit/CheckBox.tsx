import React from 'react';
import {PALETTE} from './theme';
import {Txt} from './Txt';

/** The box: 28 px square, with a 2 px outline. */
export const CHECK_BOX = {size: 28, stroke: 2, gap: 16} as const;

type Props = {
  /** Top left corner of the box, in whole canvas px. */
  x: number;
  y: number;
  label: string;
  /** How far the box and its label have arrived, 0 to 1. */
  shown: number;
  /** True once the prediction has failed. A cut, not a fade. */
  failed: boolean;
};

/**
 * A test a hypothesis has to pass, as an empty box with its label. A failed
 * box is the one place besides the struck line where the film uses red
 * (script, "The look": "A failed prediction: red. The struck line and the
 * failed box. Nothing else."). The label keeps its colour.
 */
export const CheckBox: React.FC<Props> = ({x, y, label, shown, failed}) => {
  if (shown <= 0) return null;
  const {size, stroke, gap} = CHECK_BOX;
  const colour = failed ? PALETTE.red : PALETTE.bone;
  const inset = 7;
  return (
    <g opacity={shown}>
      <rect
        x={x + stroke / 2}
        y={y + stroke / 2}
        width={size - stroke}
        height={size - stroke}
        fill="none"
        stroke={colour}
        strokeWidth={stroke}
      />
      {failed ? (
        <g stroke={PALETTE.red} strokeWidth={3} strokeLinecap="square">
          <line x1={x + inset} y1={y + inset} x2={x + size - inset} y2={y + size - inset} />
          <line x1={x + size - inset} y1={y + inset} x2={x + inset} y2={y + size - inset} />
        </g>
      ) : null}
      <Txt role="rowLabel" x={x + size + gap} y={y + 23}>
        {label}
      </Txt>
    </g>
  );
};
