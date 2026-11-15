// The three result rows (DATA) and the limits note, under the crossover
// diagram.
//
// Script, picture: "Under the diagram, two result rows grow from a zero line
// (DATA): plus 37 percent, minus 53 percent. A third row appears with no bar at
// all, only its label."

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress, type Anim} from '../../kit/anim';
import {BarRow, type BarRowGeometry} from '../../kit/BarRow';
import {FigureMark} from '../../kit/FigureMark';
import {Rule} from '../../kit/Rule';
import {PALETTE} from '../../kit/theme';
import {EASE} from '../../kit/time';
import {BONE} from '../../kit/type';
import {Txt} from '../../kit/Txt';
import {LIVE} from '../../kit/grid';
import {DATA_X} from '../layout';
import {SHOT} from '../shots';
import {LIMITS, PLOT_DIRECTION, PLOT_HEAD, RESULT_PERCENT, RESULT_ROWS} from '../strings';

// ------------------------------------------------------------------ geometry

/** Top left corner of the DATA mark. */
const MARK = {x: LIVE.left, y: 452} as const;

/** The plot head is centred on the zero line, on the baseline of the mark's word. */
const PLOT_HEAD_BASELINE = 473;

/** The zero line: 2 px of bone, spanning rows 1 and 2 only. */
const ZERO_LINE = {top: 494, bottom: 634, weight: 2} as const;

/** Every bar is 28 px tall. */
const BAR_HEIGHT = 28;

/**
 * Baseline of each row's label and value, and the top of its bar. The note
 * sits 37 px under the label in every row.
 */
const ROWS = [
  {baseline: 529, barTop: 506},
  {baseline: 617, barTop: 594},
  {baseline: 721, barTop: 698},
] as const;
const NOTE_BELOW_LABEL = 37;

/** The separator that closes the plotted region: a graphite hairline across the live width. */
const SEPARATOR_Y = 680;

/**
 * The limits: a graphite hairline, then two sentences. The rule has the same
 * air above it (to the note of row 3) as below it (to the capitals of the
 * first sentence), and the descenders of the second sentence end near y 847,
 * inside the content field.
 */
const LIMITS_RULE_Y = 778;
const LIMITS_BASELINES = [812, 842] as const;

/**
 * The percent sign of the text sans carries about 3 px of empty space on its
 * right. Without this, "+37%" and "−53%" would stop 3 px short of the right
 * edge that NO DETECTABLE EFFECT reaches.
 */
const PERCENT_SIGN_BEARING = 3;

/** The ends of the plot, where the two direction words stand: the tips of the two bars. */
const PLOT_END = {
  left: DATA_X.zero + Math.min(...RESULT_PERCENT.map((p) => p ?? 0)) * DATA_X.pxPerPoint,
  right: DATA_X.zero + Math.max(...RESULT_PERCENT.map((p) => p ?? 0)) * DATA_X.pxPerPoint,
} as const;

const rowGeometry = (index: number): BarRowGeometry => ({
  left: LIVE.left,
  valueRight: DATA_X.value,
  zeroX: DATA_X.zero,
  pxPerUnit: DATA_X.pxPerPoint,
  baseline: ROWS[index].baseline,
  noteBaseline: ROWS[index].baseline + NOTE_BELOW_LABEL,
  barTop: ROWS[index].barTop,
  barHeight: BAR_HEIGHT,
});

/** The cues of each row, in the order of ROWS. Row 3 has no bar. */
const ROW_SHOTS: readonly {label: Anim; bar: Anim | null; value: Anim}[] = [
  {label: SHOT.row1Label, bar: SHOT.row1Bar, value: SHOT.row1Value},
  {label: SHOT.row2Label, bar: SHOT.row2Bar, value: SHOT.row2Value},
  {label: SHOT.row3Label, bar: null, value: SHOT.row3Value},
];

// ---------------------------------------------------------------- components

/**
 * The DATA mark, the head of the plot and its two directions arrive together,
 * before the zero line starts to draw.
 */
const Head: React.FC<{frame: number}> = ({frame}) => {
  const shown = progress(frame, SHOT.dataMark, EASE.dissolve);
  if (shown <= 0) return null;
  return (
    <>
      <FigureMark kind="data" x={MARK.x} y={MARK.y} opacity={shown} />
      <Txt role="plotHead" x={PLOT_END.left} y={PLOT_HEAD_BASELINE} opacity={shown} strength={BONE.b56}>
        {PLOT_DIRECTION.left}
      </Txt>
      <Txt role="plotHead" x={DATA_X.zero} y={PLOT_HEAD_BASELINE} anchor="middle" opacity={shown}>
        {PLOT_HEAD}
      </Txt>
      <Txt role="plotHead" x={PLOT_END.right} y={PLOT_HEAD_BASELINE} anchor="end" opacity={shown} strength={BONE.b56}>
        {PLOT_DIRECTION.right}
      </Txt>
    </>
  );
};

/**
 * One result row. Its value cuts on with the first frame of its spoken
 * number, after its bar has landed, and its note cuts on with it. All three
 * values are amber, the result colour: the null is a result too, so it is
 * neither dimmed nor red.
 */
const Row: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const {label, value, note} = RESULT_ROWS[index];
  const percent = RESULT_PERCENT[index];
  const shots = ROW_SHOTS[index];
  return (
    <BarRow
      geometry={rowGeometry(index)}
      label={label}
      value={value}
      note={note}
      amount={percent}
      valueRole={percent === null ? 'valueWords' : 'value'}
      valueInk={percent === null ? 0 : PERCENT_SIGN_BEARING}
      labelShown={progress(frame, shots.label, EASE.dissolve)}
      barDrawn={shots.bar ? progress(frame, shots.bar, EASE.draw) : 0}
      valueShown={progress(frame, shots.value)}
    />
  );
};

/**
 * "Say so if the cold open ships alone." The rule and both sentences dissolve
 * in together as a figure note, after the written pause, and are final before
 * "Learning did not follow." They are absent from the joined film, and the
 * rows keep the same layout either way.
 */
const Limits: React.FC<{frame: number}> = ({frame}) => {
  const shown = progress(frame, SHOT.limits, EASE.dissolve);
  if (shown <= 0) return null;
  return (
    <>
      <Rule x={LIVE.left} y={LIMITS_RULE_Y} length={LIVE.right - LIVE.left} opacity={shown} />
      {LIMITS.map((sentence, i) => (
        <Txt key={sentence} role="limits" x={LIVE.left} y={LIMITS_BASELINES[i]} opacity={shown}>
          {sentence}
        </Txt>
      ))}
    </>
  );
};

/** The three result rows (DATA) and the limits note. */
export const ResultRows: React.FC<{standalone: boolean}> = ({standalone}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <Head frame={frame} />
      {ROWS.map((_, index) => (
        <Row key={RESULT_ROWS[index].label} frame={frame} index={index} />
      ))}
      {/*
        The zero line is an axis, so it is bone. It draws top to bottom, over
        the bars, and stops at row 2: the third row is not plotted.
      */}
      <Rule
        x={DATA_X.zero - ZERO_LINE.weight / 2}
        y={ZERO_LINE.top}
        length={ZERO_LINE.bottom - ZERO_LINE.top}
        direction="down"
        weight={ZERO_LINE.weight}
        colour={PALETTE.bone}
        drawn={progress(frame, SHOT.zeroLine, EASE.draw)}
      />
      <Rule
        x={LIVE.left}
        y={SEPARATOR_Y}
        length={LIVE.right - LIVE.left}
        drawn={progress(frame, SHOT.separator, EASE.draw)}
      />
      {standalone ? <Limits frame={frame} /> : null}
    </g>
  );
};
