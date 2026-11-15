// The look of the film, as fixed by the script ("The look"). Every figure in
// every part is built from these values. Do not add a colour here without
// changing the script first.

export const CANVAS = {width: 1920, height: 1080, fps: 24} as const;

export const PALETTE = {
  /** Ground: near black. */
  ground: '#0E0F12',
  /** Type and axes: bone. */
  bone: '#E9E4D8',
  /** Grid and secondary lines: graphite. */
  graphite: '#5B6068',
  /** The result, and the ADHD estimate: amber. */
  amber: '#E8A33D',
  /** The comparison group: blue-grey. */
  blueGrey: '#7C93A8',
  /** A failed prediction: the struck line and the failed box. Nothing else. */
  red: '#D2452D',
  /** Conjecture: white line. */
  conjectureLine: '#F4F7FA',
  /** Conjecture: deep blue ground. */
  conjectureGround: '#0F2A4A',
} as const;

/** Typographic characters the script requires: "Minus signs are real minus signs". */
export const GLYPH = {
  minus: '−',
  enDash: '–',
  middot: '·',
} as const;
