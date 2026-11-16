# Deficit of What?

A 2D documentary for scientists, therapists and critical readers of evidence,
built as code. Three hypotheses about ADHD, each tested against its own
predictions.

This repository holds two parts, built from script version 3:

| Part | In the film | Built with |
| --- | --- | --- |
| The **cold open and title**. It is also the trailer | 0:00 to 1:17 | Eight amendments, from a fact-check against the paper and a specialist review of the finished picture |
| **Part 0 and Part 1**: the two limits, and hypothesis one, a deficit of memory | 1:17 to 4:33 | Fourteen amendments, from a fact-check against seven papers. Not yet reviewed by a specialist |

## Run it

Needs Node 20 or later. The commands are the same in PowerShell, cmd and bash.

```
npm install
npm run studio          # preview in the browser, scrub frame by frame
npm run render          # out/cold-open.mp4, the film: 1920x1080, 24 fps
npm run render:review   # out/cold-open-review.mp4, with captions and a frame counter
npm run render:part1          # out/part-1.mp4
npm run render:part1:review   # out/part-1-review.mp4
npm run stills          # out/stills/ColdOpen/, one PNG every two seconds
npm run check:freeze    # Part 1: the still rule, checked on rendered pixels
npm test                # the checks listed under "What the tests hold in place"
```

The first render downloads the browser that Remotion renders with, once.
Nothing else is fetched: the two typefaces are bundled, and the sound is
synthesised by `scripts/make-audio.mjs`.

To look at particular frames (quote the list: PowerShell reads a bare
`610,733` as two arguments):

```
node scripts/render-stills.mjs ColdOpen "610,733,897" out/check
node scripts/render-stills.mjs ColdOpenReview every=24
node scripts/render-stills.mjs ColdOpen "1044" out/joined --standalone=false
```

The last line shows the cold open as it sits in the joined film, without the
limits note. Part 1 renders the same way:

```
node scripts/render-stills.mjs Part1Review "600,2050,2900,4140,4600" out/check
```

## The two builds of each part

| Composition | For | Shows |
| --- | --- | --- |
| `ColdOpen`, `Part1` | Release | The picture and the sound. No captions |
| `ColdOpenReview`, `Part1Review` | The specialist review, before the voice is recorded | The same picture, with the narration as captions, and what is being spoken, the frame and the timecode |

There is no voice yet, on purpose. The script records it after the review,
because the review changes lines. Until then the picture runs on a paced
estimate of the narration.

## Read these first

| File | What it is |
| --- | --- |
| `docs/brief-cold-open.md` | The script text for this part, word for word, and the eight amendments (A1 to A8) |
| `docs/fact-check-cold-open.md` | Every on-screen claim checked against the paper's full text, twice, and how each open decision was settled |
| `docs/cue-sheet.md` | When every sentence is spoken and every mark appears, frame by frame. Generated from the code |
| `docs/build-spec-cold-open.md` | The design: layout, type, colour, and the changes made after the build and the review |
| `docs/brief-part-1.md` | The script text for Part 0 and Part 1, word for word, the fourteen amendments (P1 to P14) and the decisions of the build |
| `docs/fact-check-part-1.md` | Every on-screen string and every sentence of Part 0 and Part 1 against the papers: what was read in full, what only as an abstract, and what is still open |
| `docs/cue-sheet-part-1.md` | The cue sheet of Part 0 and Part 1. Generated from the code |

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
   `docs/cue-sheet.md` lists every word to measure, under the key to enter it
   by. A key that no cue asks for fails a test.
3. Run `npx vitest run -u`. The still rule and the order of the shots are
   checked against the new timing, and `docs/cue-sheet.md` is regenerated.

The length of the film and the start of the title are fixed by the script. If
the recorded voice runs longer than 1:12, they change in `cues.ts`, and in
`tests/cues.test.ts`, which pins both.

Part 1 works the same way, in `src/part1/`, on a cue machinery that any later
part can use (`src/kit/cues.ts`). Its beats start where the script starts
them, and its sentence times are paced from the narration. When its voice is
recorded, the measured sentence times go into `MEASURED_SPEECH` and the
measured word starts into `WORD_ONSETS`, both in `src/part1/cues.ts`.
`docs/cue-sheet-part-1.md` lists every word to measure.

## The still rule

While a number is being spoken, nothing on screen changes: no element arrives
and nothing fades. A bar has landed before its number is said. The value cuts
on with its number, together with the interval the paper reports for it.
`tests/still-rule.test.ts` enforces this from the cue tables, for the picture
and for the captions of the review build. `tests/part1-still-rule.test.ts` does
the same for Part 1, and `npm run check:freeze` renders the first, a middle and
the last frame of each of its fourteen freeze windows and compares them byte
for byte.

## What the tests hold in place

- The narration is the script word for word, with exactly the three amended
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

For Part 0 and Part 1, the same, and:

- The narration is the script word for word, with exactly the four amended
  sentences, and every on-screen string is in the brief.
- Every forest row prints the estimate and the interval it is drawn from, and
  a row whose paper was not read draws no mark.
- Every beat starts where the script starts it, and the two loops of the
  ledger open and pay near the times the ledger gives.
- One study stands in the citation band at a time, and the film's own figures
  stand under none.
- Measured from the bundled fonts: every label is clear of the column beside
  it, and every line of a table cell fits its cell.

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
| The evidence table, and the text of a filled cell | `src/kit/EvidenceTable.tsx` |
| A row of a forest plot: label, estimate, interval, whisker | `src/kit/ForestRow.tsx` |
| A check box that can fail | `src/kit/CheckBox.tsx` |
| Pacing, and cues placed on spoken words | `src/kit/cues.ts` |
| Captions and the counter of a review build | `src/kit/Review.tsx` |

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
