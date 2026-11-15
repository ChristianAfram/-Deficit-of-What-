import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../kit/fonts';
import {Layer} from '../kit/Layer';
import {GLYPH, PALETTE} from '../kit/theme';
import {timecode} from '../kit/time';
import {BONE, TYPE} from '../kit/type';
import {Txt} from '../kit/Txt';
import {SPEECH, atWord, sentenceAt, type Span} from './cues';
import {BAND, BASELINE, LIVE} from './layout';
import {NARRATION, type SentenceId} from './narration';
import {SHOT, progress} from './shots';
import {CITATION, DESIGN_TAG, NOT_MEDICAL_ADVICE} from './strings';

/**
 * "Always on screen. The citation of the study under discussion, its design
 * tag, and the words 'Not medical advice'." The band never moves with a
 * camera. It is on screen for as long as the trial's figure is, and leaves
 * with it: the word DEFICIT, the evidence table and the title are the film's
 * own and stand under no citation.
 */
const CitationBand: React.FC = () => {
  const frame = useCurrentFrame();
  const present = 1 - progress(frame, SHOT.figureRecedes);
  if (present <= 0) return null;
  const citation = progress(frame, SHOT.citation) * present;
  const tagStrength = BONE.b72 * present;
  // The tag arrives segment by segment, each on the words that name it. All
  // three segments are always laid out, so nothing shifts when one arrives.
  const segments = [
    {text: DESIGN_TAG[0], shown: progress(frame, SHOT.tagDesign)},
    {text: DESIGN_TAG[1], shown: progress(frame, SHOT.tagSample)},
    {text: DESIGN_TAG[2], shown: progress(frame, SHOT.tagDrug)},
  ];
  const tag = TYPE.tag;
  return (
    <>
      <Txt role="citation" x={LIVE.left} y={BASELINE.citation} opacity={citation}>
        {CITATION}
      </Txt>
      <text
        x={LIVE.left}
        y={BASELINE.tag}
        fill={tag.fill}
        style={{
          fontFamily: tag.family,
          fontWeight: tag.weight,
          fontSize: tag.size,
          letterSpacing: `${tag.tracking}em`,
          whiteSpace: 'pre',
        }}
      >
        {segments.map(({text, shown}, i) => (
          <tspan key={text} fillOpacity={shown * tagStrength}>
            {i > 0 ? ` ${GLYPH.middot} ` : ''}
            {text}
          </tspan>
        ))}
      </text>
    </>
  );
};

/** "In every cut, without exception: the words 'Not medical advice'." On every frame, never dimmed. */
const Footer: React.FC = () => (
  <Txt role="footer" x={LIVE.right} y={BASELINE.footer} anchor="end">
    {NOT_MEDICAL_ADVICE}
  </Txt>
);

type Chunk = Span & {text: string};

/** A long sentence is shown in two parts, split at a spoken comma. */
const splitAt = (id: SentenceId, word: string, frame: number): Chunk[] => {
  const text = NARRATION.find((s) => s.id === id)!.text;
  const index = text.indexOf(word);
  return [
    {start: SPEECH[id].start, end: frame, text: text.slice(0, index).trim()},
    {start: frame, end: SPEECH[id].end, text: text.slice(index)},
  ];
};

const CHUNKS: Chunk[] = NARRATION.flatMap(({id, text}): Chunk[] => {
  if (id === 's02') return splitAt(id, 'in randomised', atWord('s02', 'in randomised') - 2);
  if (id === 's03') return splitAt(id, 'and committed', atWord('s03', 'and committed'));
  return [{...SPEECH[id], text}];
});

/**
 * The review build stands in for the voice, which is recorded only after the
 * specialist review. Each caption is on exactly while its words are spoken,
 * and changes only at a sentence boundary, never while a number is spoken.
 */
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const chunk = CHUNKS.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const role = TYPE.caption;
  return (
    <div
      style={{
        position: 'absolute',
        left: 240,
        width: 1440,
        top: BAND.caption[0],
        height: BAND.caption[1] - BAND.caption[0],
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        textAlign: 'center',
        color: PALETTE.bone,
        fontFamily: FONT.text,
        fontWeight: role.weight,
        fontSize: role.size,
        lineHeight: '40px',
      }}
    >
      {chunk.text}
    </div>
  );
};

/** Sentence, frame and timecode, so a reviewer can point at a moment. */
const ReviewOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const sentence = sentenceAt(frame) ?? GLYPH.enDash;
  const dot = ` ${GLYPH.middot} `;
  return (
    <Txt role="review" x={LIVE.left} y={BASELINE.footer}>
      {`REVIEW BUILD${dot}${sentence}${dot}f${String(frame).padStart(4, '0')}${dot}${timecode(frame)}`}
    </Txt>
  );
};

export const Furniture: React.FC<{review: boolean}> = ({review}) => (
  <>
    <Layer>
      <CitationBand />
      <Footer />
      {review ? <ReviewOverlay /> : null}
    </Layer>
    {review ? <Captions /> : null}
  </>
);
