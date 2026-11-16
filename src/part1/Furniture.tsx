import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../kit/anim';
import {CitationBand, StandingNote} from '../kit/CitationBand';
import {Layer} from '../kit/Layer';
import {Caption, ReviewOverlay} from '../kit/Review';
import {GLYPH} from '../kit/theme';
import {captionAt} from './captions';
import {beatAt, sentenceAt} from './cues';
import {BANDS} from './shots';
import {NOT_MEDICAL_ADVICE, STUDY} from './strings';

/** What the review overlay says is on screen: the beat, and the sentence being spoken or a dash. */
const speakingAt = (frame: number): string => `${beatAt(frame)} ${GLYPH.middot} ${sentenceAt(frame) ?? GLYPH.enDash}`;

/**
 * What stands outside the figures: the citation of the study under
 * discussion, "Not medical advice" on every frame, and, in the review build,
 * the narration as captions and a counter.
 */
export const Furniture: React.FC<{review: boolean}> = ({review}) => {
  const frame = useCurrentFrame();
  const caption = review ? captionAt(frame) : undefined;
  return (
    <>
      <Layer>
        {BANDS.map(({study, cite, tag, leaves}) => (
          <CitationBand
            key={study}
            citation={STUDY[study].citation}
            citationShown={progress(frame, cite)}
            tag={[{text: STUDY[study].tag, shown: progress(frame, tag)}]}
            present={1 - progress(frame, leaves)}
          />
        ))}
        <StandingNote>{NOT_MEDICAL_ADVICE}</StandingNote>
        {review ? <ReviewOverlay frame={frame} speaking={speakingAt(frame)} /> : null}
      </Layer>
      {caption ? <Caption>{caption.text}</Caption> : null}
    </>
  );
};
