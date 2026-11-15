// The evidence table: the spine of the film.
//
// Script, "The look": "The spine is the evidence table. Three rows: memory,
// attention, dopamine. Three columns: prediction, result, status. It is empty
// at the end of the cold open and complete at the end of Part 3. It is the
// film's progress bar and its summary."
//
// Production path, step 5, "Lock the kit": the evidence table is one of the
// parts every later figure is built from. So this file knows nothing about any
// one part of the film: it takes its geometry, its labels and the progress of
// each of its parts as props, and it never reads a shot list. Cell content is
// placed by each part, inside the rectangles `evidenceTableCells` returns.

import React from 'react';
import {Rule} from './Rule';
import {PALETTE} from './theme';
import {BONE} from './type';
import {Txt} from './Txt';

// -------------------------------------------------------------------- types

/** Where the table sits on the canvas. All values are whole canvas px. */
export type EvidenceTableGeometry = {
  /**
   * The vertical edges, left to right: the stub's left edge, then the right
   * edge of the stub and of each column. Four columns of cells (the stub and
   * three body columns) need five edges.
   */
  columnEdges: readonly number[];
  /**
   * The horizontal edges, top to bottom: the top rule, the header rule, then
   * the bottom of each body row. The last one is the bottom rule.
   */
  rowEdges: readonly number[];
  /** Distance from a cell's left edge to the left edge of its text. */
  textInset: number;
  /** Distance from the row id's left edge to the row name's left edge. */
  nameOffset: number;
  /** Distance from the top rule to the baseline of the column heads. */
  headBaselineOffset: number;
  /** Distance from the top of a body row to the baseline of its id and name. */
  rowBaselineOffset: number;
};

/** One row of the table: its id ("H1") and its name ("MEMORY"), set in two strengths. */
export type EvidenceTableRowLabel = {id: string; name: string};

/**
 * Draw progress of each group of rules, 0 to 1 (already eased by the caller).
 * Horizontal rules draw left to right, column rules top to bottom.
 */
export type EvidenceTableDraw = {
  top: number;
  header: number;
  rows: number;
  bottom: number;
  columns: number;
};

/** A body cell, in canvas px. */
export type EvidenceTableCell = {x: number; y: number; width: number; height: number};

type Props = {
  geometry: EvidenceTableGeometry;
  /** One per body row, top to bottom. */
  rows: readonly EvidenceTableRowLabel[];
  /** One per body column, left to right. */
  columns: readonly string[];
  draw: EvidenceTableDraw;
  /** Dissolve progress of each row's id and name, 0 to 1, in the order of `rows`. */
  rowLabels: readonly number[];
  /** Dissolve progress of each column head, 0 to 1, in the order of `columns`. */
  columnLabels: readonly number[];
  /**
   * Strength of the whole table, rules and labels alike, 0 to 1. Under a title
   * the table dims but does not leave: "The table dims."
   */
  opacity?: number;
  /** Cell content, placed by the caller inside `evidenceTableCells(geometry)`. */
  children?: React.ReactNode;
};

// ---------------------------------------------------------------- the frame

/**
 * Weights and colours of the rules, as in a printed table: a heavy rule at
 * the top and the bottom, a light one under the heads. Those three are the
 * frame of the table and are bone. The grid between the cells is a secondary
 * line and is graphite. Every weight is a whole number of pixels, so every
 * rule is crisp.
 */
const RULE = {
  frame: {weight: 2, colour: PALETTE.bone},
  header: {weight: 1, colour: PALETTE.bone},
  grid: {weight: 1, colour: PALETTE.graphite},
} as const;

/**
 * The body cells, row by row. They exclude the stub and the header row. A
 * later part places its text inside these rectangles.
 */
export const evidenceTableCells = (geometry: EvidenceTableGeometry): EvidenceTableCell[][] => {
  const {columnEdges, rowEdges} = geometry;
  // The first column edge pair is the stub, the first row edge pair the header.
  const bodyRowTops = rowEdges.slice(1, -1);
  const bodyColumnLefts = columnEdges.slice(1, -1);
  return bodyRowTops.map((top, row) =>
    bodyColumnLefts.map((left, column) => ({
      x: left,
      y: top,
      width: columnEdges[column + 2] - left,
      height: rowEdges[row + 2] - top,
    })),
  );
};

/**
 * The evidence table: its rules, its column heads and its row ids and names.
 * The row id is set at B56 and the name at B100, so the hypothesis reads
 * first and its number second. The three rows carry equal weight.
 */
export const EvidenceTable: React.FC<Props> = ({
  geometry,
  rows,
  columns,
  draw,
  rowLabels,
  columnLabels,
  opacity = 1,
  children,
}) => {
  if (opacity <= 0) return null;
  const {columnEdges, rowEdges, textInset, nameOffset, headBaselineOffset, rowBaselineOffset} = geometry;
  const left = columnEdges[0];
  const right = columnEdges[columnEdges.length - 1];
  const top = rowEdges[0];
  const bottom = rowEdges[rowEdges.length - 1];
  const headerRule = rowEdges[1];
  // The rules between body rows: every row edge after the header rule except the bottom rule.
  const rowRules = rowEdges.slice(2, -1);
  // The rules between cells: every column edge except the outer two. The
  // table is open at its sides, as a printed table is.
  const columnRules = columnEdges.slice(1, -1);
  const width = right - left;
  // A frame rule is centred on its edge. A hairline fills the pixel row or
  // column of its edge.
  const frameTop = top - RULE.frame.weight / 2;
  const frameBottom = bottom - RULE.frame.weight / 2;
  return (
    <g opacity={opacity}>
      {/*
        The column rules are drawn first and stop inside the frame, so the
        bone rules cross them unbroken.
      */}
      {columnRules.map((x) => (
        <Rule
          key={x}
          x={x}
          y={frameTop + RULE.frame.weight}
          length={frameBottom - frameTop - RULE.frame.weight}
          direction="down"
          weight={RULE.grid.weight}
          colour={RULE.grid.colour}
          drawn={draw.columns}
        />
      ))}
      {rowRules.map((y) => (
        <Rule key={y} x={left} y={y} length={width} weight={RULE.grid.weight} colour={RULE.grid.colour} drawn={draw.rows} />
      ))}
      <Rule x={left} y={headerRule} length={width} weight={RULE.header.weight} colour={RULE.header.colour} drawn={draw.header} />
      <Rule x={left} y={frameTop} length={width} weight={RULE.frame.weight} colour={RULE.frame.colour} drawn={draw.top} />
      <Rule x={left} y={frameBottom} length={width} weight={RULE.frame.weight} colour={RULE.frame.colour} drawn={draw.bottom} />
      {columns.map((head, column) => (
        <Txt
          key={head}
          role="tableHead"
          x={columnEdges[column + 1] + textInset}
          y={top + headBaselineOffset}
          opacity={columnLabels[column] ?? 0}
        >
          {head}
        </Txt>
      ))}
      {rows.map(({id, name}, row) => {
        const shown = rowLabels[row] ?? 0;
        if (shown <= 0) return null;
        const x = left + textInset;
        const baseline = rowEdges[row + 1] + rowBaselineOffset;
        return (
          <React.Fragment key={id}>
            <Txt role="tableRow" x={x} y={baseline} strength={BONE.b56} opacity={shown}>
              {id}
            </Txt>
            <Txt role="tableRow" x={x + nameOffset} y={baseline} opacity={shown}>
              {name}
            </Txt>
          </React.Fragment>
        );
      })}
      {children}
    </g>
  );
};
