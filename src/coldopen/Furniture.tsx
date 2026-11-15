import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../kit/anim';
import {CitationBand, StandingNote} from '../kit/CitationBand';
import {Layer} from '../kit/Layer';
import {Caption, ReviewOverlay} from '../kit/Review';
import {GLYPH} from '../kit/theme';
import {captionAt} from './captions';
import {PAUSE, TITLE_START, sentenceAt} from './cues';
import {SHOT} from './shots';
import {CITATION, DESIGN_TAG, NOT_MEDICAL_ADVICE} from './strings';

/** What the review overlay says is being spoken: a sentence, the written pause, the title, or nothing. */
const speakingAt = (frame: number): string => {
  if (frame >= TITLE_START) return 'title';
  if (frame >= PAUSE.start && frame < PAUSE.end) return 'pause';
  return sentenceAt(frame) ?? GLYPH.enDash;
};

/**
 * What stands outside the figures: the citation band while the trial is
 * under discussion, "Not medical advice" on every frame, and, in the review
 * build, the narration as captions and a counter.
 */
export const Furniture: React.FC<{review: boolean}> = ({review}) => {
  const frame = useCurrentFrame();
  const caption = review ? captionAt(frame) : undefined;
  return (
    <>
      <Layer>
        <CitationBand
          citation={CITATION}
          citationShown={progress(frame, SHOT.citation)}
          tag={[
            {text: DESIGN_TAG[0], shown: progress(frame, SHOT.tagDesign)},
            {text: DESIGN_TAG[1], shown: progress(frame, SHOT.tagSample)},
            {text: DESIGN_TAG[2], shown: progress(frame, SHOT.tagDrug)},
          ]}
          // The band leaves with the trial's figure, and stays away: the word
          // DEFICIT, the evidence table and the title stand under no citation.
          present={1 - progress(frame, SHOT.figureRecedes)}
        />
        <StandingNote>{NOT_MEDICAL_ADVICE}</StandingNote>
        {review ? <ReviewOverlay frame={frame} speaking={speakingAt(frame)} /> : null}
      </Layer>
      {caption ? <Caption>{caption.text}</Caption> : null}
    </>
  );
};
