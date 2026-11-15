import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {FigureMark} from '../../kit/FigureMark';
import {PALETTE} from '../../kit/theme';
import {EASE, mix} from '../../kit/time';
import {Txt} from '../../kit/Txt';
import {SHOT, progress, type Anim} from '../shots';
import {DIAGRAM} from '../strings';

// The trial design as a crossover diagram (SCHEMATIC). Build spec, section
// 2.2, D01 to D14, and shot 2 of section 5.
//
// Script, "Picture": "Then the trial design draws itself as a crossover
// diagram (SCHEMATIC): two parallel tracks, sequence AB and sequence BA, each
// with two three-week blocks. The blocks are hatched, because the allocation
// is masked, and the hatching clears to show which block is methylphenidate
// and which is placebo."

// ------------------------------------------------------------------ geometry

/** D01. Top left corner of the SCHEMATIC mark box. */
const MARK_ORIGIN = {x: 128, y: 176} as const;

/** D02 to D05. Every block is 656 x 76, so the schematic asserts no size (8.2). */
const BLOCK_WIDTH = 656;
const BLOCK_HEIGHT = 76;

/** D02 to D05. Left edges of period 1 and period 2. D06: the 48 px gap between them (A4) is plain ground. */
const PERIOD_X = [432, 1136] as const;

/** D02 to D05. Top edges of track AB and track BA. */
const TRACK_Y = [220, 316] as const;

/** D07. Baseline of "3 WEEKS", from the block top. */
const WEEKS_BASELINE = 64;

/** D08. The ground chip behind "3 WEEKS": 96 x 26, from the block top + 44 to + 70. */
const CHIP = {width: 96, top: 44, height: 26} as const;

/** D09. Baseline of the condition label, from the block top. */
const CONDITION_BASELINE = 34;

/** D10. Left edge and baselines of SEQUENCE AB and SEQUENCE BA. */
const SEQUENCE_X = 232;
const SEQUENCE_BASELINE = [266, 362] as const;

/** D11. The randomisation node and the baseline of its letter. */
const NODE = {x: 150, y: 306, radius: 22, stroke: 2, baseline: 314} as const;

/** D12. The branches: a stem from the node to x 196, then one arm to each track, ending at x 220. */
const BRANCH = {stemFrom: 172, elbow: 196, end: 220, tops: [258, 354], stroke: 2} as const;

/** D13. The MASKED legend: the hatch swatch and its word. */
const LEGEND_MASKED = {x: 128, y: 412, width: 32, height: 16, textX: 172} as const;

/** D14. The RANDOMISED legend: a small node, its letter and its word. */
const LEGEND_RANDOMISED = {x: 313, y: 421, radius: 13, stroke: 1.5, textX: 336} as const;

/** D13, D14. Baseline of both legend words and of the legend's letter. */
const LEGEND_BASELINE = 428;

/** D02 to D05 masked: graphite 1.5 px. K06, K07 unmasked: 2 px in the condition's colour. */
const OUTLINE_MASKED = 1.5;
const OUTLINE_UNMASKED = 2;

/** Hatching (2.2): 2 px graphite lines at 45 degrees, 14 px apart measured perpendicular to the lines. */
const HATCH = {pitch: 14, line: 2, angle: 45} as const;

/**
 * One pattern in user space, so its phase runs on unbroken across all four
 * blocks and the legend swatch. A fixed id: the figure is drawn once per frame.
 */
const HATCH_ID = 'crossover-diagram-hatch';

// ---------------------------------------------------------------- conditions

type Condition = 'methylphenidate' | 'placebo';

/**
 * K06 and K07. 16 % amber and 20 % blue-grey give equal relative luminance
 * (0.0217 each), so the drug block does not look brighter, that is "better".
 */
const CONDITION = {
  methylphenidate: {colour: PALETTE.amber, fill: 0.16, label: DIAGRAM.methylphenidate},
  placebo: {colour: PALETTE.blueGrey, fill: 0.2, label: DIAGRAM.placebo},
} as const satisfies Record<Condition, {colour: string; fill: number; label: string}>;

/**
 * Shot 2, "Unmask mapping". Sequence AB: methylphenidate, then placebo.
 * Sequence BA: the reverse. The letters are the schematic's own convention
 * (8.4), so no letter is ever shown inside a block.
 */
const ALLOCATION: readonly (readonly [Condition, Condition])[] = [
  ['methylphenidate', 'placebo'],
  ['placebo', 'methylphenidate'],
];

/** Period 1 draws while the first "three weeks" is coming, period 2 before the second. */
const PERIOD_SHOTS = [
  {blocks: SHOT.blocksPeriod1, weeks: SHOT.weeksPeriod1},
  {blocks: SHOT.blocksPeriod2, weeks: SHOT.weeksPeriod2},
] as const satisfies readonly {blocks: Anim; weeks: Anim}[];

/** The node letter is the first letter of RANDOMISED, so no string is added. */
const NODE_LETTER = DIAGRAM.randomised[0];

// ------------------------------------------------------------------- drawing

/** The single hatch pattern of the figure (K08: identical in every block). */
const HatchPattern: React.FC = () => (
  <defs>
    <pattern
      id={HATCH_ID}
      patternUnits="userSpaceOnUse"
      width={HATCH.pitch}
      height={HATCH.pitch}
      patternTransform={`rotate(${HATCH.angle})`}
    >
      {/* The line sits inside the tile, away from its edges, so no tile seam cuts it lengthwise. */}
      <rect
        x={(HATCH.pitch - HATCH.line) / 2}
        y={0}
        width={HATCH.line}
        height={HATCH.pitch}
        fill={PALETTE.graphite}
      />
    </pattern>
  </defs>
);

/**
 * A path drawn along its length by dash offset. Complete, it is drawn as a
 * plain stroke, so a finished line carries no dash.
 */
const DrawnPath: React.FC<{
  d: string;
  length: number;
  drawn: number;
  stroke: string;
  strokeWidth: number;
}> = ({d, length, drawn, stroke, strokeWidth}) => {
  if (drawn <= 0) return null;
  const complete = drawn >= 1;
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      strokeDasharray={complete ? undefined : `${length} ${length}`}
      strokeDashoffset={complete ? undefined : length * (1 - drawn)}
    />
  );
};

type BlockProps = {
  x: number;
  y: number;
  condition: Condition;
  /** Progress of the outline drawing, 0 to 1. */
  drawn: number;
  /** Progress of "3 WEEKS" and its chip, 0 to 1. */
  weeks: number;
  /** Progress of the unmask, 0 to 1: the same value in all four blocks. */
  unmasked: number;
  /** Progress of the condition label, 0 to 1. */
  labelled: number;
};

/**
 * One three-week block. While masked it says nothing about its condition:
 * the outline, hatch, chip and words are the same in all four blocks, and
 * `condition` is read only through `unmasked`.
 */
const Block: React.FC<BlockProps> = ({x, y, condition, drawn, weeks, unmasked, labelled}) => {
  if (drawn <= 0) return null;
  const {colour, fill, label} = CONDITION[condition];
  const centreX = x + BLOCK_WIDTH / 2;

  // The stroke sits inside the block, so its outer edge lands on the spec's
  // edges (432, 1088, 1136, 1792) at both widths.
  const strokeWidth = mix(OUTLINE_MASKED, OUTLINE_UNMASKED, unmasked);
  const inset = strokeWidth / 2;
  const left = x + inset;
  const right = x + BLOCK_WIDTH - inset;
  const top = y + inset;
  const bottom = y + BLOCK_HEIGHT - inset;
  const middle = y + BLOCK_HEIGHT / 2;

  // "The outlines draw left to right": two halves leave the middle of the
  // left edge together, one over the top and one under the bottom, and meet
  // at the middle of the right edge.
  const halfLength = (middle - top) + (right - left) + (middle - top);
  const travelled = drawn * halfLength;
  const front = Math.min(right, Math.max(left, left + travelled - (middle - top)));
  const outline = interpolateColors(unmasked, [0, 1], [PALETTE.graphite, colour]);

  // The hatch wipes in behind the stroke: its right edge is the stroke's
  // front. In user space the pattern does not move as the rect grows.
  const hatchWidth = drawn >= 1 ? BLOCK_WIDTH : front > left ? front - x : 0;
  const hatch = 1 - unmasked;

  // "3 WEEKS" sits on a ground chip while the block is hatched, so the hatch
  // never runs through the words. The chip leaves with the hatch.
  const chip = weeks * (1 - unmasked);

  return (
    <g>
      {unmasked > 0 ? (
        <rect x={x} y={y} width={BLOCK_WIDTH} height={BLOCK_HEIGHT} fill={colour} fillOpacity={fill * unmasked} />
      ) : null}
      {hatch > 0 && hatchWidth > 0 ? (
        <rect x={x} y={y} width={hatchWidth} height={BLOCK_HEIGHT} fill={`url(#${HATCH_ID})`} opacity={hatch} />
      ) : null}
      {chip > 0 ? (
        <rect
          x={centreX - CHIP.width / 2}
          y={y + CHIP.top}
          width={CHIP.width}
          height={CHIP.height}
          fill={PALETTE.ground}
          opacity={chip}
        />
      ) : null}
      {drawn >= 1 ? (
        <rect
          x={left}
          y={top}
          width={right - left}
          height={bottom - top}
          fill="none"
          stroke={outline}
          strokeWidth={strokeWidth}
        />
      ) : (
        <>
          <DrawnPath
            d={`M ${left} ${middle} V ${top} H ${right} V ${middle}`}
            length={halfLength}
            drawn={drawn}
            stroke={outline}
            strokeWidth={strokeWidth}
          />
          <DrawnPath
            d={`M ${left} ${middle} V ${bottom} H ${right} V ${middle}`}
            length={halfLength}
            drawn={drawn}
            stroke={outline}
            strokeWidth={strokeWidth}
          />
        </>
      )}
      <Txt role="condition" x={centreX} y={y + CONDITION_BASELINE} anchor="middle" fill={colour} opacity={labelled}>
        {label}
      </Txt>
      <Txt role="blockNote" x={centreX} y={y + WEEKS_BASELINE} anchor="middle" opacity={weeks}>
        {DIAGRAM.block}
      </Txt>
    </g>
  );
};

/** D11. "In randomised order": the node draws clockwise from the top as the word is spoken. */
const RandomNode: React.FC<{drawn: number; letter: number}> = ({drawn, letter}) => {
  const {x, y, radius, stroke, baseline} = NODE;
  const circumference = 2 * Math.PI * radius;
  // Two half arcs from the top, both with the sweep flag set: clockwise on screen.
  const d = `M ${x} ${y - radius} A ${radius} ${radius} 0 0 1 ${x} ${y + radius} A ${radius} ${radius} 0 0 1 ${x} ${y - radius}`;
  return (
    <>
      {drawn >= 1 ? (
        <circle cx={x} cy={y} r={radius} fill="none" stroke={PALETTE.bone} strokeWidth={stroke} />
      ) : (
        <DrawnPath d={d} length={circumference} drawn={drawn} stroke={PALETTE.bone} strokeWidth={stroke} />
      )}
      <Txt role="node" x={x} y={baseline} anchor="middle" opacity={letter}>
        {NODE_LETTER}
      </Txt>
    </>
  );
};

/**
 * D12. The branches draw from the node outward: first the shared stem, then
 * both arms at once. The stem is drawn once, so no stretch of line is
 * stroked twice.
 */
const Branches: React.FC<{drawn: number}> = ({drawn}) => {
  if (drawn <= 0) return null;
  const {stemFrom, elbow, end, tops, stroke} = BRANCH;
  const stem = elbow - stemFrom;
  const arm = Math.abs(NODE.y - tops[0]) + (end - elbow);
  const travelled = drawn * (stem + arm);
  const stemDrawn = Math.min(1, travelled / stem);
  const armDrawn = Math.max(0, (travelled - stem) / arm);
  return (
    <>
      <DrawnPath
        d={`M ${stemFrom} ${NODE.y} H ${elbow}`}
        length={stem}
        drawn={stemDrawn}
        stroke={PALETTE.graphite}
        strokeWidth={stroke}
      />
      {tops.map((armY) => (
        <DrawnPath
          key={armY}
          d={`M ${elbow} ${NODE.y} V ${armY} H ${end}`}
          length={arm}
          drawn={armDrawn}
          stroke={PALETTE.graphite}
          strokeWidth={stroke}
        />
      ))}
    </>
  );
};

/**
 * D13. The swatch is drawn as a masked block is: the same hatch, in phase
 * with the blocks, inside the same 1.5 px graphite outline. It stays after
 * the unmask, because the trial was masked throughout.
 */
const LegendMasked: React.FC<{shown: number}> = ({shown}) => {
  if (shown <= 0) return null;
  const {x, y, width, height, textX} = LEGEND_MASKED;
  const inset = OUTLINE_MASKED / 2;
  return (
    <g opacity={shown}>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${HATCH_ID})`} />
      <rect
        x={x + inset}
        y={y + inset}
        width={width - OUTLINE_MASKED}
        height={height - OUTLINE_MASKED}
        fill="none"
        stroke={PALETTE.graphite}
        strokeWidth={OUTLINE_MASKED}
      />
      <Txt role="legend" x={textX} y={LEGEND_BASELINE}>
        {DIAGRAM.masked}
      </Txt>
    </g>
  );
};

/**
 * D14. The legend's node. Y06 sets its letter in Barlow Condensed 600 at
 * 20 px, B100.
 */
const LegendRandomised: React.FC<{shown: number}> = ({shown}) => {
  if (shown <= 0) return null;
  const {x, y, radius, stroke, textX} = LEGEND_RANDOMISED;
  return (
    <g opacity={shown}>
      <circle cx={x} cy={y} r={radius} fill="none" stroke={PALETTE.bone} strokeWidth={stroke} />
      <Txt role="nodeLegend" x={x} y={LEGEND_BASELINE} anchor="middle">
        {NODE_LETTER}
      </Txt>
      <Txt role="legend" x={textX} y={LEGEND_BASELINE}>
        {DIAGRAM.randomised}
      </Txt>
    </g>
  );
};

// -------------------------------------------------------------------- figure

/** The trial design as a crossover diagram (SCHEMATIC). Build spec, D01 to D14. */
export const CrossoverDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const mark = progress(frame, SHOT.schematicMark, EASE.dissolve);
  // The mark arrives first, so nothing of the figure is drawn before it.
  if (mark <= 0) return null;

  const sequences = progress(frame, SHOT.sequenceLabels, EASE.dissolve);
  const unmasked = progress(frame, SHOT.unmask, EASE.dissolve);
  const labelled = progress(frame, SHOT.conditionLabels, EASE.dissolve);

  return (
    <g>
      <HatchPattern />
      <FigureMark kind="schematic" x={MARK_ORIGIN.x} y={MARK_ORIGIN.y} opacity={mark} />
      {DIAGRAM.sequences.map((text, track) => (
        <Txt key={text} role="sequence" x={SEQUENCE_X} y={SEQUENCE_BASELINE[track]} opacity={sequences}>
          {text}
        </Txt>
      ))}
      {progress(frame, SHOT.randomNode, EASE.draw) > 0 ? (
        <RandomNode
          drawn={progress(frame, SHOT.randomNode, EASE.draw)}
          letter={progress(frame, SHOT.randomLetter, EASE.dissolve)}
        />
      ) : null}
      <Branches drawn={progress(frame, SHOT.randomBranches, EASE.draw)} />
      {TRACK_Y.map((y, track) =>
        PERIOD_X.map((x, period) => (
          <Block
            key={`${track}-${period}`}
            x={x}
            y={y}
            condition={ALLOCATION[track][period]}
            drawn={progress(frame, PERIOD_SHOTS[period].blocks, EASE.draw)}
            weeks={progress(frame, PERIOD_SHOTS[period].weeks, EASE.dissolve)}
            unmasked={unmasked}
            labelled={labelled}
          />
        )),
      )}
      <LegendMasked shown={progress(frame, SHOT.legendMasked, EASE.dissolve)} />
      <LegendRandomised shown={progress(frame, SHOT.legendRandomised, EASE.dissolve)} />
    </g>
  );
};
