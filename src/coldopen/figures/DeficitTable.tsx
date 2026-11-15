// The word DEFICIT and the empty evidence table, in layer T. Build spec,
// section 2.2 (T01 to T10), section 4 (K12, K13) and section 5, shots 4 and 5.
//
// Script, picture: "Then the diagram recedes, the word DEFICIT is set large,
// and an empty table draws under it: three rows, three columns. It stays
// empty." Then, at the title: "The table dims."
//
// DEFICIT and the table carry no DATA or SCHEMATIC mark: they are neither data
// nor a schematic (spec, section 8.1).

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EvidenceTable, type EvidenceTableGeometry, type EvidenceTableRowLabel} from '../../kit/EvidenceTable';
import {EASE, mix} from '../../kit/time';
import {Txt} from '../../kit/Txt';
import {SHOT, TITLE_DIM, progress} from '../shots';
import {DEFICIT_WORD, TABLE_COLUMNS, TABLE_ROWS} from '../strings';

// ------------------------------------------------------------------ geometry

/** T01. DEFICIT is centred on the canvas, on baseline 400 (cap top about 260). */
const DEFICIT_CENTRE_X = 960;
const DEFICIT_BASELINE = 400;
/**
 * T01. Txt centres the word by its advance, tracking corrected. At 200 px the
 * side bearings of D (left) and T (right) differ, so the ink of the word sat
 * 2.6 px right of 960 in the render (ink 679.3–1246.0). This moves the ink, not
 * the advance, onto the centre line: the title that takes its place is centred
 * the same way.
 */
const DEFICIT_INK_CORRECTION = -2.5;

/**
 * T02 to T10. The cold open's table.
 * Columns: stub 360–660, PREDICTION 660–960, RESULT 960–1260, STATUS 1260–1560.
 * Rows: header 456–512, H1 512–592, H2 592–672, H3 672–752.
 */
const TABLE: EvidenceTableGeometry = {
  /** T02 to T06. The table spans x 360–1560; column rules at 660, 960, 1260 (T06). */
  columnEdges: [360, 660, 960, 1260, 1560],
  /** T02 top rule 456, T03 header rule 512, T04 row rules 592 and 672, T05 bottom rule 752. */
  rowEdges: [456, 512, 592, 672, 752],
  /** T07, T08. Heads start at 676 / 976 / 1276 and row ids at 376: 16 px inside their cell. */
  textInset: 16,
  /** T09. Row names start at x 416, 40 px after the row id at 376. */
  nameOffset: 40,
  /** T07. Column heads on baseline 492, 36 px below the top rule. */
  headBaselineOffset: 36,
  /** T08, T09. Row ids and names on baselines 561 / 641 / 721, 49 px below each row's top. */
  rowBaselineOffset: 49,
};

/**
 * T08, T09. "H1 MEMORY" is set as two texts in two strengths: the id at B56
 * and the name at B100. The string is split at its first space.
 */
const ROW_LABELS: readonly EvidenceTableRowLabel[] = TABLE_ROWS.map((row) => {
  const space = row.indexOf(' ');
  return {id: row.slice(0, space), name: row.slice(space + 1)};
});

// ---------------------------------------------------------------- components

/**
 * T01. "The word DEFICIT is set large." It cuts on, on the spoken word "a
 * deficit", with no fade. At the title it dissolves out, so that the title
 * can take its place; the table under it only dims.
 */
const DeficitWord: React.FC<{frame: number}> = ({frame}) => {
  const shown = progress(frame, SHOT.deficit) * (1 - progress(frame, SHOT.deficitOut, EASE.dissolve));
  return (
    <Txt role="deficit" x={DEFICIT_CENTRE_X + DEFICIT_INK_CORRECTION} y={DEFICIT_BASELINE} anchor="middle" opacity={shown}>
      {DEFICIT_WORD}
    </Txt>
  );
};

/** The word DEFICIT and the empty evidence table. Build spec, T01 to T10. */
export const DeficitTable: React.FC = () => {
  const frame = useCurrentFrame();
  // The rules draw in the order of the shot list, and the empty three-by-three
  // grid is complete before any label arrives: the table is drawn whole
  // before it is filled in, and no hypothesis is drawn ahead of another.
  const draw = {
    top: progress(frame, SHOT.tableTopRule, EASE.draw),
    header: progress(frame, SHOT.tableHeaderRule, EASE.draw),
    rows: progress(frame, SHOT.tableRowRules, EASE.draw),
    bottom: progress(frame, SHOT.tableBottomRule, EASE.draw),
    columns: progress(frame, SHOT.tableColumnRules, EASE.draw),
  };
  // Each row arrives on its spoken name: "A deficit of memory. A deficit of
  // attention. A deficit of dopamine."
  const rowLabels = [SHOT.rowMemory, SHOT.rowAttention, SHOT.rowDopamine].map((shot) =>
    progress(frame, shot, EASE.dissolve),
  );
  // "Each makes predictions that can be checked." PREDICTION lands on
  // "predictions"; RESULT and STATUS land together on "checked".
  const prediction = progress(frame, SHOT.headPrediction, EASE.dissolve);
  const resultAndStatus = progress(frame, SHOT.headResultStatus, EASE.dissolve);
  // "The table dims." Rules and labels go to 20 % together and stay there
  // under the title, to the last frame.
  const strength = mix(1, TITLE_DIM.table, progress(frame, SHOT.tableDims, EASE.dissolve));
  return (
    <g>
      <DeficitWord frame={frame} />
      {/* T10. No children: every body cell stays empty ground. "It stays empty." */}
      <EvidenceTable
        geometry={TABLE}
        rows={ROW_LABELS}
        columns={TABLE_COLUMNS}
        draw={draw}
        rowLabels={rowLabels}
        columnLabels={[prediction, resultAndStatus, resultAndStatus]}
        opacity={strength}
      />
    </g>
  );
};
