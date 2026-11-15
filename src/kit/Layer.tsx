import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CANVAS} from './theme';

type Props = {
  /** Layer opacity, for dissolves and dims. */
  opacity?: number;
  children: React.ReactNode;
};

/**
 * One layer of the picture: an SVG the size of the canvas, drawn in canvas
 * pixels. Children are SVG elements.
 *
 * A layer is never scaled. The script's camera rule is "a slow push-in on a
 * figure while it draws". It was built and measured, and then taken out of
 * this part: a slow scale moves type in whole-pixel steps while the rules
 * beside it glide, and it takes a figure off the layout grid either before
 * the push or after it. See docs/build-spec-cold-open.md, I1.
 */
export const Layer: React.FC<Props> = ({opacity = 1, children}) => {
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={CANVAS.width} height={CANVAS.height} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};
