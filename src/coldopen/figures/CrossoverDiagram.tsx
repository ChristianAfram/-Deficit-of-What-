import React, {useId} from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {progress, type Anim} from '../../kit/anim';
import {FigureMark} from '../../kit/FigureMark';
import {PALETTE} from '../../kit/theme';
import {EASE} from '../../kit/time';
import {Txt} from '../../kit/Txt';
import {SHOT} from '../shots';
import {DIAGRAM} from '../strings';

// The trial design as a crossover diagram (SCHEMATIC). Ids such as D02 name an
// element in the design, docs/build-spec-cold-open.md, section 2.2.
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

/**
 * D07, D09. Baselines of the condition name and of "3 WEEKS", from the block
 * top. Together the two lines stand centred in the block.
 */
const CONDITION_BASELINE = 31;
const WEEKS_BASELINE = 61;

/**
 * D08. The ground chip behind "3 WEEKS" while the block is hatched. It runs
 * from above the words down to the block's bottom outline, so it reads as a
 * tab on the block's edge and no sliver of hatch is left under the words.
 */
const CHIP = {width: 96, top: 41} as const;

/** D10. Left edge and baselines of SEQUENCE AB and SEQUENCE BA. */
const SEQUENCE_X = 232;
const SEQUENCE_BASELINE = [266, 362] as const;

/**
 * D11. The randomisation node and the baseline of its letter. Its centre is
 * 23 px in from the left vertical, so the outer edge of its 2 px stroke
 * stands on x 128 with every other left edge.
 */
const NODE = {x: 151, y: 306, radius: 22, stroke: 2, baseline: 314} as const;

/**
 * D12. The branches: a stem from the outer edge of the node's ring to x 196,
 * then one arm to each track, ending at x 220.
 */
const BRANCH = {
  stemFrom: NODE.x + NODE.radius + NODE.stroke / 2,
  elbow: 196,
  end: 220,
  tops: [258, 354],
  stroke: 2,
} as const;

/**
 * D13, D14. The key stands close under the blocks it explains, on one
 * baseline, with clear space below it before the next figure starts. It has
 * one place, on the left edge: MASKED while the blocks are hatched, then
 * RANDOMISED.
 */
const LEGEND_BASELINE = 422;

/** D13. The MASKED key: a swatch wide enough to show three whole hatch lines, and its word. */
const LEGEND_MASKED = {x: 128, width: 56, height: 16, textX: 196} as const;

/** D14. The RANDOMISED key: a small node, its letter and its word. */
const LEGEND_RANDOMISED = {x: 141, y: 415, radius: 12, stroke: 2, textX: 165} as const;

/**
 * D02 to D05. The outline is 2 px, graphite while masked and the condition's
 * colour after. It keeps one weight, so the unmasking changes colour and nothing
 * else, and it matches the weight of the hatch it encloses.
 */
const OUTLINE = 2;

/** Hatching: 2 px graphite lines at 45 degrees, 14 px apart measured perpendicular to the lines. */
const HATCH = {pitch: 14, line: 2, angle: 45} as const;

// ---------------------------------------------------------------- conditions

type Condition = 'methylphenidate' | 'placebo';

/**
 * The two fills, 16 % amber and 20 % blue-grey, have equal
 * relative luminance (0.0217 each), so neither block is the brighter field.
 * The outlines and the names carry the palette's own amber and blue-grey.
 */
const CONDITION = {
  methylphenidate: {colour: PALETTE.amber, fill: 0.16, label: DIAGRAM.methylphenidate},
  placebo: {colour: PALETTE.blueGrey, fill: 0.2, label: DIAGRAM.placebo},
} as const satisfies Record<Condition, {colour: string; fill: number; label: string}>;

/**
 * Sequence AB: methylphenidate, then placebo. Sequence BA: the reverse. The
 * letters are the schematic's own convention: the paper names the design
 * "AB/BA crossover" and never assigns a letter to a condition. So no letter
 * is ever shown inside a block.
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

/**
 * The single hatch pattern of the figure, identical in every block. It is in
 * user space, so its phase runs on unbroken across all four blocks.
 */
const HatchPattern: React.FC<{id: string}> = ({id}) => (
  <defs>
    <pattern
      id={id}
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
  /** How far the hatch has cleared, 0 to 1: the same value in all four blocks. */
  cleared: number;
  /** How far the condition shows (colour, fill, name), 0 to 1: the same value in all four blocks. */
  shown: number;
  hatchId: string;
};

/**
 * One three-week block. While masked it says nothing about its condition:
 * the outline, hatch, chip and words are the same in all four blocks, and
 * `condition` is read only through `shown`. The hatch clears first, and the
 * condition shows after it, so no hatch line ever runs through a name.
 */
const Block: React.FC<BlockProps> = ({x, y, condition, drawn, weeks, cleared, shown, hatchId}) => {
  if (drawn <= 0) return null;
  const {colour, fill, label} = CONDITION[condition];
  const centreX = x + BLOCK_WIDTH / 2;

  // The stroke sits inside the block, so its outer edge lands on the block's
  // edges (432, 1088, 1136, 1792) and on whole pixels.
  const strokeWidth = OUTLINE;
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
  const outline = interpolateColors(shown, [0, 1], [PALETTE.graphite, colour]);

  // The hatch wipes in behind the stroke: its right edge is the stroke's
  // front. In user space the pattern does not move as the rect grows.
  const hatchWidth = drawn >= 1 ? BLOCK_WIDTH : front > left ? front - x : 0;
  const hatch = 1 - cleared;

  // "3 WEEKS" sits on a ground chip while the block is hatched, so the hatch
  // never runs through the words. The chip leaves with the hatch, before the
  // fill arrives, so it is never seen as a dark plate on a tinted block.
  const chip = weeks * (1 - cleared);

  return (
    <g>
      {shown > 0 ? (
        <rect x={x} y={y} width={BLOCK_WIDTH} height={BLOCK_HEIGHT} fill={colour} fillOpacity={fill * shown} />
      ) : null}
      {hatch > 0 && hatchWidth > 0 ? (
        <rect x={x} y={y} width={hatchWidth} height={BLOCK_HEIGHT} fill={`url(#${hatchId})`} opacity={hatch} />
      ) : null}
      {chip > 0 ? (
        <rect
          x={centreX - CHIP.width / 2}
          y={y + CHIP.top}
          width={CHIP.width}
          height={BLOCK_HEIGHT - CHIP.top - OUTLINE}
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
      <Txt role="condition" x={centreX} y={y + CONDITION_BASELINE} anchor="middle" fill={colour} opacity={shown}>
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
 * D13. The key to the hatch: a small masked block with three whole hatch
 * lines in it. It leaves when the hatch clears, so the figure never shows a
 * key to a mark that is no longer in it. The design tag still says
 * TRIPLE-MASKED.
 */
const LegendMasked: React.FC<{shown: number}> = ({shown}) => {
  const clipId = `masked-key${useId()}`;
  if (shown <= 0) return null;
  const {x, width, height, textX} = LEGEND_MASKED;
  const y = LEGEND_BASELINE - height;
  // At 45 degrees a line crosses the swatch over `height` px of width, and
  // whole lines stand one horizontal pitch apart.
  const pitchAcross = HATCH.pitch * Math.SQRT2;
  const centre = x + width / 2;
  return (
    <g opacity={shown}>
      <clipPath id={clipId}>
        <rect x={x} y={y} width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${clipId})`} stroke={PALETTE.graphite} strokeWidth={HATCH.line}>
        {[-1, 0, 1].map((k) => {
          const middle = centre + k * pitchAcross;
          return <line key={k} x1={middle - height / 2} y1={y + height} x2={middle + height / 2} y2={y} />;
        })}
      </g>
      <rect
        x={x + OUTLINE / 2}
        y={y + OUTLINE / 2}
        width={width - OUTLINE}
        height={height - OUTLINE}
        fill="none"
        stroke={PALETTE.graphite}
        strokeWidth={OUTLINE}
      />
      <Txt role="legend" x={textX} y={LEGEND_BASELINE}>
        {DIAGRAM.masked}
      </Txt>
    </g>
  );
};

/**
 * D14. The key to the node. It takes the place of the MASKED key once the
 * hatch has cleared.
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

/** The trial design as a crossover diagram (SCHEMATIC). */
export const CrossoverDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const hatchId = `hatch${useId()}`;
  const mark = progress(frame, SHOT.schematicMark, EASE.dissolve);
  // The mark arrives first, so nothing of the figure is drawn before it.
  if (mark <= 0) return null;

  const sequences = progress(frame, SHOT.sequenceLabels, EASE.dissolve);
  const cleared = progress(frame, SHOT.hatchClears, EASE.dissolve);
  const shown = progress(frame, SHOT.conditionsShown, EASE.dissolve);

  return (
    <g>
      <HatchPattern id={hatchId} />
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
            cleared={cleared}
            shown={shown}
            hatchId={hatchId}
          />
        )),
      )}
      <LegendMasked shown={progress(frame, SHOT.legendMasked, EASE.dissolve) * (1 - cleared)} />
      <LegendRandomised shown={shown} />
    </g>
  );
};
