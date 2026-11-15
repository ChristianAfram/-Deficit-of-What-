import {Easing, interpolate} from 'remotion';
import {CANVAS} from './theme';

export const FPS = CANVAS.fps;

/** Seconds to frames at the film's frame rate. */
export const sec = (seconds: number): number => Math.round(seconds * FPS);

/** Minutes and seconds to frames: at(1, 12) is the frame at 1:12. */
export const at = (minutes: number, seconds: number): number => sec(minutes * 60 + seconds);

/** Frames to a m:ss.ff timecode, for the review build and for logs. */
export const timecode = (frame: number): string => {
  const whole = Math.floor(frame / FPS);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  const f = frame % FPS;
  return `${m}:${String(s).padStart(2, '0')}.${String(f).padStart(2, '0')}`;
};

/**
 * The film's only motion curves. "Cuts and slow dissolves, and no other
 * transition": nothing bounces, nothing overshoots.
 */
export const EASE = {
  /** Lines and bars that draw: starts promptly, settles gently. */
  draw: Easing.bezier(0.3, 0, 0.15, 1),
  /** Dissolves and dims. */
  dissolve: Easing.inOut(Easing.sin),
  /** Camera push-ins: constant speed reads as a slow push, not a move. */
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
