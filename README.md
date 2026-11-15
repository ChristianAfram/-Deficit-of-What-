# Deficit of What?

A 2D documentary for scientists, therapists and critical readers of evidence,
built as code. Three hypotheses about ADHD, each tested against its own
predictions.

This repository holds the first part: the **cold open and title, 0:00 to
1:17**. It is also the trailer. It is built from script version 3 with seven
amendments, which came out of a fact-check against the paper and out of a
specialist review of the finished picture.

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
synthesised by `scripts/make-audio.mjs`.

To look at particular frames:

```
node scripts/render-stills.mjs ColdOpen 610,733,897 out/check
node scripts/render-stills.mjs ColdOpenReview every=24
```

## The two builds

| Composition | For | Shows |
| --- | --- | --- |
| `ColdOpen` | Release | The picture and the sound. No captions |
| `ColdOpenReview` | The specialist review, before the voice is recorded | The same picture, with the narration as captions, and what is being spoken, the frame and the timecode |

There is no voice yet, on purpose. The script records it after the review,
because the review changes lines. Until then the picture runs on a paced
estimate of the narration.

## Read these first

| File | What it is |
| --- | --- |
| `docs/brief-cold-open.md` | The script text for this part, word for word, and the seven amendments (A1 to A7) |
| `docs/fact-check-cold-open.md` | Every on-screen claim checked against the paper's full text, twice, and how each open decision was settled |
| `docs/cue-sheet.md` | When every sentence is spoken and every mark appears, frame by frame. Generated from the code |
| `docs/build-spec-cold-open.md` | The design: layout, type, colour, and the changes made after the build and the review |

## How the timing works

Nothing in the picture is placed on a frame chosen by hand.

- `src/coldopen/narration.ts` holds the narration, one sentence per entry.
- `src/coldopen/cues.ts` holds `SPEECH`, the start and end frame of each
  sentence. `atWord('s03', 'thirty-seven')` gives the frame where a word
  starts.
- `src/coldopen/shots.ts` places every mark and every sound on a spoken word.
  The value `+37%` cuts on with the word "thirty-seven".

**When the voice is recorded:**

1. Put the file under `public/` and pass its path as the `voice` prop in
   `src/Root.tsx`.
2. In `src/coldopen/cues.ts`, replace `SPEECH` with the measured start and end
   of each sentence, and fill `WORD_ONSETS` with the measured start of each
   word that a cue names. Until a word has a measured start, its start is
   estimated from its place in its sentence.
3. Run `npx vitest run -u`. The still rule and the order of the shots are
   checked against the new timing, and `docs/cue-sheet.md` is regenerated.

The length of the film and the start of the title are fixed by the script. If
the recorded voice runs longer than 1:12, they change in `cues.ts` too.

## The still rule

While a number is being spoken, nothing on screen changes: no element arrives
and nothing fades. A bar has landed before its number is said. The value cuts
on with its number, together with the interval the paper reports for it.
`tests/still-rule.test.ts` enforces this from the cue tables, for the picture
and for the captions of the review build.

## What the tests hold in place

- The narration is the script word for word, with exactly the two amended
  sentences.
- Every on-screen string uses real minus signs and en dashes, and matches the
  brief.
- The bundled typefaces contain every special character the film sets, and
  the text face sets tabular figures.
- The palette is the script's palette, value for value.
- Speech and the written pause span 66 to 72 seconds, and every sentence can
  be said at a calm pace.
- The still rule, the two-second silence, and the order of the shots.
- `docs/cue-sheet.md` is the cue sheet the code produces.

## The kit

Later parts are built from these parts.

| Part | File |
| --- | --- |
| Palette and glyphs | `src/kit/theme.ts` |
| The two typefaces | `src/kit/fonts.ts` |
| Type roles, and text set by its baseline | `src/kit/type.ts`, `src/kit/Txt.tsx` |
| The grid of every frame | `src/kit/grid.ts` |
| Motion curves, and animations as data | `src/kit/time.ts`, `src/kit/anim.ts` |
| Layers | `src/kit/Layer.tsx` |
| Citation line, design tag, "Not medical advice" | `src/kit/CitationBand.tsx` |
| DATA and SCHEMATIC mark | `src/kit/FigureMark.tsx` |
| A row of a data figure: label, bar, value, note | `src/kit/BarRow.tsx` |
| Rules that land on whole pixels | `src/kit/Rule.tsx` |
| The evidence table | `src/kit/EvidenceTable.tsx` |
| Captions and the counter of a review build | `src/kit/Review.tsx` |

Not in the kit yet, because no finished part needs them: a row with a point
estimate and its interval drawn as a whisker, and text inside a cell of the
evidence table.

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
