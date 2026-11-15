// The three result rows (DATA) and the limits note, in layer D under the
// crossover diagram. Build spec, section 2.2 (R01 to R34, L01 to L03),
// section 5, shot 3, and section 9, R2.
//
// Script, picture: "Under the diagram, two result rows grow from a zero line
// (DATA): plus 37 percent, minus 53 percent. A third row appears with no bar at
// all, only its label."

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FigureMark} from '../../kit/FigureMark';
import {PALETTE} from '../../kit/theme';
import {EASE} from '../../kit/time';
import {BONE} from '../../kit/type';
import {Txt} from '../../kit/Txt';
import {DATA_X, LIVE} from '../layout';
import {SHOT, progress, type Anim} from '../shots';
import {LIMITS, PLOT_HEAD, RESULT_PERCENT, RESULT_ROWS} from '../strings';

// ------------------------------------------------------------------ geometry

/** R01. Top left corner of the DATA mark box (69 x 28). */
const MARK_X = LIVE.left;
const MARK_TOP = 452;

/** R02. The plot head is centred on the zero line, on the baseline of the mark text. */
const PLOT_HEAD_BASELINE = 473;

/** R03. The zero line: 2 px of bone, spanning rows 1 and 2 only. */
const ZERO_LINE_TOP = 494;
const ZERO_LINE_BOTTOM = 634;
const ZERO_LINE_WIDTH = 2;

/** R11, R21. Every bar is 28 px tall. */
const BAR_HEIGHT = 28;

/** R30. The separator that closes the plotted region: graphite 1 px across the live width. */
const SEPARATOR_Y = 680;

/** L01. The limits rule: graphite 1 px across the live width. */
const LIMITS_RULE_Y = 776;
/**
 * L02, L03. Baselines of the two limits sentences. The descenders of the
 * second end near y 845, inside the content field (to 852). The camera holds
 * at rest while they are on screen, so these are the rows the viewer sees.
 */
const LIMITS_BASELINES = [808, 840] as const;

/**
 * R12, R22. The percent sign of the text sans carries about 3 px of empty
 * space on its right. Without this, "+37%" and "−53%" would stop 3 px short
 * of the right edge that NO DETECTABLE EFFECT reaches.
 */
const PERCENT_SIGN_BEARING = 3;

/** Lines that are not axes (separator, limits rule) are 1 px. */
const HAIRLINE = 1;

type RowGeometry = {
  /** R10, R20, R31. Baseline of the row label, left on x 128. */
  label: number;
  /** R12, R22, R32. Baseline of the value, right on x 944. */
  value: number;
  /** R13, R23, R33. Baseline of the note, left on x 128. */
  note: number;
  /** R11, R21. Top of the bar. Row 3 has no bar, so it has no bar top. */
  barTop: number | null;
};

const ROWS: readonly RowGeometry[] = [
  {label: 529, value: 531, note: 566, barTop: 506},
  {label: 617, value: 619, note: 654, barTop: 594},
  {label: 721, value: 721, note: 756, barTop: null},
];

/** The SHOT entries of each row, in the order of ROWS. Row 3 has no bar entry. */
const ROW_SHOTS: readonly {label: Anim; bar: Anim | null; value: Anim; note: Anim}[] = [
  {label: SHOT.row1Label, bar: SHOT.row1Bar, value: SHOT.row1Value, note: SHOT.row1Note},
  {label: SHOT.row2Label, bar: SHOT.row2Bar, value: SHOT.row2Value, note: SHOT.row2Note},
  {label: SHOT.row3Label, bar: null, value: SHOT.row3Value, note: SHOT.row3Note},
];

// ---------------------------------------------------------------- components

/** R01 and R02 arrive together, at least six frames before the zero line starts to draw. */
const Head: React.FC<{frame: number}> = ({frame}) => {
  const shown = progress(frame, SHOT.dataMark, EASE.dissolve);
  if (shown <= 0) return null;
  return (
    <>
      <FigureMark kind="data" x={MARK_X} y={MARK_TOP} opacity={shown} />
      <Txt role="plotHead" x={DATA_X.zero} y={PLOT_HEAD_BASELINE} anchor="middle" opacity={shown}>
        {PLOT_HEAD}
      </Txt>
    </>
  );
};

/**
 * R03. The zero line draws top to bottom. It is an axis, so it is bone at
 * full strength. It stops at row 2: the third row is not plotted.
 */
const ZeroLine: React.FC<{frame: number}> = ({frame}) => {
  const drawn = progress(frame, SHOT.zeroLine, EASE.draw);
  if (drawn <= 0) return null;
  return (
    <rect
      x={DATA_X.zero - ZERO_LINE_WIDTH / 2}
      y={ZERO_LINE_TOP}
      width={ZERO_LINE_WIDTH}
      height={(ZERO_LINE_BOTTOM - ZERO_LINE_TOP) * drawn}
      fill={PALETTE.bone}
    />
  );
};

/**
 * R11, R21. A bar grows from the zero line to its percent change at the
 * build's one linear scale, so the picture is drawn from the number: a
 * positive change grows to the right, a negative one to the left. Both bars
 * are amber, flat and unoutlined: both changes favour the drug, so left does
 * not mean bad.
 */
const Bar: React.FC<{percent: number; top: number; drawn: number}> = ({percent, top, drawn}) => {
  if (drawn <= 0) return null;
  const length = Math.abs(percent) * DATA_X.pxPerPoint * drawn;
  const x = percent >= 0 ? DATA_X.zero : DATA_X.zero - length;
  return <rect x={x} y={top} width={length} height={BAR_HEIGHT} fill={PALETTE.amber} />;
};

/**
 * One result row: label, bar, value and note. The value cuts on, on the
 * first frame of its spoken number, after its bar has landed. A row without a
 * percent ("NO DETECTABLE EFFECT") draws nothing in its plot area (R34):
 * nothing was estimated, so nothing is drawn.
 */
const Row: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const {label, value, note} = RESULT_ROWS[index];
  const percent = RESULT_PERCENT[index];
  const geometry = ROWS[index];
  const shots = ROW_SHOTS[index];
  const labelShown = progress(frame, shots.label, EASE.dissolve);
  const valueShown = progress(frame, shots.value);
  const noteShown = progress(frame, shots.note, EASE.dissolve);
  const barDrawn = shots.bar ? progress(frame, shots.bar, EASE.draw) : 0;
  return (
    <>
      <Txt role="rowLabel" x={LIVE.left} y={geometry.label} opacity={labelShown}>
        {label}
      </Txt>
      {percent !== null && geometry.barTop !== null ? (
        <Bar percent={percent} top={geometry.barTop} drawn={barDrawn} />
      ) : null}
      {/* All three values are amber, the result colour. The null is a result too, so it is not dimmed. */}
      <Txt
        role={percent === null ? 'valueWords' : 'value'}
        x={DATA_X.value + (percent === null ? 0 : PERCENT_SIGN_BEARING)}
        y={geometry.value}
        anchor="end"
        opacity={valueShown}
      >
        {value}
      </Txt>
      <Txt role="note" x={LIVE.left} y={geometry.note} opacity={noteShown}>
        {note}
      </Txt>
    </>
  );
};

/** A graphite hairline across the live width, drawn left to right by `drawn`. */
const Rule: React.FC<{y: number; drawn: number; opacity?: number}> = ({y, drawn, opacity = 1}) => {
  if (drawn <= 0 || opacity <= 0) return null;
  return (
    <rect
      x={LIVE.left}
      y={y - HAIRLINE / 2}
      width={(LIVE.right - LIVE.left) * drawn}
      height={HAIRLINE}
      fill={PALETTE.graphite}
      opacity={opacity}
    />
  );
};

/**
 * L01 to L03. "Say so if the cold open ships alone." The rule and both
 * sentences dissolve in together as a figure note, after the written pause, and
 * are final before "Learning did not follow." They are absent from the joined
 * film, and the rows keep the same layout either way.
 */
const Limits: React.FC<{frame: number}> = ({frame}) => {
  const shown = progress(frame, SHOT.limits, EASE.dissolve);
  if (shown <= 0) return null;
  return (
    <>
      <Rule y={LIMITS_RULE_Y} drawn={1} opacity={shown} />
      {LIMITS.map((sentence, i) => (
        <Txt key={sentence} role="limits" x={LIVE.left} y={LIMITS_BASELINES[i]} opacity={shown} strength={BONE.b72}>
          {sentence}
        </Txt>
      ))}
    </>
  );
};

/** The three result rows (DATA) and the limits note. Build spec, R01 to R34 and L01 to L03. */
export const ResultRows: React.FC<{standalone: boolean}> = ({standalone}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <Head frame={frame} />
      {ROWS.map((_, index) => (
        <Row key={RESULT_ROWS[index].label} frame={frame} index={index} />
      ))}
      {/* Drawn over the bars, so the axis both bars start from stays visible. */}
      <ZeroLine frame={frame} />
      <Rule y={SEPARATOR_Y} drawn={progress(frame, SHOT.separator, EASE.draw)} />
      {standalone ? <Limits frame={frame} /> : null}
    </g>
  );
};
