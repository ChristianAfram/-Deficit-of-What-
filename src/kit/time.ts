import {Easing, interpolate} from 'remotion';
import {CANVAS} from './theme';

export const FPS = CANVAS.fps;

/** Seconds to frames at the film's frame rate. */
export const sec = (seconds: number): number => Math.round(seconds * FPS);

/** Minutes and seconds to frames: at(1, 12) is the frame at 1:12. */
export const at = (minutes: number, seconds: number): number => sec(minutes * 60 + seconds);

/**
 * The film's only motion curves. "Cuts and slow dissolves, and no other
 * transition": nothing bounces, nothing overshoots.
 */
export const EASE = {
  /** Lines and bars that draw: starts promptly, settles gently. */
  draw: Easing.bezier(0.3, 0, 0.15, 1),
  /** Dissolves and dims. */
  dissolve: Easing.inOut(Easing.sin),
  /** Sound fades. */
  linear: Easing.linear,
} as const;

/**
 * Progress from 0 to 1, starting at `from` and lasting `duration` frames.
 * Clamped on both sides, so it can be read at any frame.
 */
export const ramp = (
  frame: number,
  from: number,
  duration: number,
  easing: (t: number) => number = EASE.draw,
): number =>
  interpolate(frame, [from, from + Math.max(1, duration)], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Linear blend between two numbers. */
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
