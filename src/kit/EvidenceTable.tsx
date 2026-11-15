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
import {PALETTE} from './theme';
import {BONE} from './type';
import {Txt} from './Txt';

// -------------------------------------------------------------------- types

/**
 * Where the table sits on the canvas. All values are canvas px.
 * Build spec, T02 to T10 (the cold open's values are given there).
 */
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
  /** Distance from a cell's left edge to the left edge of its text (T07, T08). */
  textInset: number;
  /** Distance from the row id's left edge to the row name's left edge (T08 to T09). */
  nameOffset: number;
  /** Distance from the top rule to the baseline of the column heads (T07). */
  headBaselineOffset: number;
  /** Distance from the top of a body row to the baseline of its id and name (T08, T09). */
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
 * Stroke weights and colours of the rules (K04, K05). The frame of the table
 * (top, header and bottom rules) is an axis and is bone. The grid between the
 * cells (row and column rules) is a secondary line and is graphite.
 */
const RULE = {
  /** T02. */
  top: {weight: 2, colour: PALETTE.bone},
  /** T03. */
  header: {weight: 1.5, colour: PALETTE.bone},
  /** T04. */
  row: {weight: 1, colour: PALETTE.graphite},
  /** T05. */
  bottom: {weight: 2, colour: PALETTE.bone},
  /** T06. */
  column: {weight: 1, colour: PALETTE.graphite},
} as const;

type RuleStyle = (typeof RULE)[keyof typeof RULE];

/**
 * The nine body cells, row by row (three rows of three cells). They exclude
 * the stub and the header row. In the cold open every one of them is empty
 * ground: "It stays empty."
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

/** A horizontal rule across the table, drawn left to right. Nothing is drawn before it starts. */
const HorizontalRule: React.FC<{y: number; left: number; right: number; drawn: number; style: RuleStyle}> = ({
  y,
  left,
  right,
  drawn,
  style,
}) => {
  if (drawn <= 0) return null;
  return (
    <rect
      x={left}
      y={y - style.weight / 2}
      width={(right - left) * drawn}
      height={style.weight}
      fill={style.colour}
    />
  );
};

/** A column rule from the top rule to the bottom rule, drawn top to bottom. */
const ColumnRule: React.FC<{x: number; top: number; bottom: number; drawn: number}> = ({x, top, bottom, drawn}) => {
  if (drawn <= 0) return null;
  return (
    <rect
      x={x - RULE.column.weight / 2}
      y={top}
      width={RULE.column.weight}
      height={(bottom - top) * drawn}
      fill={RULE.column.colour}
    />
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
  return (
    <g opacity={opacity}>
      <HorizontalRule y={top} left={left} right={right} drawn={draw.top} style={RULE.top} />
      <HorizontalRule y={headerRule} left={left} right={right} drawn={draw.header} style={RULE.header} />
      {rowRules.map((y) => (
        <HorizontalRule key={y} y={y} left={left} right={right} drawn={draw.rows} style={RULE.row} />
      ))}
      <HorizontalRule y={bottom} left={left} right={right} drawn={draw.bottom} style={RULE.bottom} />
      {columnRules.map((x) => (
        <ColumnRule key={x} x={x} top={top} bottom={bottom} drawn={draw.columns} />
      ))}
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
