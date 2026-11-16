// Beats 1.3 and 1.4: the two forest plots and the two check boxes.
//
// Script, 1.3: "A forest plot builds row by row from a zero line (DATA, point
// estimates): spatial storage, spatial manipulation, verbal storage, verbal
// manipulation, then the adult estimates. Then two empty check boxes appear
// to the right of the plot." 1.4: "First, a band shaded from 0.46 to 0.69 on
// the effect-size axis, labelled as the range of all executive measures
// (DATA). The first check box is marked as failed. Then four forest rows with
// their intervals (DATA) ... The last interval almost touches zero. The
// second check box is marked as failed."
//
// The two plots share one frame: one zero line, one scale, one printed axis.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress, type Anim} from '../../kit/anim';
import {CheckBox} from '../../kit/CheckBox';
import {FigureMark} from '../../kit/FigureMark';
import {ForestRow, forestX} from '../../kit/ForestRow';
import {Rule} from '../../kit/Rule';
import {PALETTE} from '../../kit/theme';
import {EASE} from '../../kit/time';
import {BONE} from '../../kit/type';
import {Txt} from '../../kit/Txt';
import {FOREST, MARK, PLOT, TESTS_BOX} from '../layout';
import {SHOT} from '../shots';
import {
  AXIS_TICKS,
  EF_BAND,
  TESTS,
  TRAINING_NOTE,
  TRAINING_PLOT,
  TRAINING_ROWS,
  WM_ADULTS,
  WM_CHILDREN,
  WM_PLOT,
  type ForestRowText,
} from '../strings';

type RowShot = {label: Anim; mark: Anim | null; value: Anim};

const WM_SHOTS: readonly RowShot[] = [
  {label: SHOT.wm1Label, mark: SHOT.wm1Mark, value: SHOT.wm1Value},
  {label: SHOT.wm2Label, mark: SHOT.wm2Mark, value: SHOT.wm2Value},
  {label: SHOT.wm3Label, mark: SHOT.wm3Mark, value: SHOT.wm3Value},
  {label: SHOT.wm4Label, mark: SHOT.wm4Mark, value: SHOT.wm4Value},
  {label: SHOT.wm5Label, mark: null, value: SHOT.wm5Value},
  {label: SHOT.wm6Label, mark: null, value: SHOT.wm6Value},
];

const TRAINING_SHOTS: readonly RowShot[] = [
  {label: SHOT.tr1Label, mark: SHOT.tr1Mark, value: SHOT.tr1Value},
  {label: SHOT.tr2Label, mark: SHOT.tr2Mark, value: SHOT.tr2Value},
  {label: SHOT.tr3Label, mark: SHOT.tr3Mark, value: SHOT.tr3Value},
  {label: SHOT.tr4Label, mark: SHOT.tr4Mark, value: SHOT.tr4Value},
];

/** The head of a plot beside the mark, and the direction of the plot at the right end of its axis. */
const Head: React.FC<{head: string; direction: string; shown: number}> = ({head, direction, shown}) =>
  shown > 0 ? (
    <>
      <Txt role="plotHead" x={MARK.x + 85} y={MARK.headBaseline} opacity={shown}>
        {head}
      </Txt>
      <Txt role="plotHead" x={PLOT.right} y={MARK.headBaseline} anchor="end" strength={BONE.b56} opacity={shown}>
        {direction}
      </Txt>
    </>
  ) : null;

/** The line that names the study a group of rows is from. It stays with its rows when the band above moves on. */
const GroupHead: React.FC<{text: string; baseline: number; shown: number}> = ({text, baseline, shown}) => (
  <Txt role="legend" x={FOREST.left} y={baseline} opacity={shown}>
    {text}
  </Txt>
);

const Rows: React.FC<{rows: readonly ForestRowText[]; shots: readonly RowShot[]; first: number; frame: number}> = ({
  rows,
  shots,
  first,
  frame,
}) => (
  <>
    {rows.map(({label, value, interval, drawn}, i) => (
      <ForestRow
        key={label}
        axis={FOREST}
        baseline={PLOT.rowBaseline[first + i]}
        label={label}
        value={value}
        interval={interval}
        drawn={drawn}
        valueRole={drawn ? 'estimate' : 'valueWords'}
        labelShown={progress(frame, shots[i].label, EASE.dissolve)}
        markDrawn={shots[i].mark ? progress(frame, shots[i].mark, EASE.draw) : 0}
        valueShown={progress(frame, shots[i].value)}
      />
    ))}
  </>
);

/** How strongly the band of beat 1.4 is shaded: amber at this opacity, on the ground. */
const BAND_FILL = 0.24;

/** The forest plots of beats 1.3 and 1.4, with the two check boxes to their right. */
export const ForestFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const present = 1 - progress(frame, SHOT.testsLeave, EASE.dissolve);
  const mark = progress(frame, SHOT.plotMark, EASE.dissolve);
  if (present <= 0 || mark <= 0) return null;
  const dissolve = (shot: Anim): number => progress(frame, shot, EASE.dissolve);

  // 1.3: the working-memory rows, and the two studies they are from.
  const wmPresent = 1 - dissolve(SHOT.wmRowsLeave);
  // 1.4, first test: the band. It leaves with its study.
  const bandPresent = 1 - dissolve(SHOT.willcuttLeaves);
  const band = progress(frame, SHOT.band, EASE.draw);
  const bandFrom = forestX(FOREST, EF_BAND.drawn[0]);
  const bandWidth = Math.round((forestX(FOREST, EF_BAND.drawn[1]) - bandFrom) * band);
  // 1.4, second test: the head changes with the study, and the rows are the trials'.
  const training = dissolve(SHOT.trainingHead);
  const effectHead = mark * (1 - dissolve(SHOT.willcuttLeaves));
  const zero = progress(frame, SHOT.zeroLine, EASE.draw);
  const axisShown = zero >= 1 ? 1 : 0;

  return (
    <g opacity={present}>
      <FigureMark kind="data" x={MARK.x} y={MARK.y} opacity={mark} />
      <Head head={WM_PLOT.head} direction={WM_PLOT.direction} shown={effectHead} />
      <Head head={TRAINING_PLOT.head} direction={TRAINING_PLOT.direction} shown={training} />

      {/* The band lies under the zero line and the axis. */}
      {band > 0 && bandPresent > 0 ? (
        <g opacity={bandPresent}>
          <rect x={bandFrom} y={PLOT.top} width={bandWidth} height={PLOT.axisY - PLOT.top} fill={PALETTE.amber} opacity={BAND_FILL} />
          <Rule x={bandFrom} y={PLOT.top} length={PLOT.axisY - PLOT.top} direction="down" weight={2} colour={PALETTE.amber} />
          {band >= 1 ? (
            <Rule x={bandFrom + bandWidth - 2} y={PLOT.top} length={PLOT.axisY - PLOT.top} direction="down" weight={2} colour={PALETTE.amber} />
          ) : null}
        </g>
      ) : null}

      {/* The printed axis: its line, its ticks and their values. */}
      <Rule x={FOREST.zeroX} y={PLOT.axisY} length={PLOT.right - FOREST.zeroX} drawn={zero} />
      {AXIS_TICKS.map(({at, label}) => (
        <React.Fragment key={label}>
          {at > 0 ? <Rule x={forestX(FOREST, at)} y={PLOT.axisY + 1} length={8} direction="down" opacity={axisShown} /> : null}
          <Txt role="axisTick" x={forestX(FOREST, at)} y={PLOT.tickLabelBaseline} anchor="middle" opacity={axisShown}>
            {label}
          </Txt>
        </React.Fragment>
      ))}
      {/* The zero line is an axis, so it is bone. It draws top to bottom. */}
      <Rule
        x={FOREST.zeroX - 1}
        y={PLOT.top}
        length={PLOT.axisY + 1 - PLOT.top}
        direction="down"
        weight={2}
        colour={PALETTE.bone}
        drawn={zero}
      />

      {wmPresent > 0 ? (
        <g opacity={wmPresent}>
          <GroupHead text={WM_PLOT.children} baseline={PLOT.groupBaseline[0]} shown={dissolve(SHOT.childrenHead)} />
          <Rows rows={WM_CHILDREN} shots={WM_SHOTS.slice(0, 4)} first={0} frame={frame} />
          <GroupHead text={WM_PLOT.adults} baseline={PLOT.groupBaseline[1]} shown={dissolve(SHOT.adultsHead)} />
          <Rows rows={WM_ADULTS} shots={WM_SHOTS.slice(4)} first={4} frame={frame} />
        </g>
      ) : null}

      {bandPresent > 0 ? (
        <g opacity={bandPresent}>
          <GroupHead
            text={EF_BAND.group}
            baseline={PLOT.groupBaseline[0]}
            shown={dissolve(SHOT.bandLabel)}
          />
          <ForestRow
            axis={FOREST}
            baseline={PLOT.rowBaseline[0]}
            label={EF_BAND.label}
            value={EF_BAND.value}
            interval=""
            drawn={null}
            labelShown={dissolve(SHOT.bandLabel)}
            markDrawn={0}
            valueShown={progress(frame, SHOT.bandValue)}
          />
        </g>
      ) : null}

      <GroupHead
        text={TRAINING_PLOT.group}
        baseline={PLOT.groupBaseline[0]}
        shown={training}
      />
      <Rows rows={TRAINING_ROWS} shots={TRAINING_SHOTS} first={0} frame={frame} />
      {TRAINING_NOTE.map((line, i) => (
        <Txt key={line} role="limits" x={FOREST.left} y={PLOT.noteBaseline[i]} opacity={dissolve(SHOT.trainingNote)}>
          {line}
        </Txt>
      ))}

      {/* The two tests of a core deficit. They are the film's own, and stand through both plots. */}
      <Txt role="plotHead" x={TESTS_BOX.x} y={TESTS_BOX.headBaseline} opacity={dissolve(SHOT.testsHead)}>
        {TESTS.head}
      </Txt>
      <CheckBox
        x={TESTS_BOX.x}
        y={TESTS_BOX.y[0]}
        label={TESTS.boxes[0]}
        shown={dissolve(SHOT.box1)}
        failed={frame >= SHOT.box1Failed.from}
      />
      <CheckBox
        x={TESTS_BOX.x}
        y={TESTS_BOX.y[1]}
        label={TESTS.boxes[1]}
        shown={dissolve(SHOT.box2)}
        failed={frame >= SHOT.box2Failed.from}
      />
    </g>
  );
};
