import React from 'react';
import {TYPE, type TypeRoleName} from './type';

type Props = {
  role: TypeRoleName;
  /** Anchor x in canvas px. */
  x: number;
  /** Baseline y in canvas px. */
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  /** Overrides the role's colour. */
  fill?: string;
  /** Multiplies the role's own strength, for dissolves. 0 to 1. */
  opacity?: number;
  /** Uses this strength in place of the role's own (one of BONE). */
  strength?: number;
  children: React.ReactNode;
};

/**
 * One line of SVG text in a named role. Positioned by its baseline, as the
 * build spec gives every text box.
 */
export const Txt: React.FC<Props> = ({role, x, y, anchor = 'start', fill, opacity = 1, strength, children}) => {
  const r = TYPE[role];
  // Letter spacing is added after every glyph, the last one included. Without
  // this correction, centred and right-aligned tracked text sits off its mark.
  const trailing = r.tracking * r.size;
  const dx = anchor === 'end' ? trailing : anchor === 'middle' ? trailing / 2 : 0;
  const total = (strength ?? r.opacity) * opacity;
  if (total <= 0) return null;
  return (
    <text
      x={x + dx}
      y={y}
      textAnchor={anchor}
      fill={fill ?? r.fill}
      fillOpacity={total}
      style={{
        fontFamily: r.family,
        fontWeight: r.weight,
        fontSize: r.size,
        letterSpacing: `${r.tracking}em`,
        fontFeatureSettings: r.tabular ? '"tnum" 1, "lnum" 1' : undefined,
        whiteSpace: 'pre',
      }}
    >
      {children}
    </text>
  );
};
