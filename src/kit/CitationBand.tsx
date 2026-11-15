import React from 'react';
import {BASELINE, LIVE} from './grid';
import {GLYPH} from './theme';
import {BONE, TYPE} from './type';
import {Txt} from './Txt';

/** One part of a design tag, and how far it has arrived (0 to 1). */
export type TagSegment = {text: string; shown: number};

type Props = {
  /** The citation of the study under discussion. */
  citation: string;
  /** How far the citation has arrived, 0 to 1. */
  citationShown: number;
  /** The design tag, in the parts it arrives in. */
  tag: readonly TagSegment[];
  /** The strength of the whole band, 1 to 0, for when the study leaves the screen. */
  present?: number;
};

/** The middle dot sits at lower-case height. Between capitals it is raised to their middle. */
const DOT_RAISE = 2;

/**
 * Script, "The look": "Always on screen. The citation of the study under
 * discussion, its design tag". The band is on screen for as long as a study
 * is under discussion, and leaves with that study's figure.
 *
 * The tag arrives part by part, each on the words that name it. Every part
 * is always laid out, so nothing shifts when one arrives.
 */
export const CitationBand: React.FC<Props> = ({citation, citationShown, tag, present = 1}) => {
  if (present <= 0) return null;
  const role = TYPE.tag;
  return (
    <>
      <Txt role="citation" x={LIVE.left} y={BASELINE.citation} opacity={citationShown * present}>
        {citation}
      </Txt>
      <text
        x={LIVE.left}
        y={BASELINE.tag}
        fill={role.fill}
        style={{
          fontFamily: role.family,
          fontWeight: role.weight,
          fontSize: role.size,
          letterSpacing: `${role.tracking}em`,
          whiteSpace: 'pre',
        }}
      >
        {tag.map(({text, shown}, i) => (
          <React.Fragment key={text}>
            {i > 0 ? (
              <tspan dy={-DOT_RAISE} fillOpacity={shown * BONE.b72 * present}>{` ${GLYPH.middot} `}</tspan>
            ) : null}
            <tspan dy={i > 0 ? DOT_RAISE : 0} fillOpacity={shown * BONE.b72 * present}>
              {text}
            </tspan>
          </React.Fragment>
        ))}
      </text>
    </>
  );
};

/**
 * Script: "In every cut, without exception: the words 'Not medical advice'."
 * On every frame, in one place, never dimmed.
 */
export const StandingNote: React.FC<{children: string}> = ({children}) => (
  <Txt role="footer" x={LIVE.right} y={BASELINE.footer} anchor="end">
    {children}
  </Txt>
);
