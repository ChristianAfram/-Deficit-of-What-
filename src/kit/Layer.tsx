import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CANVAS} from './theme';

/** A camera position: a scale about a fixed point of the canvas. */
export type Camera = {scale: number; fixed: readonly [number, number]};

export const CAMERA_REST: Camera = {scale: 1, fixed: [CANVAS.width / 2, CANVAS.height / 2]};

type Props = {
  /** "A slow push-in on a figure while it draws." Omit for a layer that never moves. */
  camera?: Camera;
  /** Layer opacity, for dissolves and dims. */
  opacity?: number;
  /** Clips the layer to these canvas rows, so a push never enters a fixed band. */
  clipRows?: readonly [top: number, bottom: number];
  children: React.ReactNode;
};

/**
 * One layer of the picture: an SVG the size of the canvas, drawn in canvas
 * pixels, with its own camera. Children are SVG elements.
 */
export const Layer: React.FC<Props> = ({camera = CAMERA_REST, opacity = 1, clipRows, children}) => {
  if (opacity <= 0) return null;
  const {scale, fixed} = camera;
  const tx = fixed[0] * (1 - scale);
  const ty = fixed[1] * (1 - scale);
  return (
    <AbsoluteFill
      style={{
        opacity,
        clipPath: clipRows ? `inset(${clipRows[0]}px 0px ${CANVAS.height - clipRows[1]}px 0px)` : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: CANVAS.width,
          height: CANVAS.height,
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        }}
      >
        <svg width={CANVAS.width} height={CANVAS.height} viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}>
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
