import React from 'react';
import {PALETTE} from './theme';
import {Txt} from './Txt';
import type {TypeRole, TypeRoleName} from './type';

/** The columns of a forest plot. Every row of one plot shares them. */
export type ForestAxis = {
  /** Left edge of the labels. */
  left: number;
  /** Right edge of the point estimates. */
  valueRight: number;
  /** Left edge of the intervals. */
  intervalLeft: number;
  /** The zero line. */
  zeroX: number;
  /** Px per unit of effect size. One linear scale for the whole plot. */
  pxPerUnit: number;
};

/** Where a value falls on the axis, on a whole pixel. */
export const forestX = (axis: ForestAxis, value: number): number => Math.round(axis.zeroX + value * axis.pxPerUnit);

/** The mark of a row: a square on the point estimate, and a whisker with two end caps. */
const MARK = {square: 12, whisker: 2, cap: 12} as const;

/** How far above the baseline the middle of the mark sits: the middle of the label's capitals. */
const MARK_RISE = 9;

type Props = {
  axis: ForestAxis;
  /** Baseline of the label, the estimate and the interval. */
  baseline: number;
  label: string;
  /** The point estimate as printed, or the size in a word where no number is shown. */
  value: string;
  /** The interval as printed, in square brackets. Empty where none is shown. */
  interval: string;
  /**
   * Estimate, lower bound and upper bound. Null draws no mark at all: where
   * no number was read from the paper, nothing is drawn on the axis.
   */
  drawn: readonly [number, number, number] | null;
  valueRole?: TypeRoleName | TypeRole;
  colour?: string;
  labelShown: number;
  /** How far the whisker has grown from the point estimate towards both bounds, 0 to 1. */
  markDrawn: number;
  /** The estimate and its interval arrive together: a number is never shown without its interval. */
  valueShown: number;
};

/**
 * One row of a forest plot: a label, the point estimate, its interval in
 * square brackets, and the same three numbers drawn on the plot's axis. The
 * picture is drawn from the numbers, and every edge lands on a whole pixel.
 */
export const ForestRow: React.FC<Props> = ({
  axis,
  baseline,
  label,
  value,
  interval,
  drawn,
  valueRole = 'estimate',
  colour = PALETTE.amber,
  labelShown,
  markDrawn,
  valueShown,
}) => {
  const centre = baseline - MARK_RISE;
  let mark: React.ReactNode = null;
  if (drawn && markDrawn > 0) {
    const [estimate, low, high] = drawn;
    const x = forestX(axis, estimate);
    const from = Math.round(x - (x - forestX(axis, low)) * markDrawn);
    const to = Math.round(x + (forestX(axis, high) - x) * markDrawn);
    const half = MARK.square / 2;
    mark = (
      <g fill={colour}>
        <rect x={from} y={centre - MARK.whisker / 2} width={to - from} height={MARK.whisker} />
        {markDrawn >= 1 ? (
          <>
            <rect x={from} y={centre - MARK.cap / 2} width={MARK.whisker} height={MARK.cap} />
            <rect x={to - MARK.whisker} y={centre - MARK.cap / 2} width={MARK.whisker} height={MARK.cap} />
          </>
        ) : null}
        <rect x={x - half} y={centre - half} width={MARK.square} height={MARK.square} />
      </g>
    );
  }
  return (
    <>
      <Txt role="rowLabel" x={axis.left} y={baseline} opacity={labelShown}>
        {label}
      </Txt>
      {mark}
      <Txt role={valueRole} x={axis.valueRight} y={baseline} anchor="end" fill={colour} opacity={valueShown}>
        {value}
      </Txt>
      {interval ? (
        <Txt role="interval" x={axis.intervalLeft} y={baseline} opacity={valueShown}>
          {interval}
        </Txt>
      ) : null}
    </>
  );
};
