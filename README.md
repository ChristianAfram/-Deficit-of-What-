# Deficit of What?

A 2D documentary for scientists, therapists and critical readers of evidence,
built as code. Three hypotheses about ADHD, each tested against its own
predictions.

This repository holds the first part: the **cold open and title, 0:00 to
1:17**. It is also the trailer. It is built from script version 3 with five
amendments that came out of a fact-check against the paper.

## Run it

Needs Node 20 or later. The commands are the same in PowerShell, cmd and bash.

```
npm install
npm run studio          # preview in the browser, scrub frame by frame
npm run render          # out/cold-open.mp4, the film: 1920x1080, 24 fps
npm run render:review   # out/cold-open-review.mp4, with captions and a frame counter
npm run stills          # out/stills/ColdOpen/, one PNG every two seconds
npm test                # the checks listed under "What the tests hold in place"
```

The first render downloads the browser that Remotion renders with, once.
Nothing else is fetched: the two typefaces are bundled, and the sound is
synthesised by `scripts/make-audio.mjs` on every render.

## The two builds

| Composition | For | Shows |
| --- | --- | --- |
| `ColdOpen` | Release | The picture and the sound. No captions |
| `ColdOpenReview` | The specialist review, before the voice is recorded | The same picture, with the narration as captions, the sentence id, the frame and the timecode |

There is no voice yet, on purpose. The script records it after the review,
because the review changes lines. Until then the picture runs on a paced
estimate of the narration.

## Read these first

| File | What it is |
| --- | --- |
| `docs/brief-cold-open.md` | The script text for this part, word for word, and the five amendments (A1 to A5) |
| `docs/fact-check-cold-open.md` | Every on-screen claim checked against the paper's full text, and how each open decision was settled |
| `docs/build-spec-cold-open.md` | Layout, type, colour, the shot list frame by frame, camera and sound |

## How the timing works

Nothing in the picture is placed on a frame chosen by hand.

- `src/coldopen/narration.ts` holds the narration, one sentence per entry.
- `src/coldopen/cues.ts` holds `SPEECH`: the start and end frame of each
  sentence. `atWord('s03', 'thirty-seven')` gives the frame where a word starts.
- `src/coldopen/shots.ts` places every mark, every camera move and every sound
  on a spoken word. The value `+37%` cuts on with the word "thirty-seven".

**When the voice is recorded:** put the file under `public/`, pass its path as
the `voice` prop in `src/Root.tsx`, and replace the `SPEECH` table with the
measured times. The picture and the sound follow. Then run `npm test`: the
still rule is checked again against the new timing.

## The still rule

While a number is being spoken, nothing on screen changes: no element arrives,
nothing fades, the camera does not move. A bar has landed before its number is
said, and the note with its interval arrives after. `tests/still-rule.test.ts`
enforces this from the cue tables.

## What the tests hold in place

- The narration is the script word for word, with exactly the one amended
  sentence.
- Every on-screen string uses real minus signs and en dashes, and matches the
  brief.
- The palette is the script's palette, value for value.
- Speech and the written pause span 66 to 72 seconds, and every sentence can
  be said at a calm pace.
- The still rule, the two-second silence, and the order of the shots.

## The kit

Later parts are built from these parts and from nothing else.

| Part | File |
| --- | --- |
| Palette and glyphs | `src/kit/theme.ts` |
| The two typefaces | `src/kit/fonts.ts` |
| Type roles | `src/kit/type.ts`, `src/kit/Txt.tsx` |
| Motion curves and time helpers | `src/kit/time.ts` |
| Camera layers | `src/kit/Layer.tsx` |
| DATA and SCHEMATIC mark | `src/kit/FigureMark.tsx` |
| The evidence table | `src/kit/EvidenceTable.tsx` |
| Citation band, design tag, "Not medical advice" | `src/coldopen/Furniture.tsx` |

## What this film never does

From the script, and binding on every later part:

- A figure that looks like data and is not.
- A number on screen without its citation.
- Wording that can be read as "the medication does not work".
- Faces, children, classrooms, glowing brains, stock footage, pictures of
  pills.

## Licences

- Remotion is free for individuals and for companies of up to three people.
  Larger companies need a licence: <https://remotion.dev/license>.
- Barlow Condensed and Inter are under the SIL Open Font License.
- The sound is synthesised by this repository's own script.
