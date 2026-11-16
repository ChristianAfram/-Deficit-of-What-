// The evidence table in beats 1.1 and 1.5.
//
// Script, 1.1: "The evidence table returns. The first cell of row H1 fills."
// 1.5: "The evidence table. Row H1 fills its second and third cells. Hold."
//
// The table carries no DATA or SCHEMATIC mark, and stands under no citation:
// it is the film's own.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  EvidenceCellText,
  EvidenceTable,
  evidenceTableCells,
  type EvidenceTableRowLabel,
} from '../../kit/EvidenceTable';
import {progress} from '../../kit/anim';
import {EASE} from '../../kit/time';
import {TABLE} from '../layout';
import {SHOT} from '../shots';
import {H1, TABLE_COLUMNS, TABLE_ROWS} from '../strings';

/** "H1 MEMORY" is set as two texts in two strengths. The string is split at its first space. */
const ROW_LABELS: readonly EvidenceTableRowLabel[] = TABLE_ROWS.map((row) => {
  const space = row.indexOf(' ');
  return {id: row.slice(0, space), name: row.slice(space + 1)};
});

const [H1_PREDICTION, H1_RESULT, H1_STATUS] = evidenceTableCells(TABLE)[0];

const WHOLE = {top: 1, header: 1, rows: 1, bottom: 1, columns: 1} as const;

/**
 * The table returns whole: it was drawn in the cold open, and here it is
 * shown, not drawn again. It is on screen twice, for the prediction and for
 * the status line, and each cell cuts on with the words that state it.
 */
export const StatusTable: React.FC = () => {
  const frame = useCurrentFrame();
  const forPrediction =
    progress(frame, SHOT.tableReturns, EASE.dissolve) * (1 - progress(frame, SHOT.tableLeaves, EASE.dissolve));
  const forStatus = progress(frame, SHOT.statusTable, EASE.dissolve);
  const strength = Math.max(forPrediction, forStatus);
  if (strength <= 0) return null;
  return (
    <EvidenceTable
      geometry={TABLE}
      rows={ROW_LABELS}
      columns={TABLE_COLUMNS}
      draw={WHOLE}
      rowLabels={[1, 1, 1]}
      columnLabels={[1, 1, 1]}
      opacity={strength}
    >
      <EvidenceCellText
        cell={H1_PREDICTION}
        lines={H1.prediction}
        shown={progress(frame, SHOT.predictionCell)}
        textInset={TABLE.textInset}
      />
      <EvidenceCellText cell={H1_RESULT} lines={H1.result} shown={progress(frame, SHOT.resultCell)} textInset={TABLE.textInset} />
      <EvidenceCellText
        cell={H1_STATUS}
        lines={H1.status}
        shown={[progress(frame, SHOT.statusInvolved), progress(frame, SHOT.statusNotSupported)]}
        textInset={TABLE.textInset}
      />
    </EvidenceTable>
  );
};
