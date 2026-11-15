# Deficit of What? Build spec: cold open and title (frames 0–1847)

Merged spec. Binding sources: `docs/brief-cold-open.md` ("From the script" and amendments A1 to A5) and the fact-check. The base is Proposal 1 (printed-figure lens): fixed bands, a closed axis for the null row, the verification gate and the layer model. Grafted onto it:
- from Proposal 2 (sync lens): the still rule and its build lint, cut-on values on the number's first frame, and a camera that stops before a result is spoken;
- from Proposal 3 (skeptic lens): reuse of the existing kit and fonts, a mark that arrives before its figure, condition fills of equal luminance, a separate camera layer per figure, and the reading of the fact-check.

Every timing has been re-derived for amendment A1.

The repository already holds the kit that this spec uses unchanged: `src/kit/theme.ts` (palette, glyphs), `src/kit/time.ts` (`EASE`, `ramp`, `timecode`), `src/coldopen/strings.ts` (every on-screen string, A1–A4 applied), `src/coldopen/narration.ts` (narration with A1) and `src/coldopen/cues.ts` (`SPEECH`, `atWord`). The only data change this spec asks for in `cues.ts` is the `SPEECH` table in §1.2.

## 0. Conventions

- **C1. Frames.** Frames are 0-based integers at 24 fps; seconds = frame / 24. An animation written "a–b" starts on frame a (progress 0) and is complete on frame b (progress 1). This is `ramp(frame, a, b − a, easing)`. Frames after b are identical to b.
- **C2. Cuts.** A "cut on at c" is an instant change: hidden on c − 1, final on c.
- **C3. Coordinates.** Pixels on the 1920×1080 canvas, origin top left. For text, `y` is the **baseline**. Each text box is given as x (anchor and alignment), baseline, width (estimated advance; measured at build, and the stated maximum width is binding) and height (the line box: ascender to descender, 1.25 × px size unless stated).
- **C4. Easings.** Only the kit's three:
  - **draw** = `EASE.draw`, for strokes and bars;
  - **dis** = `EASE.dissolve`, for every opacity change;
  - **lin** = `EASE.linear`, for the camera only.
  Nothing springs, bounces or overshoots.
- **C5. Characters.** Minus is U+2212, ranges use U+2013, separators are U+00B7 with spaces, and the multiplication sign is U+00D7. All of them are in the fontsource `latin` subset of both families.
- **C6. Opacity tiers of bone.** **B100**, **B72** (8.1:1 on ground), **B56** (5.3:1). Graphite (3.0:1) is never used for text.
- **C7. Layers**, bottom to top:
  - **F**, furniture: citation band, footer and caption band. No camera.
  - **D**: diagram, result rows and limits note. It has camera D.
  - **T**: DEFICIT and the table. It has camera T.
  - **H**: the title. No camera.
- **C8. The still rule** (from Proposal 2, extended to "Three"). While a number is being spoken, nothing on screen changes. That covers elements, opacity and camera; captions change only at sentence boundaries, so they never change inside a freeze.
  - **Freeze window.** It runs from the onset of the numeral phrase to the onset of the next word + 6 frames, written `[f0, f1]`.
  - **Animations.** Each animation a–b must satisfy b ≤ f0 or a ≥ f1. A cut at c needs c ≤ f0 or c ≥ f1.
  - **Result values.** For these, camera D also stops by f0 − 6.
  - **Spoken numerals shown on screen** (2022, 173, 3 WEEKS, +37%, −53%) are final on screen by frame f0.
  - **Lint.** `tests/still-rule.test.ts` asserts all of this from the cue tables, so a recorded voice that moves a word re-checks itself.

## 1. Cue sheet

### 1.1 Pacing

- **Word count.** 144 words with A1 (s03 is now 23 words).
- **Pure speech at 138 wpm.** That is 1502.6 frames. Each sentence's share is half by words and half by syllables (hand count: 258 syllables; s03 = 50). This stops short sentences from being rushed.
- **s13.** "This film checks them." is lengthened to 40 frames, a deliberate closing line.
- **Totals.** Speech lasts 1509 frames, which is **137.4 wpm**. The first word starts at 36 and the last ends at 1715: **1679 frames = 69.96 s**, the 2-second pause included. That is inside 66–72 s.
- **Anchors.** L01 "Learning did not follow." runs 1086–1124 (0:45.25–0:46.83). L00 is at 1632 (1:08.0) on "predictions", with the column heads landing. The title starts at 1728 (1:12).
- **Existing tests pass on these numbers.** Every sentence is between 2.2 and 5.2 vowel-group syllables a second (lowest s13 2.40, highest s11 4.91), the rate is 125–150 wpm, and s06 starts within 1.5 s of 0:45.

### 1.2 Sentences (this is the new `SPEECH` table in `cues.ts`)

| id | Narration (verbatim, A1 applied) | Words | Start | End | Dur | Start–end (s) | Gap after |
|---|---|---|---|---|---|---|---|
| — | Pre-roll: black, footer, citation alone | — | 0 | 36 | 36 | 0.00–1.50 | — |
| s01 | In 2022, a triple-masked crossover trial tested an assumption that had rarely been tested directly. | 15 | 36 | 205 | 169 | 1.50–8.54 | 14 |
| s02 | One hundred and seventy-three children with ADHD received extended-release methylphenidate for three weeks and placebo for three weeks, in randomised order, while being taught academic content in small groups. | 29 | 219 | 533 | 314 | 9.13–22.21 | 14 |
| s03 | Under methylphenidate, the children completed thirty-seven percent more arithmetic problems per minute of seatwork, and committed fifty-three percent fewer rule violations per hour. | 23 | 547 | 813 | 266 | 22.79–33.88 | 20 |
| s04 | The amount of content the children learned did not differ between conditions. | 12 | 833 | 951 | 118 | 34.71–39.63 | **48 = written pause** |
| P1 | *(pause, 2 seconds)*: the first of the film's five silences | — | 951 | 999 | 48 | 39.63–41.63 | — |
| s05 | The drug did what it is known to do. | 9 | 999 | 1072 | 73 | 41.63–44.67 | 14 |
| s06 | Learning did not follow. **(L01)** | 4 | 1086 | 1124 | 38 | 45.25–46.83 | 14 |
| s07 | The expectation that it would follow rests on a model carried in the name of the diagnosis: a deficit. | 19 | 1138 | 1324 | 186 | 47.42–55.17 | 10 |
| s08 | Three candidates recur, in clinical explanation and in public belief. | 10 | 1334 | 1444 | 110 | 55.58–60.17 | 10 |
| s09 | A deficit of memory. | 4 | 1454 | 1498 | 44 | 60.58–62.42 | 6 |
| s10 | A deficit of attention. | 4 | 1504 | 1548 | 44 | 62.67–64.50 | 6 |
| s11 | A deficit of dopamine. | 4 | 1554 | 1598 | 44 | 64.75–66.58 | 8 |
| s12 | Each makes predictions that can be checked. **(L00 at 1632)** | 7 | 1606 | 1669 | 63 | 66.92–69.54 | 6 |
| s13 | This film checks them. | 4 | 1675 | 1715 | 40 | 69.79–71.46 | 13 → title |
| T | Title beat, no speech | — | 1728 | 1848 | 120 | 72.00–77.00 | end |

### 1.3 Word onsets

Word onsets come from `atWord` (character share within the sentence), so the code computes exactly these frames from the table above.

| Word | Onset | Word | Onset |
|---|---|---|---|
| s01 "2022" | 41 (1.71) | s03 "thirty-seven percent more" | **615** (25.63) |
| s01 "a" (after 2022) | 50 | s03 "arithmetic" | 653 |
| s01 "triple-masked" | 55 | s03 "per minute" | 682 |
| s02 "One hundred" | **219** (9.13) | s03 "seatwork" | 703 (29.29) |
| s02 "children" | 264 | s03 "and committed" | 717 |
| s02 "with" | 278 | s03 "fifty-three percent fewer" | **738** (30.75) |
| s02 "methylphenidate" | 332 | s03 "rule" | 776 |
| s02 "three weeks" (1st) | **362** (15.08) | s03 "violations" | 784 |
| s02 "and placebo" | 380 | s04 "content" | 854 |
| s02 "three weeks" (2nd) | **404** (16.83) | s04 "did not differ" | 899 (37.46) |
| s02 "in randomised" | 423 | s04 "between" | 922 |
| s02 "order" | 444 | s05 "did what" | 1017 |
| s02 "small groups" | 513 | s07 "name" | 1264 |
| s03 "Under" | 547 | s07 "deficit" | 1309 (54.54) |
| s03 "the children" | 581 | s08 "Three" | **1334** (55.58) |
| s03 "completed" | 600 | s08 "candidates" | 1344 |
| s09 "memory" | 1483 | s12 "predictions" | 1622 (67.58) |
| s10 "attention" | 1529 | s12 "checked" | 1657 |
| s11 "dopamine" | 1580 | s13 "This" | 1675 |

### 1.4 Freeze windows (C8)

| Freeze | Numeral phrase | f0 | f1 | Seconds |
|---|---|---|---|---|
| F1 | "2022" | 41 | 56 | 1.71–2.33 |
| F2 | "One hundred and seventy-three" | 219 | 270 | 9.13–11.25 |
| F3 | "three weeks" (1st) | 362 | 386 | 15.08–16.08 |
| F4 | "three weeks," (2nd) | 404 | 429 | 16.83–17.88 |
| F5 | "thirty-seven percent more" (camera D still from 609) | 615 | 659 | 25.63–27.46 |
| F6 | "fifty-three percent fewer" | 738 | 782 | 30.75–32.58 |
| F7 | "Three" (candidates) | 1334 | 1350 | 55.58–56.25 |

### 1.5 Caption chunks (review build only)

- **Timing.** Each chunk is on for exactly its span, with a hard cut on and off. Captions never show in gaps or in P1.
- **s02** is split into two chunks:
  - 219–421: "One hundred and seventy-three children with ADHD received extended-release methylphenidate for three weeks and placebo for three weeks,"
  - 421–533: "in randomised order, while being taught academic content in small groups."
- **s03** is split into two chunks:
  - 547–717: "Under methylphenidate, the children completed thirty-seven percent more arithmetic problems per minute of seatwork,"
  - 717–813: "and committed fifty-three percent fewer rule violations per hour."
- **Every other sentence** is one chunk of at most two lines.

When the voice is recorded, a forced alignment replaces `SPEECH` and the onsets. Every cue below is keyed as (sentence, word, offset), and the lint runs again.

## 2. Layout (1920×1080)

### 2.1 Grid and fixed bands

- **Live width.** x 128–1792 (margins of 128 px). The worst camera push maps x 128 to 103 and x 1792 to 1817, both inside title-safe (96–1824).
- **Alignment verticals:**
  - x 128: every left edge;
  - x 432: start of the blocks;
  - x 944: right edge of the value column;
  - x 1380: the zero line;
  - x 1792: right edge.

| Band | y range | Contents | Same in both builds |
|---|---|---|---|
| Citation band (F) | 48–148 | Citation and design tag | yes |
| Content field (D, T, H) | 168–852 | Figures, table, title | yes |
| Caption band (F) | 868–964 | Review: captions. Clean: empty. Nothing else ever enters it. | layout yes |
| Footer (F) | 984–1040 | "Not medical advice" at right. Review overlay at left (review only). | layout yes |

### 2.2 Element boxes

Each element is listed as x / baseline or top / w × h. Text widths are estimates; the max width is binding.

**Furniture (F)**

| Id | Element | Box | State values |
|---|---|---|---|
| E01 | Citation `Pelham et al. (2022). J Consult Clin Psychol 90(5), 367–380.` | left x 128, baseline 92, w ≈ 801 (max 1664) × h 35 | hidden 0–12; B100 from 30; B56 from 1764 |
| E02 | Tag segment 1 `RCT, TRIPLE-MASKED AB/BA CROSSOVER` | left x 128, baseline 132, w ≈ 388 × h 28 | hidden; B72; B56 at the title |
| E03 | Separator ` · ` (2×) | after each segment, w ≈ 31 × 28 | dissolves with the segment that follows it |
| E04 | Tag segment 2 `N = 173, AGES 7–12` | x = 128 + measured width(seg1 + sep), baseline 132, w ≈ 189 × 28 | as E02 |
| E05 | Tag segment 3 `OROS-MPH VS PLACEBO` | x = after seg2 + sep, baseline 132, w ≈ 223 × 28; full tag ends x ≈ 990 (max 1792) | as E02 |
| E06 | `Not medical advice` | right x 1792, baseline 1024, w ≈ 211 × 30 | B72 on frames 0–1847; never dimmed |
| E07 | Caption text (review) | centred x 960, max w 1440 (240–1680). Last line on baseline 952; a second line above it on baseline 912. h 40 per line | B100 |
| E08 | Review overlay (review) | left x 128, baseline 1024, w ≈ 420 × 25. Text: `REVIEW BUILD · s03 · f0615 · 0:25.15` | B56 |

All segment x values are measured once at layout with the segments at opacity 0, so nothing reflows when a segment arrives.

**Layer D: crossover diagram (SCHEMATIC)**

| Id | Element | Box | States |
|---|---|---|---|
| D01 | SCHEMATIC mark box | x 128–257, y 176–204 (w 129 × h 28). Text left x 138, baseline 197. | hidden / final |
| D02 | Track AB, block 1 | rect x 432–1088, y 220–296 (656 × 76) | hidden / masked (graphite 1.5 px outline, hatch) / unmasked |
| D03 | Track AB, block 2 | rect x 1136–1792, y 220–296 | same |
| D04 | Track BA, block 1 | rect x 432–1088, y 316–392 | same |
| D05 | Track BA, block 2 | rect x 1136–1792, y 316–392 | same |
| D06 | Gap between the blocks of a track (A4) | x 1088–1136 (48 px), plain ground, no stroke, no label | — |
| D07 | "3 WEEKS" label, ×4 | centred on the block centre x (760 / 1464), baseline block top + 64 (284 / 380), w ≈ 76 × 25 | hidden / B72 |
| D08 | "3 WEEKS" chip, ×4 (ground rect behind D07) | w 96 × h 26, centred on D07, y block top + 44 to + 70 | opacity 1 while masked → 0 at unmask |
| D09 | Condition label, ×4 (METHYLPHENIDATE / PLACEBO) | centred on the block centre x, baseline block top + 34 (254 / 350), w ≈ 174 / 82 × 28 | hidden / final |
| D10 | Sequence labels `SEQUENCE AB` / `SEQUENCE BA` | left x 232, baselines 266 / 362, w ≈ 122 × 28 | hidden / B100 |
| D11 | R node | circle centre (150, 306), r 22, stroke 2 px bone (box 128–172 × 284–328). "R" centred, baseline 314. | hidden / drawn |
| D12 | Branches | 2 px graphite path (172, 306) → (196, 306) → vertical to y 258 and y 354 → to x 220 (box 172–220 × 258–354) | hidden / drawn |
| D13 | Legend: hatch swatch + `MASKED` | swatch rect x 128–160, y 412–428 (32 × 16), same hatch as the blocks. Text left x 172, baseline 428, w ≈ 73 × 25. | hidden / final |
| D14 | Legend: circle + `RANDOMISED` | circle centre (313, 421), r 13, 1.5 px bone, "R" 20 px centred baseline 428. Text left x 336, baseline 428, w ≈ 114 × 25. | hidden / final |

Hatching: 2 px graphite lines at 45°, 14 px perpendicular pitch, as one SVG pattern in `userSpaceOnUse`, so the phase runs continuously across all four blocks and the swatch. It is clipped to each block.

**Layer D: result rows (DATA)**

| Id | Element | Box | States |
|---|---|---|---|
| R01 | DATA mark box | x 128–197, y 452–480 (69 × 28). Text left x 138, baseline 473. | hidden / final |
| R02 | Plot head `OROS-MPH RELATIVE TO PLACEBO` | centred x 1380, baseline 473, w ≈ 303 × 25 | hidden / B72 |
| R03 | Zero line | x 1380, y 494–634 (2 px × 140). It spans rows 1–2 only. | hidden / drawn |
| R10 | Row 1 label `ARITHMETIC PROBLEMS CORRECT PER MINUTE` | left x 128, baseline 529, w ≈ 484 (max 700) × 33 | hidden / B100 |
| R11 | Row 1 bar (+37) | x 1380–1639 (7 px per point × 37 = 259), y 506–534 (259 × 28) | width 0 → 259, growing rightward from x 1380 |
| R12 | Row 1 value `+37%` | right x 944, baseline 531, w ≈ 87 × 40 | hidden / amber |
| R13 | Row 1 note `Academic seatwork. Difference +1.79 per minute, 95% CI [1.68, 1.90]` | left x 128, baseline 566, w ≈ 810 (max 860; must end before x 1000) × 30 | hidden / B72 |
| R20 | Row 2 label `RULE VIOLATIONS PER HOUR` | left x 128, baseline 617, w ≈ 290 × 33 | hidden / B100 |
| R21 | Row 2 bar (−53) | x 1009–1380 (7 × 53 = 371), y 594–622 (371 × 28) | width 0 → 371, growing leftward from x 1380 |
| R22 | Row 2 value `−53%` | right x 944, baseline 619, w ≈ 87 × 40 | hidden / amber |
| R23 | Row 2 note `Classroom. Difference −2.02 per hour, 95% CI [−2.18, −1.86]` | left x 128, baseline 654, w ≈ 709 (max 860) × 30 | hidden / B72 |
| R30 | Separator (closes the plotted region) | graphite 1 px, y 680, x 128–1792 | hidden / drawn |
| R31 | Row 3 label `CURRICULUM CONTENT LEARNED` | left x 128, baseline 721, w ≈ 337 × 33 | hidden / B100 |
| R32 | Row 3 value `NO DETECTABLE EFFECT` | right x 944, baseline 721, w ≈ 256 × 33 | hidden / amber |
| R33 | Row 3 note `Unit tests, before and after. Test × medication: p = .73 (subject area), p = .75 (vocabulary)` | left x 128, baseline 756, w ≈ 1049 (max 1664) × 30 | hidden / B72 |
| R34 | Row 3 plot area | x 1009–1639, y 696–728. **Empty**: no zero line, bar, dot or dash. | — |
| L01 | Limits rule | graphite 1 px, y 776, x 128–1792 | hidden / drawn |
| L02 | Limits sentence 1 `Limits: one summer programme, 3-week units, small groups with behaviour management, 80% of children on 18 mg.` | left x 128, baseline 808, w ≈ 1321 (max 1664) × 30 | hidden / B72 |
| L03 | Limits sentence 2 `The authors call for replication in ordinary classrooms over a school year.` | left x 128, baseline 840, w ≈ 845 × 30 | hidden / B72 |

- **Clearances.**
  - Block edges (432, 1088, 1136, 1792) are at least 79 px from every data vertical (944, 1009, 1380, 1639), so design time cannot be read against the percent scale.
  - Notes stay left of x 1000 on rows 1–2, so they never sit under a bar.
- **The scale is not printed.** It is linear at 7 px per percentage point from the zero line, and both bars start exactly on x 1380. It is a build constant, and the printed values carry the numbers (see §12, D7).

**Layer T: DEFICIT and the table**

| Id | Element | Box | States |
|---|---|---|---|
| T01 | `DEFICIT` | centred x 960, baseline 400, w ≈ 614 (653–1267) × cap top 260 (h 140 caps) | hidden / B100 / dissolved out at the title |
| T02 | Table top rule | bone 2 px, y 456, x 360–1560 | hidden / drawn / dimmed |
| T03 | Header rule | bone 1.5 px, y 512, x 360–1560 | same |
| T04 | Row rules | graphite 1 px, y 592 and 672, x 360–1560 | same |
| T05 | Bottom rule | bone 2 px, y 752, x 360–1560 | same |
| T06 | Column rules | graphite 1 px, x 660, 960, 1260, y 456–752 | same |
| T07 | Column heads `PREDICTION` / `RESULT` / `STATUS` | left at x 676 / 976 / 1276, baseline 492, w ≈ 114 / 80 / 75 × 28 | hidden / B100 |
| T08 | Row ids `H1` / `H2` / `H3` | left x 376, baselines 561 / 641 / 721, w ≈ 27 × 33 | hidden / B56 |
| T09 | Row names `MEMORY` / `ATTENTION` / `DOPAMINE` | left x 416, same baselines, w ≤ 220 × 33 | hidden / B100 |
| T10 | Nine body cells | x 660–1560 × y 512–752 | always empty ground: no dash, no "?", no tint |

The cells are: stub 360–660, PREDICTION 660–960, RESULT 960–1260, STATUS 1260–1560. Rows are: header 456–512, H1 512–592, H2 592–672, H3 672–752.

**Layer H: title**

| Id | Element | Box | States |
|---|---|---|---|
| H01 | `DEFICIT OF WHAT?` | centred x 960, baseline 368, w ≈ 924 (498–1422) × caps 90 (top ≈ 278) | hidden / B100 |
| H02 | `Three hypotheses about ADHD, tested against their own predictions.` | centred x 960, baseline 424, w ≈ 1052 (max 1400) × 40 | hidden / B72 |

During the title the table, dimmed to 20 %, sits under H02. The table's top rule maps to y ≈ 455 under camera T, and H02's descenders end at about 431.

## 3. Type

**Families.** Pinned in `package.json` and loaded locally with `@remotion/fonts` `loadFont`, from the fontsource `latin` woff2 files imported as URLs (`src/assets.d.ts` already declares `*.woff2`):
- **Barlow Condensed** (`@fontsource/barlow-condensed` 5.3.0), weights 500 and 600: the condensed sans for tags, marks, labels, table, DEFICIT and title.
- **Inter** (`@fontsource/inter` 5.3.0), weights 400, 500 and 600: the text sans for citation, numbers, notes, limits, captions and the footer. Always set with `font-feature-settings: "tnum" 1, "lnum" 1`.

**Loading gate.** `delayRender` until every `loadFont` promise resolves.

**Font test.** It asserts that:
- Inter digits 0–9 have equal advances with tnum on;
- U+2212, U+2013, U+00B7 and U+00D7 render from the bundled faces.

| # | Role | Family / weight | px | Tracking | Case | Colour |
|---|---|---|---|---|---|---|
| Y01 | Citation | Inter 500 | 28 | 0 | as written | B100 |
| Y02 | Design tag and separators | Barlow C 600 | 22 | +0.08em | caps | B72 |
| Y03 | DATA / SCHEMATIC mark | Barlow C 600 | 20 | +0.14em | caps | B72 text; box 1.5 px (DATA solid B100, SCHEMATIC dashed 4/3 B72) |
| Y04 | Plot head | Barlow C 600 | 20 | +0.10em | caps | B72 |
| Y05 | Sequence labels | Barlow C 600 | 22 | +0.06em | caps | B100 |
| Y06 | Node letter "R" | Barlow C 600 | 24 (node), 20 (legend) | 0 | caps | B100 |
| Y07 | Condition labels | Barlow C 600 | 22 | +0.06em | caps | amber / blue-grey |
| Y08 | "3 WEEKS" | Barlow C 500 | 20 | +0.08em | caps | B72 |
| Y09 | Legend words | Barlow C 500 | 20 | +0.10em | caps | B72 |
| Y10 | Row labels | Barlow C 600 | 26 | +0.05em | caps | B100 |
| Y11 | Values +37% / −53% | Inter 600, tnum | 32 | 0 | — | amber |
| Y12 | Value NO DETECTABLE EFFECT | Barlow C 600 | 26 | +0.05em | caps | amber |
| Y13 | Row notes | Inter 400, tnum | **24** | 0 | sentence | B72 |
| Y14 | Limits note | Inter 400, tnum | **24** | 0 | sentence | B72 |
| Y15 | DEFICIT | Barlow C 600 | 200 | +0.04em | caps | B100 |
| Y16 | Table column heads | Barlow C 600 | 22 | +0.10em | caps | B100 |
| Y17 | Table row id / name | Barlow C 600 | 26 | +0.05em | caps | B56 / B100 |
| Y18 | Title | Barlow C 600 | 128 | +0.03em | caps | B100 |
| Y19 | Subtitle | Inter 400 | 32 | 0 | sentence | B72 |
| Y20 | Not medical advice | Inter 500 | 24 | 0 | sentence, exact | B72 |
| Y21 | Captions (review) | Inter 400 | 32, line 40 | 0 | as narrated | B100 |
| Y22 | Review overlay and flag | Inter 400, tnum | 20 | 0 | as shown | B56 / B72 |

**Rules.**
- No role is below 20 px, and every note is 24 px.
- Numerals inside tags ("173", "7–12", "3 WEEKS") stay in Barlow because those lines are tags. Every measured value and statistic is in Inter tabular.
- No italics anywhere, so no italic face is loaded.

## 4. Colour

The palette is `PALETTE` in `theme.ts`. No colour is added.

| # | Element | Colour | Why |
|---|---|---|---|
| K01 | Ground, every frame | `#0E0F12` on the root `AbsoluteFill` | "Picture. Black." |
| K02 | Citation, row labels, sequence labels, DEFICIT, table heads and names, title, captions | bone B100 | Type and axes |
| K03 | Tag, marks, plot head, "3 WEEKS", legend, notes, limits, subtitle, footer | bone B72 (8.1:1) | Secondary text, still well over 4.5:1 |
| K04 | Zero line (2 px), table top, header and bottom rules, R node stroke | bone | These are axes and the table frame |
| K05 | Masked block outlines, hatch, branches, separator, limits rule, table row and column rules | graphite | Grid and secondary lines; never text |
| K06 | METHYLPHENIDATE blocks after unmasking | amber 2 px outline, fill amber at **16 %** (`#312719`), label amber | Amber is "the result"; the bars report this condition against placebo |
| K07 | PLACEBO blocks after unmasking | blue-grey 2 px outline, fill blue-grey at **20 %** (`#242930`), label blue-grey | The comparison group. 16 % and 20 % give equal relative luminance (0.0217 each), so the drug block does not look brighter, that is "better". Amber against blue-grey also differs in hue on the blue–yellow axis, so it survives deuteranopia and protanopia. |
| K08 | Hatch while masked | graphite, identical in all four blocks | Nothing hints at the allocation |
| K09 | Bars, rows 1–2 | amber 100 %, flat, square ends, no stroke | Both are the result. Opposite sign does not get opposite colour: both changes favour the drug, and red is reserved. |
| K10 | Values +37%, −53%, NO DETECTABLE EFFECT | amber | The result colour as text. The null is a result and has the same standing; it is not red (no prediction has failed) and not dimmed (that would editorialise). |
| K11 | Row 3 plot area | ground only | Nothing was estimated, so nothing is drawn |
| K12 | Empty table cells | ground only | Empty means not yet checked |
| K13 | Title beat | table layer at 20 % opacity; citation and tag at B56 (5.3:1) | "The table dims"; the band stays legible |
| K14 | Red, conjecture white, conjecture blue | **unused in this cut** | Nothing fails and nothing is conjecture |

## 5. Shot list

The narration column gives the word spoken at the start frame. Every row is keyed to a word in code; frames are those of §1.

**Shot 1: citation, frames 0–269**

| # | Element | Start–end | Ease | Narration |
|---|---|---|---|---|
| 1.1 | E06 `Not medical advice` on at full, no fade, to 1847 | 0 | cut | none |
| 1.2 | E01 citation dissolves in. It stands alone in the content area from 30 to 56. | 12–30 | dis | none |
| — | F1 freeze | 41–56 | — | "In **2022**," |
| 1.3 | E02 tag segment 1 | 56–74 | dis | "a triple-masked" |
| 1.4 | E03 + E04 tag segment 2 `N = 173, AGES 7–12`, final before "One" | 205–217 | dis | gap after s01 |
| — | F2 freeze | 219–270 | — | "**One hundred and seventy-three** children" |

**Shot 2: crossover diagram (layer D, SCHEMATIC), frames 270–533**

| # | Element | Start–end | Ease | Narration |
|---|---|---|---|---|
| 2.1 | D01 SCHEMATIC mark, at least 6 f before the first stroke of the figure | 270–282 | dis | "children with" |
| 2.2 | D10 both sequence labels | 282–300 | dis | "with ADHD" |
| 2.3 | E03 + E05 tag segment 3 `OROS-MPH VS PLACEBO` | 332–350 | dis | "methylphenidate" |
| 2.4 | D02 + D04 period-1 blocks. The outlines draw left to right by dashoffset, and the hatch wipes in behind a clip rect that follows the stroke. | 342–360 | draw | "methylphenidate for" |
| 2.5 | D07 + D08 "3 WEEKS" in the period-1 blocks, with D13 legend MASKED. All final before the first "three". | 350–360 | dis | "for" |
| — | F3 freeze | 362–386 | — | "**three weeks**" and |
| 2.6 | D03 + D05 period-2 blocks, as 2.4 | 386–404 | draw | "placebo for" |
| 2.7 | D07 + D08 "3 WEEKS" in the period-2 blocks | 394–404 | dis | "for" |
| — | F4 freeze | 404–429 | — | "**three weeks**, in" |
| 2.8 | D11 R node: circle draws clockwise from the top; "R" dissolves 435–447 | 429–447 | draw | "randomised" |
| 2.9 | D12 branches draw from the node outward. D14 legend RANDOMISED dissolves 447–459. | 441–459 | draw | "randomised order" |
| 2.10 | **Unmask**, all four blocks at once. Hatch and chips go 1 → 0. Outlines go graphite → amber or blue-grey. Fills go 0 → 16 % / 20 %. D09 condition labels dissolve 465–489. | 453–489 | dis | "order, while being" |
| 2.11 | Camera D push (§6), from rest | 429–609 | lin | "in randomised order …" through "completed" |

**Unmask mapping.** Sequence AB: block 1 = METHYLPHENIDATE, block 2 = PLACEBO. Sequence BA: the reverse. The letters are the schematic's own convention (A is the active condition). The paper names the design "AB/BA crossover" and never assigns the letters to a condition, so there is nothing here to verify (§8.4).

**Shot 3: result rows (layer D, DATA), frames 535–1298**

| # | Element | Start–end | Ease | Narration |
|---|---|---|---|---|
| 3.1 | R01 DATA mark + R02 plot head | 535–547 | dis | gap after s02 |
| 3.2 | R03 zero line draws top to bottom | 553–571 | draw | "Under methylphenidate" |
| 3.3 | R10 row 1 label | 573–585 | dis | "the children" |
| 3.4 | R11 bar 1 grows rightward from x 1380 to 1639 | 585–609 | draw | "children completed" |
| 3.5 | **R12 `+37%` cut on**; tick | 615 | cut | "**thirty-seven** percent more" |
| — | F5 freeze. Camera D still from 609. | 615–659 | — | "thirty-seven percent more" |
| 3.6 | R13 row 1 note, final on "seatwork" | 683–703 | dis | "per minute of seatwork" |
| 3.7 | R20 row 2 label | 703–715 | dis | "seatwork, and" |
| 3.8 | R21 bar 2 grows leftward from x 1380 to 1009 | 714–738 | draw | "and committed" |
| 3.9 | **R22 `−53%` cut on**; tick | 738 | cut | "**fifty-three** percent fewer" |
| — | F6 freeze | 738–782 | — | "fifty-three percent fewer" |
| 3.10 | R23 row 2 note | 782–800 | dis | "rule violations per hour" |
| 3.11 | R30 separator draws left to right (the plotted region is closed) | 833–851 | draw | "The amount of" |
| 3.12 | R31 row 3 label. No bar, ever. | 854–866 | dis | "content" |
| 3.13 | **R32 `NO DETECTABLE EFFECT` cut on**; tick | 899 | cut | "did not differ" |
| 3.14 | R33 row 3 note, final before the sentence ends | 920–938 | dis | "between conditions" |
| 3.15 | **Hold.** Nothing moves through the end of s04 and the whole written pause P1 (951–999). | 938–1010 | — | "…conditions." then silence |
| 3.16 | L01–L03 limits rule and both sentences dissolve in together, as a figure note under the rows | 1010–1034 | dis | "did what it is known" |
| 3.17 | **Hold** on rows and limits, at full, for 220 f = 9.17 s. L01 (1086–1124) plays inside it: no highlight, no colour change, no emphasis on row 3. | 1034–1254 | — | s05 end, **s06**, s07 to "carried" |
| 3.18 | Layer D recedes: opacity 1 → 0 as a slow dissolve. The field is empty from 1298. | 1254–1298 | dis | "carried in the name of the diagnosis" |

**Shot 4: DEFICIT and the table (layer T), frames 1309–1727**

| # | Element | Start–end | Ease | Narration |
|---|---|---|---|---|
| 4.1 | T01 **DEFICIT cut on** | 1309 | cut | "a **deficit**." |
| — | F7 freeze | 1334–1350 | — | "**Three** candidates" |
| 4.2 | T02 top rule, drawn left to right | 1350–1374 | draw | "candidates recur" |
| 4.3 | T03 header rule | 1362–1386 | draw | "recur, in" |
| 4.4 | T04 row rules | 1374–1398 | draw | "in clinical" |
| 4.5 | T05 bottom rule | 1386–1410 | draw | "clinical explanation" |
| 4.6 | T06 column rules, drawn top to bottom. The empty three-by-three grid is complete at 1422. | 1398–1422 | draw | "explanation" |
| 4.7 | Camera T push (§6) | 1350–1669 | lin | s08–s12 |
| 4.8 | T08 + T09 `H1 MEMORY` | 1471–1483 | dis | "memory" |
| 4.9 | `H2 ATTENTION` | 1517–1529 | dis | "attention" |
| 4.10 | `H3 DOPAMINE` | 1568–1580 | dis | "dopamine" |
| 4.11 | T07 `PREDICTION` | 1610–1622 | dis | "predictions" |
| 4.12 | T07 `RESULT` and `STATUS` together. L00 opens at 1632, between 4.11 and 4.12. | 1645–1657 | dis | "can be checked" |
| 4.13 | **Hold** on the empty table | 1657–1728 | — | "checked." "This film checks them." |

**Shot 5: title, frames 1728–1847**

| # | Element | Start–end | Ease | Narration |
|---|---|---|---|---|
| 5.1 | T01 DEFICIT dissolves out | 1728–1748 | dis | none |
| 5.2 | Rules and heads of layer T dim 1 → 0.20 | 1728–1764 | dis | none |
| 5.3 | E01–E05 dim B100/B72 → B56 | 1728–1764 | dis | none |
| 5.4 | H01 title dissolves in, after DEFICIT has gone | 1748–1772 | dis | none |
| 5.5 | H02 subtitle | 1772–1790 | dis | none |
| 5.6 | **Hold** to the last frame, with no fade to black. The subtitle is legible for about 2.7 s and the title for about 3.3 s. | 1790–1847 | — | none |

**Result holds.**
- +37%: from 615 to the next mark (683), 2.8 s.
- −53%: 738 to 782, then on to 833, 4.0 s.
- The null: 899 to 1010, 4.6 s, including P1.
- All three rows stay at full until 1254.

## 6. Camera

`transform: translate(tx, ty) scale(s)`, `transform-origin: 0 0`, with tx = cx(1 − s) and ty = cy(1 − s) for a fixed point (cx, cy). Each layer is clipped to the content field (y 168–852). Layers F and H are never transformed. The marks are inside their figure's layer and scale with it.

| # | Layer | Frames | s | Fixed point | tx, ty at end | Ease | Note |
|---|---|---|---|---|---|---|---|
| K1 | D | 0–429 | 1.000 | — | 0, 0 | hold | The diagram draws still: F2, F3 and F4 fall here |
| K2 | D | 429–609 | 1.000 → 1.030 | (960, 510) | −28.8, −15.3 | lin | Push while the diagram unmasks and the DATA panel draws. It ends 6 f before "thirty-seven". |
| K3 | D | 609–1298 | 1.030 | — | −28.8, −15.3 | hold | Hold on every result, P1, L01 and the recede |
| K4 | T | 0–1350 | 1.000 | — | 0, 0 | hold | DEFICIT is set still; F7 falls here |
| K5 | T | 1350–1669 | 1.000 → 1.020 | (960, 500) | −19.2, −10.0 | lin | Push while the table draws |
| K6 | T | 1669–1847 | 1.020 | — | −19.2, −10.0 | hold | Continues, dimmed, under the title |

**Extents checked.**
- At K3, layer D spans x 103–1817 and y 166–848 (the limits descenders). That is inside title-safe, below the band (148) and above the caption band (868).
- At K6, the table spans y 455–757.

**Transitions.** There are no other moves. The transitions are the cut-ons (values, DEFICIT, footer) and the dissolves (3.18, 5.1–5.4). Because D and T are separate layers, no hidden camera reset is needed.

## 7. Sound cues

The stems are fixed (see `scripts/make-audio.mjs`): 48 kHz stereo WAV in `public/audio/`. The gain column is the playback gain applied in Remotion `<Audio volume>`, relative to the stem's own level. Sample = frame × 2000.

| # | Stem | Frames (samples) | Gain → approx. level | Detail |
|---|---|---|---|---|
| A1 | `room-tone.wav` (24 s, loopable, −45 dBFS RMS) | Loop from 0 to 1847. Volume ramps 0 → 1 over 0–24. Unchanged through P1. | 0 dB → −45 dBFS RMS | The silence is room tone, not digital zero, which would read as a dropout |
| A2 | `tick.wav` (−20 dBFS peak) | **615** (1,230,000), row 1 | −4 dB → −24 pk | Lands with the `+37%` cut |
| A3 | `tick.wav` | **738** (1,476,000), row 2 | −4 dB → −24 pk | Lands with the `−53%` cut |
| A4 | `tick.wav` | **899** (1,798,000), row 3 | −4 dB → −24 pk | The same stem and level as A2 and A3: the null gets equal weight. Its 0.32 s tail ends at 907, before the sentence ends. |
| A5 | Written silence P1 | 951–999 | A1 only | No tick, no tone, no voice |
| A6 | `low-note.wav` (sustained D2, 2.4 s attack built in, −17 pk) | Starts 1640 (3,280,000), so it is at level by about 1698, under s13 (1675–1715). Volume holds 1 to 1728, then ramps 1 → 0 over 1728–1776. | −8 dB → −25 pk | "A single sustained low note under the last sentence" |
| A7 | `pulse.wav` (one beat on D2, −15 pk) | 1728, 1758, 1788, 1818 (48 bpm, 30 f). Samples 3,456,000 / 3,516,000 / 3,576,000 / 3,636,000. | −9 dB → −24 pk | The low note resolves onto the same pitch: the pedal becomes the pulse |
| A8 | `string-step0.wav` (A3, slow attack, −19 pk) | Enters 1740 (3,480,000) and sustains to the end | −8 dB → −27 pk | The film's one string line, at step 0. It does not move in this cut. |
| A9 | Master fade, standalone only (`standalone` prop true) | 1818–1847 | all stems → −∞, linear | The picture holds. The film assembly gets no fade. Lengthened from 11 to 29 frames in the build, so the string line does not stop short. |

**Unused.** `tick-low.wav` is not used: tags, the diagram and the table rows get no tick. There are exactly three ticks.

**Voice headroom.** The recorded voice will later sit at least 14 dB above this bed. Nothing tonal sounds before 1640.

## 8. DATA and SCHEMATIC marking

**8.1 Form.**
- Each figure carries a boxed mark at its top left, inside its layer: SCHEMATIC on D01, DATA on R01, with the text `FIGURE_MARK` from `strings.ts`.
  - DATA: solid 1.5 px bone box.
  - SCHEMATIC: dashed 4/3 box at B72.
- Each mark is final at least 6 frames before its figure's first stroke (282 before 342; 547 before 553), and it leaves with its figure (1254–1298).
- No paused frame shows a figure without its mark.
- DEFICIT and the table carry no mark: they are neither data nor a schematic.

**8.2 How the schematic implies no size.**
1. There is no axis, tick or gridline. The only quantity is the words "3 WEEKS", identical in all four blocks (A4).
2. All four blocks are 656 × 76 and the two tracks are identical. No per-sequence n is shown, so equal tracks assert no allocation ratio.
3. The gap (A4) is a fixed, unlabelled 48 px. No day counts are drawn.
4. The grammars never mix. Blocks are outlined boxes with a translucent fill and text inside. Bars are solid, unoutlined and textless, and grow from a zero line.
5. The fills have equal luminance (K06, K07).
6. Every block edge is at least 79 px from every data vertical.
7. The unmask is one simultaneous event after both conditions have been named. It shows allocation, not a magnitude or an order of disclosure.

**8.3 How the DATA panel stays honest.**
1. Every bar's value is printed. Both bars share one linear scale and start exactly on the zero line.
2. Each row's note carries the only interval the paper reports, the raw difference with its 95 % CI in square brackets (A2). The means are not shown (A2).
3. The plot head states the comparison: OROS-MPH relative to placebo.
4. Row 3 sits below a closed separator. It has no mark, because nothing was estimated, and its note states what was tested.
5. The citation is on screen throughout.

**8.4 No verification gate.** The merged spec first proposed a gate that blocked the clean build until someone confirmed that sequence A is methylphenidate. It was dropped after the paper's full text was searched: the paper uses "AB/BA crossover" as the name of the design four times and never assigns A or B to methylphenidate or placebo (it uses "Curriculum A" and "Curriculum B" for the two curricula). The lettering of the diagram is therefore a convention of the schematic, which is marked SCHEMATIC. The diagram shows no letter inside a block: it shows the two sequence labels and, after the unmask, the two condition names.

The four data sources are recorded in `docs/fact-check-cold-open.md`. Whether the publisher's typeset article should be looked at before the picture is locked is a production decision, recorded there too. It does not appear on screen.

## 9. Standalone rules

**R1. "Not medical advice".**
- The exact string, E06, B72.
- On every frame from 0 to 1847, in both builds, outside every camera, never dimmed or faded.
- Frame 0 and any excerpt carry it.

**R2. Limits (A3).**
- The exact two sentences (L02, L03), set as a figure note under the result rows in layer D.
- They are final at **1034**, which is before "Learning did not follow." starts (1086) and so before it ends (1124).
- They stay at full until 1254: **220 f = 9.17 s**, at least 9 s for 29 words. They remain partly visible to 1298.
- They follow the last result (row 3, final 938) and arrive after P1, so the written silence stays a pure hold.
- They are gated by the `standalone` prop (default true). The film assembly passes `false` and gets the same layout with L01–L03 absent.

**R3. "The citation line first, alone" against "always on screen".**
- "Alone" governs content: from 30 to 56 the citation is the only content.
- "Not medical advice" is standing furniture required "in every cut, without exception", and does not break "alone".
- The tag arrives segment by segment, on its spoken words.
- The same reading makes "the title alone" compatible with the citation band at B56, the footer at B72 and the table dimmed to 20 %.

**R4. Thumbnail.** Use frame 1830. It shows the title, subtitle, citation, tag and "Not medical advice". It makes no claim about whether the medication works.

## 10. Objections and answers

1. **"37 % and 53 % don't recompute from the paper's means, and there is no interval."**
   - Both percentages are the authors' stated figures (Results text).
   - Each row's note gives the raw difference with the only interval the paper reports, from Table S1, in square brackets.
   - The means are withheld so the frame does not invite a division whose inconsistency is the paper's (A2).
   - No interval is drawn on the percent scale, because none exists there.
2. **"Two outcomes on one percent axis, and −53 % looks like harm."**
   - Each row carries its own unit in its label and the comparison in the plot head.
   - Both bars are amber, so left does not mean bad.
   - The values are printed, so nobody reads one bar against the other.
   - No standardised effect size is implied.
3. **"No bar reads as zero effect: evidence of absence."**
   - Row 3 sits below a closed separator, with no zero line, dot or zero-length bar.
   - Its value is the abstract's wording, NO DETECTABLE EFFECT.
   - Its note says what was tested and gives both p values, so a specialist sees that a non-significant interaction is being reported, not an estimate.
   - It gets the same tick and the same amber as the effects, and never red.
4. **"Arithmetic wasn't what was taught."**
   - A1 says "per minute of seatwork".
   - The row 1 label says CORRECT, and its note opens "Academic seatwork."
   - Row 3's note says "Unit tests, before and after."
   - The two kinds of measure are visibly separated by R30.
5. **"Summer camp, low dose: the trailer reads as 'medication doesn't help'."**
   - The limits, including dose, are on screen through L01 and for 9 s.
   - "Not medical advice" is on every frame.
   - The two effects are drawn at full strength.
   - The title is a question about the model.
   - Nothing changes on screen at "Learning did not follow."
6. **"The schematic overstates the design, or the unmask implies someone knew."**
   - The blocks are identical, there is no time axis, the gap is unlabelled, the box is marked SCHEMATIC, and MASKED stays in the legend.
   - The unmask comes only after the whole design has been named, in all four blocks at once.
7. **"The sequence (drug, behaviour, no learning, DEFICIT, three deficits) implies a causal chain, and the table borrows the trial's authority."**
   - No line or motion connects one figure to the next. Layer D is fully gone before DEFICIT cuts on.
   - The table is blank and drawn whole before any label, and H1–H3 have equal weight.

## 11. Not done (deliberately)

- **N1.** No axis ticks, tick labels or gridlines: they would put numbers on screen that the script and A2–A3 do not contain (see §12, D7).
- **N2.** No means (6.7 vs 5.0, 1.9 vs 3.9), no 34 % or 51 %, no effect sizes, and no Phase-1 d intervals.
- **N3.** No per-sequence n, day counts, washout label, dose or timetable in the diagram.
- **N4.** No red, no conjecture colours, and no highlight of row 3 at L01.
- **N5.** No pull-out, pan or move on the citation or title. No transitions other than cuts and dissolves. No fade to black.
- **N6.** No ticks for tags, the diagram or the table. `tick-low.wav` is unused.
- **N7.** No placeholders in the table cells.
- **N8.** No italics, DOI, logos, icons, faces, children, classrooms, brains or pills.
- **N9.** No narration change beyond A1.
- **N10.** No limits on the end card (see Q3), and no music before 1640.
- **N11.** No scratch voice: the review build has captions only (production step 6).

## 12. Decisions

- **D1. Base proposal.** Proposal 1. Its band model, closed axis for the null and verification gate were the strongest frame for a paused, cropped trailer. Proposals 2 and 3 supply timing discipline and the skeptic's details.
- **D2. Fonts.** Barlow Condensed and Inter (Proposals 2 and 3), not IBM Plex (Proposal 1). They are pinned in `package.json` and already on disk; Plex is not.
- **D3. Pacing.** A half-words, half-syllables blend, not Proposal 1's flat per-word rate or Proposal 3's pure syllable share. It keeps the existing tests (2.2–5.2 syllables a second) and avoids a rushed s13.
- **D4. Still rule.** Proposal 2's rule, made strict (onset to next word + 6) and extended to "Three" in s08. The brief requires nothing to animate while a number is spoken.
- **D5. Value timing.** Values cut on at the number's first frame (Proposal 2). Bars land by that frame. Proposal 3 landed bars during the spoken number, which breaks D4.
- **D6. Row 3.** Below a closed separator with no plot marks (Proposals 1 and 3), not in a shared lane (Proposal 2). The paper reports no estimate to place.
- **D7. No numeric ticks.** All three proposals had tick labels (±50 %, ±60 %). The merge drops them, because "the only numbers on screen are those in the script and A2–A3". The printed values carry the scale.
- **D8. Value colour.** Amber for all three values (Proposals 1 and 2), not bone (Proposal 3). The brief makes amber "the result", and the null is a result.
- **D9. Fills.** Amber 16 % and blue-grey 20 %, recomputed for truly equal luminance. Proposal 3's 16 % and 24 % are not equal.
- **D10. Limits placement.** A figure note in layer D after the third row, during s05 (A3: "figure note", "follows its result"). It does not go in the citation band (Proposals 2 and 3) or the footer (Proposal 1). Its wording is A3's; all three proposals' wordings are superseded.
- **D11. Citation position.** Set in its final band position from the first frame (Proposals 2 and 3). Proposal 1's centred card crossfades into the band, which duplicates the citation and adds a transition for no gain.
- **D12. Layers and camera.** Separate camera layers D and T (Proposal 3), replacing Proposal 1's hidden reset cut. The camera is linear (`EASE.linear` from the kit), not ease-in-out.
- **D13. Unmask.** On "in randomised order" (Proposal 2's timing, Proposal 1's simultaneous unmask). The R node draws on "randomised", so the word and the symbol coincide.
- **D14. Block labels.** METHYLPHENIDATE and PLACEBO, from `DIAGRAM` in `strings.ts`, matching the narration. "3 WEEKS" sits on a chip in every block (A4).
- **D15. Ticks.** One stem, three equal ticks (Proposals 2 and 3). A lower tick for the null would read as bad news.
- **D16. Title beat.** DEFICIT out, then the title in where it stood, with the table dimmed to 20 % beneath (Proposal 2). Proposal 1 dimmed the table to 0, which deletes the "spine" the script keeps.

## 13. Open questions for the writer

- **Q1. Settled.** "Is sequence A methylphenidate?" has no answer in the paper, which never assigns the letters. The lettering is the schematic's convention, and no gate is built (§8.4).
- **Q2.** The typeset APA article (and its figures) has not been seen by anyone. Should someone with access check it before the picture is locked? This is not blocking at present.
- **Q3.** The limits recede with the figure at 1254–1298, so the end card and thumbnail carry no limits. Should the trailer's end card repeat A3's second sentence? It would be a new placement, not a new string.
- **Q4.** Outside this build but exposed by the trailer: upload title 2, "Methylphenidate Raised Output by 37%", has the same recompute problem as the row values.

## 14. Deviations from the script

Each item is on screen without being in the script's "On screen" text.

| On screen | Justified by |
|---|---|
| Row 1 label gains CORRECT; the three row notes | A2 |
| Limits note (two sentences) | A3; rule "Say so if the cold open ships alone" |
| "3 WEEKS" in each block; the 48 px unlabelled gap | A4 |
| SCHEMATIC and DATA marks | Script, "The look": "A figure marked DATA … marked SCHEMATIC" |
| SEQUENCE AB / SEQUENCE BA labels | Script picture: "two parallel tracks, sequence AB and sequence BA" |
| METHYLPHENIDATE / PLACEBO block labels | Script picture: "the hatching clears to show which block is methylphenidate and which is placebo" |
| Legend MASKED (with swatch); R node and RANDOMISED | Script picture: "hatched, because the allocation is masked"; narration "in randomised order" |
| Plot head `OROS-MPH RELATIVE TO PLACEBO` | Rule "Never: a figure that looks like data and is not". It reuses the tag's own words. |
| Middle-dot separators between tag segments (the script uses full stops) | Typography only; `DESIGN_TAG` strings unchanged |
| Citation band and tag at B56 during the title; table at 20 % | Script title: "The table dims. The title alone", reconciled with "Always on screen" (R3) |
| Captions and review overlay | Review build only; production step 6 (voice recorded after the review) |
