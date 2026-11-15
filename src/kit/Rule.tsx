import React from 'react';
import {PALETTE} from './theme';

type Props = {
  /** Where the rule starts, in whole canvas px. A horizontal rule fills the pixel row `y`. */
  x: number;
  y: number;
  /** Length in px, along the rule. */
  length: number;
  direction?: 'across' | 'down';
  /** Thickness in whole px. A hairline is 1. */
  weight?: number;
  colour?: string;
  /** How much of the rule is drawn, from its start: 0 to 1. */
  drawn?: number;
  opacity?: number;
};

/**
 * A straight rule that lands on whole pixels. A 1 px line centred on a pixel
 * boundary is rendered as two rows at half strength, a soft grey that is not
 * in the palette. So a rule is placed by its top left corner and has a whole
 * thickness, and each of its pixels carries its full colour.
 */
export const Rule: React.FC<Props> = ({
  x,
  y,
  length,
  direction = 'across',
  weight = 1,
  colour = PALETTE.graphite,
  drawn = 1,
  opacity = 1,
}) => {
  if (drawn <= 0 || opacity <= 0) return null;
  const run = length * drawn;
  return direction === 'across' ? (
    <rect x={x} y={y} width={run} height={weight} fill={colour} opacity={opacity} />
  ) : (
    <rect x={x} y={y} width={weight} height={run} fill={colour} opacity={opacity} />
  );
};
