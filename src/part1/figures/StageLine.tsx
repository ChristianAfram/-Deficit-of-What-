// Beats 1.1 and 1.2: a memory test as three stages in a line (SCHEMATIC), the
// two predicted sites, and the two studies that place the loss differently.
//
// Script, 1.1: "A memory test is drawn as three stages in a line (SCHEMATIC):
// acquisition, retention, retrieval. The second and third are outlined as the
// predicted sites." 1.2: "A marker settles on the first stage, acquisition,
// and the other two clear. Then a second marker, in the comparison colour,
// appears for the 2024 study and settles on the second stage. The two markers
// stay where they are, in disagreement."

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress, type Anim} from '../../kit/anim';
import {FigureMark} from '../../kit/FigureMark';
import {Rule} from '../../kit/Rule';
import {PALETTE} from '../../kit/theme';
import {EASE, mix} from '../../kit/time';
import {BONE} from '../../kit/type';
import {Txt} from '../../kit/Txt';
import {FINDINGS, MARK, STAGE} from '../layout';
import {SHOT} from '../shots';
import {PAWLEY_FINDINGS, PREDICTED_SITE, SKODZIK_FINDINGS, STAGES, STUDY, type Finding} from '../strings';

const centreOf = (stage: number): number => STAGE.left[stage] + STAGE.width / 2;

/** A study's marker: a diamond, 20 px across. */
const Diamond: React.FC<{x: number; y: number; half: number; colour: string}> = ({x, y, half, colour}) => (
  <polygon points={`${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`} fill={colour} />
);

/** The connector between two stages: a graphite rule that ends in an arrowhead. */
const Connector: React.FC<{from: number; drawn: number}> = ({from, drawn}) => {
  const y = STAGE.top + STAGE.height / 2;
  const start = from + STAGE.width + 16;
  const length = STAGE.left[1] - STAGE.left[0] - STAGE.width - 32;
  return (
    <>
      <Rule x={start} y={y - 1} length={length - 8} weight={2} drawn={drawn} />
      {drawn >= 1 ? (
        <polygon
          points={`${start + length - 10},${y - 7} ${start + length},${y} ${start + length - 10},${y + 7}`}
          fill={PALETTE.graphite}
        />
      ) : null}
    </>
  );
};

/** One stage: a box and its name. A predicted site has a bone outline and a tag under it. */
const Stage: React.FC<{index: number; shown: number; predicted: number}> = ({index, shown, predicted}) => {
  if (shown <= 0) return null;
  const x = STAGE.left[index];
  return (
    <g opacity={shown}>
      <rect
        x={x + 1}
        y={STAGE.top + 1}
        width={STAGE.width - 2}
        height={STAGE.height - 2}
        fill="none"
        stroke={PALETTE.graphite}
        strokeWidth={2}
      />
      {predicted > 0 ? (
        <rect
          x={x + 1}
          y={STAGE.top + 1}
          width={STAGE.width - 2}
          height={STAGE.height - 2}
          fill="none"
          stroke={PALETTE.bone}
          strokeWidth={2}
          opacity={predicted}
        />
      ) : null}
      <Txt role="stage" x={centreOf(index)} y={STAGE.labelBaseline} anchor="middle">
        {STAGES[index]}
      </Txt>
      <Txt role="legend" x={centreOf(index)} y={STAGE.predictedBaseline} anchor="middle" opacity={predicted}>
        {PREDICTED_SITE}
      </Txt>
    </g>
  );
};

/** A study's marker under the stage it places the loss at, with the study's short name under it. */
const Marker: React.FC<{stage: number; colour: string; label: string; shot: Anim; frame: number}> = ({
  stage,
  colour,
  label,
  shot,
  frame,
}) => {
  const settled = progress(frame, shot, EASE.draw);
  if (settled <= 0) return null;
  // The marker comes down onto its stage and stops: it settles.
  const y = Math.round(mix(STAGE.markerY - 14, STAGE.markerY, settled));
  return (
    <g opacity={progress(frame, shot, EASE.dissolve)}>
      <Diamond x={centreOf(stage)} y={y} half={10} colour={colour} />
      <Txt role="legend" x={centreOf(stage)} y={STAGE.markerLabelBaseline} anchor="middle" strength={BONE.b100}>
        {label}
      </Txt>
    </g>
  );
};

type RowShot = {label: Anim; value: Anim};

/** The findings of one study: its short name beside its marker, then one row for each finding. */
const Findings: React.FC<{
  block: 0 | 1;
  colour: string;
  head: string;
  headShot: Anim;
  rows: readonly Finding[];
  shots: readonly RowShot[];
  frame: number;
}> = ({block, colour, head, headShot, rows, shots, frame}) => {
  const {left, valueRight} = FINDINGS.block[block];
  const headShown = progress(frame, headShot, EASE.dissolve);
  return (
    <>
      {headShown > 0 ? (
        <g opacity={headShown}>
          <Diamond x={left + 8} y={FINDINGS.headBaseline - 7} half={8} colour={colour} />
          <Txt role="legend" x={left + 28} y={FINDINGS.headBaseline}>
            {head}
          </Txt>
        </g>
      ) : null}
      {rows.map(({label, value, note}, i) => {
        const baseline = FINDINGS.rowBaseline[block][i];
        const valueShown = progress(frame, shots[i].value);
        return (
          <React.Fragment key={label}>
            <Txt role="rowLabel" x={left} y={baseline} opacity={progress(frame, shots[i].label, EASE.dissolve)}>
              {label}
            </Txt>
            <Txt role="valueWords" x={valueRight} y={baseline} anchor="end" fill={colour} opacity={valueShown}>
              {value}
            </Txt>
            {note ? (
              <Txt role="note" x={left} y={baseline + FINDINGS.noteBelow} opacity={valueShown}>
                {note}
              </Txt>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** The three stages, the predicted sites, the two markers and the findings of the two studies. */
export const StageLine: React.FC = () => {
  const frame = useCurrentFrame();
  const present = 1 - progress(frame, SHOT.stagesLeave, EASE.dissolve);
  const mark = progress(frame, SHOT.stagesMark, EASE.dissolve);
  if (present <= 0 || mark <= 0) return null;
  const stage = [SHOT.stage1, SHOT.stage2, SHOT.stage3].map((shot) => progress(frame, shot, EASE.dissolve));
  // The predicted sites keep their outline until the first study has spoken.
  const cleared = 1 - progress(frame, SHOT.predictedClear, EASE.dissolve);
  const predicted = [0, progress(frame, SHOT.predicted2) * cleared, progress(frame, SHOT.predicted3) * cleared];
  return (
    <g opacity={present}>
      <FigureMark kind="schematic" x={MARK.x} y={MARK.y} opacity={mark} />
      {STAGES.map((name, index) => (
        <Stage key={name} index={index} shown={stage[index]} predicted={predicted[index]} />
      ))}
      <Connector from={STAGE.left[0]} drawn={progress(frame, SHOT.stage2, EASE.draw)} />
      <Connector from={STAGE.left[1]} drawn={progress(frame, SHOT.stage3, EASE.draw)} />

      {/* The 2017 meta-analysis, in amber, places the loss at acquisition. */}
      <Marker stage={0} colour={PALETTE.amber} label={STUDY.skodzik.short} shot={SHOT.marker1} frame={frame} />
      <Findings
        block={0}
        colour={PALETTE.amber}
        head={STUDY.skodzik.short}
        headShot={SHOT.skodzikHead}
        rows={SKODZIK_FINDINGS}
        shots={[
          {label: SHOT.verbalLabel, value: SHOT.verbalValue},
          {label: SHOT.visualLabel, value: SHOT.visualValue},
          {label: SHOT.retrievalLabel, value: SHOT.retrievalValue},
        ]}
        frame={frame}
      />

      {/* The 2024 study, in the comparison colour, places it at retention. */}
      <Marker stage={1} colour={PALETTE.blueGrey} label={STUDY.pawley.short} shot={SHOT.marker2} frame={frame} />
      <Findings
        block={1}
        colour={PALETTE.blueGrey}
        head={STUDY.pawley.short}
        headShot={SHOT.pawleyHead}
        rows={PAWLEY_FINDINGS}
        shots={[
          {label: SHOT.learningLabel, value: SHOT.learningValue},
          {label: SHOT.recallLabel, value: SHOT.recallValue},
        ]}
        frame={frame}
      />
    </g>
  );
};
