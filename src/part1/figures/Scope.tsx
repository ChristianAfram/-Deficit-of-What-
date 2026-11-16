// Beat 0.1, "What is not in question": the two limits, stated once.
//
// Script, picture: "Two normal curves half a standard deviation apart (DATA,
// computed). The shared area fills slowly. A single case is marked under both
// curves at once." On screen: "HERITABILITY NEAR 0.74, TWIN STUDIES. Faraone
// and Larsson (2019). Then: d = 0.5, DISTRIBUTIONS OVERLAP BY 80%."

import React from 'react';
import {evolvePath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {progress} from '../../kit/anim';
import {FigureMark} from '../../kit/FigureMark';
import {LIVE} from '../../kit/grid';
import {Rule} from '../../kit/Rule';
import {PALETTE} from '../../kit/theme';
import {EASE} from '../../kit/time';
import {BONE} from '../../kit/type';
import {Txt} from '../../kit/Txt';
import {CURVES, MARK} from '../layout';
import {SHOT} from '../shots';
import {HERITABILITY, OVERLAP, OVERLAP_D} from '../strings';

// ------------------------------------------------------------- heritability

/** The statement and its note, in the upper third, where a figure's head stands. */
const STATEMENT_BASELINE = 300;
const STATEMENT_NOTE_BASELINE = 348;

/**
 * The first limit. The figure cuts on with the spoken number, its note with
 * it, and both leave with the citation of the paper they are from.
 */
export const Heritability: React.FC = () => {
  const frame = useCurrentFrame();
  const shown = progress(frame, SHOT.heritability) * (1 - progress(frame, SHOT.heritabilityLeaves, EASE.dissolve));
  if (shown <= 0) return null;
  return (
    <g>
      <Txt role="statement" x={LIVE.left} y={STATEMENT_BASELINE} opacity={shown}>
        {HERITABILITY.line}
      </Txt>
      <Txt role="note" x={LIVE.left} y={STATEMENT_NOTE_BASELINE} opacity={shown}>
        {HERITABILITY.note}
      </Txt>
    </g>
  );
};

// --------------------------------------------------------------- the curves

const {centreX, sd, baselineY, peak, halfWidth} = CURVES;

/** The two means, half the effect size to each side of the middle. */
const MEAN = {comparison: centreX - (OVERLAP_D / 2) * sd, adhd: centreX + (OVERLAP_D / 2) * sd} as const;

/** Height of a normal curve above the axis, `z` standard deviations from its mean. */
const height = (z: number): number => peak * Math.exp(-(z * z) / 2);

/** The x positions the curves are sampled at: every 4 px across the axis. */
const SAMPLES = Array.from({length: Math.floor((2 * halfWidth) / 4) + 1}, (_, i) => centreX - halfWidth + i * 4);

const curvePath = (mean: number): string =>
  SAMPLES.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${(baselineY - height((x - mean) / sd)).toFixed(2)}`).join(' ');

const PATH = {comparison: curvePath(MEAN.comparison), adhd: curvePath(MEAN.adhd)} as const;

/** The area under both curves at once: under the lower of the two at every point. */
const SHARED_AREA = [
  `M ${SAMPLES[0]} ${baselineY}`,
  ...SAMPLES.map((x) => {
    const lower = Math.min(height((x - MEAN.comparison) / sd), height((x - MEAN.adhd) / sd));
    return `L ${x} ${(baselineY - lower).toFixed(2)}`;
  }),
  `L ${SAMPLES[SAMPLES.length - 1]} ${baselineY} Z`,
].join(' ');

/** Where the two curves cross: over the middle, a quarter of a standard deviation from each mean. */
const CROSSING_Y = Math.round(baselineY - height(OVERLAP_D / 2));

/** Type under and beside the curves. */
const TEXT = {
  effectBaseline: 262,
  valueBaseline: 304,
  groupBaseline: 322,
  tickBaseline: 732,
  singleBaseline: 770,
  noteBaseline: 818,
} as const;

/** How strongly the shared area is filled: bone at this opacity, on the ground. */
const SHARED_FILL = 0.18;

/**
 * The second limit: what a difference of half a standard deviation between
 * two groups looks like. The figure is computed, not measured, and says so
 * beside its DATA mark.
 */
export const OverlapCurves: React.FC = () => {
  const frame = useCurrentFrame();
  const present = 1 - progress(frame, SHOT.curvesLeave, EASE.dissolve);
  const mark = progress(frame, SHOT.curvesMark, EASE.dissolve);
  if (present <= 0 || mark <= 0) return null;
  const axis = progress(frame, SHOT.curvesAxis, EASE.draw);
  const comparison = progress(frame, SHOT.curveComparison, EASE.draw);
  const adhd = progress(frame, SHOT.curveAdhd, EASE.draw);
  const effect = progress(frame, SHOT.curvesEffect, EASE.dissolve);
  const fill = progress(frame, SHOT.overlapFill, EASE.dissolve);
  const value = progress(frame, SHOT.overlapValue, EASE.dissolve);
  const single = progress(frame, SHOT.singleCase, EASE.dissolve);
  const evolve = (path: string, drawn: number) => evolvePath(drawn, path);
  return (
    <g opacity={present}>
      <FigureMark kind="data" x={MARK.x} y={MARK.y} opacity={mark} />
      <Txt role="plotHead" x={MARK.x + 85} y={MARK.headBaseline} opacity={mark}>
        {OVERLAP.head}
      </Txt>

      {/* The shared area, under both curves. It is drawn first, so the two curves run over it. */}
      {fill > 0 ? <path d={SHARED_AREA} fill={PALETTE.bone} opacity={fill * SHARED_FILL} /> : null}

      {comparison > 0 ? (
        <path d={PATH.comparison} fill="none" stroke={PALETTE.blueGrey} strokeWidth={2} {...evolve(PATH.comparison, comparison)} />
      ) : null}
      {adhd > 0 ? <path d={PATH.adhd} fill="none" stroke={PALETTE.amber} strokeWidth={2} {...evolve(PATH.adhd, adhd)} /> : null}
      <Txt role="condition" x={MEAN.comparison - 28} y={TEXT.groupBaseline} anchor="end" fill={PALETTE.blueGrey} opacity={comparison >= 1 ? 1 : 0}>
        {OVERLAP.comparison}
      </Txt>
      <Txt role="condition" x={MEAN.adhd + 28} y={TEXT.groupBaseline} fill={PALETTE.amber} opacity={adhd >= 1 ? 1 : 0}>
        {OVERLAP.adhd}
      </Txt>

      {/* The axis, in standard deviations from the comparison mean. The two means are its only ticks. */}
      <Rule x={centreX - halfWidth} y={baselineY} length={2 * halfWidth} weight={2} colour={PALETTE.bone} drawn={axis} />
      <Txt role="plotHead" x={centreX + halfWidth} y={TEXT.tickBaseline} anchor="end" strength={BONE.b56} opacity={axis >= 1 ? 1 : 0}>
        {OVERLAP.axis}
      </Txt>
      {effect > 0 ? (
        <g opacity={effect}>
          <Rule x={MEAN.comparison} y={baselineY + 2} length={8} direction="down" colour={PALETTE.bone} />
          <Rule x={MEAN.adhd} y={baselineY + 2} length={8} direction="down" colour={PALETTE.bone} />
          <Txt role="axisTick" x={MEAN.comparison} y={TEXT.tickBaseline} anchor="middle" strength={BONE.b72}>
            0
          </Txt>
          <Txt role="axisTick" x={MEAN.adhd} y={TEXT.tickBaseline} anchor="middle" strength={BONE.b72}>
            0.5
          </Txt>
        </g>
      ) : null}
      <Txt role="estimate" x={LIVE.left} y={TEXT.effectBaseline} fill={PALETTE.bone} opacity={effect}>
        {OVERLAP.effect}
      </Txt>
      <Txt role="rowLabel" x={LIVE.left} y={TEXT.valueBaseline} opacity={value}>
        {OVERLAP.value}
      </Txt>
      <Txt role="note" x={LIVE.left} y={TEXT.noteBaseline} opacity={value}>
        {OVERLAP.note}
      </Txt>

      {/* One case, at one score, under both curves at once. */}
      {single > 0 ? (
        <g opacity={single}>
          <Rule x={centreX - 1} y={CROSSING_Y} length={baselineY + 44 - CROSSING_Y} direction="down" weight={2} colour={PALETTE.bone} />
          <circle cx={centreX} cy={baselineY + 1} r={7} fill={PALETTE.bone} />
          <Txt role="legend" x={centreX} y={TEXT.singleBaseline} anchor="middle" strength={BONE.b100}>
            {OVERLAP.single}
          </Txt>
        </g>
      ) : null}
    </g>
  );
};
