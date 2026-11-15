import React from 'react';
import {PALETTE} from './theme';
import {Txt} from './Txt';
import type {TypeRole, TypeRoleName} from './type';

export type BarRowGeometry = {
  /** Left edge of the label and of the note. */
  left: number;
  /** Right edge of the value column. */
  valueRight: number;
  /** The zero line the bar grows from. */
  zeroX: number;
  /** Px per unit of `amount`. The scale is not printed: the value carries the number. */
  pxPerUnit: number;
  /** Baseline shared by the label and the value. */
  baseline: number;
  /** Baseline of the note under the row. */
  noteBaseline: number;
  /** Top and height of the bar. */
  barTop: number;
  barHeight: number;
};

type Props = {
  geometry: BarRowGeometry;
  label: string;
  value: string;
  /** Where it was measured, and the statistic the source reports for it. */
  note: string;
  /**
   * The number the bar is drawn from. Positive grows to the right of the zero
   * line, negative to the left. Null draws no bar at all: where nothing was
   * estimated, nothing is drawn, not even a mark at zero.
   */
  amount: number | null;
  /** The role of the value: a number, or a result given in words. */
  valueRole: TypeRoleName | TypeRole;
  /** Nudges the value right, in px, to align its ink where a glyph has side bearing. */
  valueInk?: number;
  colour?: string;
  labelShown: number;
  barDrawn: number;
  /** The value and its note arrive together: a number is never shown without its interval. */
  valueShown: number;
};

/**
 * One row of a data figure: a label, a bar from a zero line, the value and a
 * note. The picture is drawn from the number: the bar's length is the amount
 * times the figure's one linear scale.
 */
export const BarRow: React.FC<Props> = ({
  geometry,
  label,
  value,
  note,
  amount,
  valueRole,
  valueInk = 0,
  colour = PALETTE.amber,
  labelShown,
  barDrawn,
  valueShown,
}) => {
  const {left, valueRight, zeroX, pxPerUnit, baseline, noteBaseline, barTop, barHeight} = geometry;
  const length = amount === null ? 0 : Math.abs(amount) * pxPerUnit * barDrawn;
  return (
    <>
      <Txt role="rowLabel" x={left} y={baseline} opacity={labelShown}>
        {label}
      </Txt>
      {amount !== null && length > 0 ? (
        <rect x={amount >= 0 ? zeroX : zeroX - length} y={barTop} width={length} height={barHeight} fill={colour} />
      ) : null}
      <Txt role={valueRole} x={valueRight + valueInk} y={baseline} anchor="end" fill={colour} opacity={valueShown}>
        {value}
      </Txt>
      <Txt role="note" x={left} y={noteBaseline} opacity={valueShown}>
        {note}
      </Txt>
    </>
  );
};
