# Fact-check: Part 0 and Part 1

Checked 16 November 2026 against the papers themselves, as the script requires
("Every number on screen has to be read from the paper itself"), for beats 0.1
to 1.5 of script version 3.

One checker read every source. This part has not yet had the second,
independent check that the cold open had, nor a specialist review. Both belong
before the voice is recorded.

## What was read

| Source | Read | Note |
| --- | --- | --- |
| Faraone and Larsson 2019, full text (PMC6477889) | Yes, in full | The 74 percent, and what it is a mean of |
| Pawley et al. 2024, full text (PMC12244022) | Yes, in full | Method, Tables 1 to 4, Discussion |
| Cortese et al. 2015, full text (PMC4382075) | Yes, in full | Method, Results, Tables 1 and 2, Discussion. Not the online supplement |
| Skodzik, Holling and Pedersen 2017 | **Abstract, tables and figures. Not the text** | The publisher's full text is behind a paywall, and no open copy was found. Its two tables and seven figures were read as images, from Semantic Scholar's extraction of the published article. The captions are cut off in those images. **See decision 7** |
| Martinussen et al. 2005 | **Abstract only** | As above, and no table could be read. The abstract gives all four estimates and their intervals. **See decision 10** |
| Alderson et al. 2013 | **Abstract only** | As above. Three of its tables were read as images, and none holds the pooled estimates. The abstract gives no number |
| Willcutt et al. 2005 | **Abstract only** | As above, and no table could be read. The abstract gives the range, the counts and the quoted words. **See decision 9** |
| PubMed and Europe PMC records of all seven papers | Yes | Journal, volume, issue, pages, dates of publication. No erratum or retraction is attached to six of them |
| Erratum to Cortese et al. 2015 (J Am Acad Child Adolesc Psychiatry 54(5), 433; PMC4718926) | Yes, in full | It corrects two intervals of Table 2 and reprints the table. Neither is on screen: the active-control estimate for the most proximal rater, and arithmetic. The five numbers the film takes from Table 2 are the same in the corrected table |

"Abstract only" means the authors' own abstract, as the journal published it
and PubMed carries it. It is part of the paper, and every number taken from one
is quoted below. It is not the full text: a table can differ from an abstract,
as it does in Cortese et al. (decision 1), and as it may in Willcutt et al. and
Martinussen et al. (decisions 9 and 10).

## Verdict on every on-screen string

### Citations and design tags

| On screen | Verdict | Where |
| --- | --- | --- |
| Faraone and Larsson (2019). Mol Psychiatry 24(4), 562–575. | Confirmed | PubMed 29892054. Online 11 June 2018, in the issue of April 2019. The script had the reference "from memory" |
| REVIEW, 37 TWIN STUDIES | Confirmed. Added by the build (P4) | Full text: "The mean heritability across 37 twin studies" |
| Skodzik, Holling and Pedersen (2017). J Atten Disord 21(4), 267–283. | Confirmed | PubMed 24232170. In PubMed since 16 November 2013, in the issue of February 2017. **See decision 3** |
| META-ANALYSIS, ADULTS | Confirmed | Abstract: "The present meta-analysis", "adult ADHD" |
| Pawley et al. (2024). Neuroscience Applied 3, 103941. | Confirmed | PubMed 40656067. Online 28 January 2024 |
| CASE-CONTROL, 205 VS 50 | Confirmed, with a note | Full text: "205 adolescents and adults with ADHD, and 50 controls". The paper does not call its design case-control. It compares a patient group with a control group at one time point. **See "For the writer"** |
| Martinussen et al. (2005). J Am Acad Child Adolesc Psychiatry 44(4), 377–384. | Confirmed. Journal reference added by the build (P4) | PubMed 15782085 |
| META-ANALYSIS, 26 STUDIES, CHILDREN | Confirmed | Abstract: "Twenty-six empirical research studies", "children and adolescents" |
| Alderson et al. (2013). Neuropsychology 27(3), 287–302. | Confirmed | PubMed 23688211 |
| META-ANALYSIS, 38 STUDIES, ADULTS | Confirmed | Abstract: "yielded 38 studies of WM in adults with ADHD" |
| Willcutt et al. (2005). Biol Psychiatry 57(11), 1336–1346. | Confirmed | PubMed 15950006 |
| META-ANALYSIS, 83 STUDIES, N = 3,734 WITH ADHD | Confirmed | Abstract: "a meta-analysis of 83 studies … groups with ADHD (total N = 3734) and without ADHD (N = 2969)" |
| Cortese et al. (2015). J Am Acad Child Adolesc Psychiatry 54(3), 164–174. | Confirmed | PubMed 25721181. Online 29 December 2014, in the issue of March 2015 |
| META-ANALYSIS, 15 RCTS, N = 759 | Confirmed, **against the script's 16** | **See decision 1** |

### Beat 0.1

| On screen | Verdict | Where |
| --- | --- | --- |
| HERITABILITY NEAR 0.74, TWIN STUDIES | Confirmed | Full text: "The mean heritability across 37 twin studies of ADHD or measures of inattentiveness and hyperactivity is 74% (Fig. 1)." Abstract: "ADHD's high heritability of 74%". The paper gives no interval |
| d = 0.5, DISTRIBUTIONS OVERLAP BY 80% | Confirmed by computation | Two normal curves of equal spread, 0.5 standard deviations apart, share 2 × Φ(−0.25) = 80.26 percent of their area. A test recomputes it |

### Beat 1.2

| On screen | Verdict | Where |
| --- | --- | --- |
| VERBAL LONG-TERM MEMORY · WEAKER | Confirmed | Skodzik, abstract: "Adults with ADHD performed significantly worse than controls on verbal but not on visual long-term memory and memory acquisition subtests." |
| d = −0.49, 99% CI [−0.71, −0.27] | Confirmed in the paper's Figure 1. Added by the build (P8). **See decision 7** | Bottom row of the forest plot: d −0.49, SE 0.09, limits −0.71 and −0.27, p 0.00, under the head "Std. diff. in means and 99% CI" |
| VISUAL · NO SIGNIFICANT DIFFERENCE | Confirmed, **against the script's NO DIFFERENCE** | The same sentence of the abstract. **See decision 4** |
| d = −0.36, 99% CI [−0.94, 0.22] | Confirmed in the paper's Figure 5. Added by the build (P8). **See decision 7** | Bottom row of the forest plot: d −0.36, SE 0.22, limits −0.94 and 0.22, p 0.11, under the same head |
| RETRIEVAL · NO DEFICIT OBSERVED | Confirmed | Skodzik, abstract: "In contrast, no retrieval problems were observable." |
| INITIAL LEARNING · PRESERVED | Confirmed as the authors' word. **See decision 5** | Pawley, abstract: "despite preserved initial learning". Table 3, RAVLT trial 5: −0.22 (−0.55, 0.10), p = 0.175 |
| DELAYED RECALL · REDUCED | Confirmed | Pawley, Table 3, RAVLT trial 7: −0.38 (−0.70, −0.06), p = 0.021. It held in the sensitivity analysis |
| Standardised difference −0.22, 95% CI [−0.55, 0.10], p = .175 | Confirmed | As above. The paper calls the figures "Effect sizes (standardized betas)", from regressions that control for age |
| Standardised difference −0.38, 95% CI [−0.70, −0.06], p = .021 | Confirmed | As above |

### Beat 1.3

| On screen | Verdict | Where |
| --- | --- | --- |
| SPATIAL STORAGE 0.85 [0.62, 1.08] | Confirmed in the abstract | Martinussen, abstract: "spatial storage (effect size = 0.85, CI = 0.62 - 1.08)" |
| SPATIAL CENTRAL EXECUTIVE 1.06 [0.72, 1.39] | Confirmed in the abstract. **A later paper tabulates another figure: see decision 10** | "spatial central executive WM (effect size = 1.06, confidence interval = 0.72-1.39)" |
| VERBAL STORAGE 0.47 [0.36, 0.59] | Confirmed in the abstract | "verbal storage (effect size = 0.47, confidence interval = 0.36-0.59)" |
| VERBAL CENTRAL EXECUTIVE 0.43 [0.24, 0.62] | Confirmed in the abstract | "verbal central executive WM (effect size = 0.43, confidence interval = 0.24-0.62)" |
| PHONOLOGICAL · MODERATE, VISUOSPATIAL · MODERATE | Confirmed in the abstract | Alderson, abstract: "moderate-magnitude between-group effect sizes (ESs) across both WM domains", for "phonological (PH) and visuospatial (VS) WM". **See decision 6** |

### Beat 1.4

| On screen | Verdict | Where |
| --- | --- | --- |
| ALL EXECUTIVE MEASURES 0.46–0.69 | Confirmed in the abstract. **The lower end is in doubt: see decision 9** | Willcutt, abstract: "Effect sizes for all measures fell in the medium range (.46-.69)". The table behind the range was not read |
| VERBAL WORKING MEMORY 0.52 [0.24, 0.80] | Confirmed | Cortese, Table 2: working memory (verbal), all trials, objective, 8 trials, 0.52, 0.24 to 0.80 |
| VISUAL WORKING MEMORY 0.47 [0.23, 0.70] | Confirmed | Table 2: working memory (visual), 5 trials, 0.47, 0.23 to 0.70 |
| SYMPTOMS, MOST PROXIMAL RATER 0.37 [0.09, 0.66] | Confirmed, **against the script's UNBLINDED** | Table 2: ADHD total, all trials, most proximal rater, 14 trials, 0.37, 0.09 to 0.66. **See decision 2** |
| SYMPTOMS, PROBABLY BLINDED RATER 0.20 [0.01, 0.40] | Confirmed | Table 2: ADHD total, probably blinded rater, 11 trials, 0.20, 0.01 to 0.40, p = .04 |
| Training of working memory alone, 6 trials: ADHD symptoms 0.00 [−0.31, 0.31], rated by the most proximal rater. | Confirmed. Added by the build (P11) | Table 2: ADHD total, trials "using just working memory training", most proximal rater, 6 trials, 0.00, −0.31 to 0.31, p = 1.00 |

### Beats 1.1 and 1.5

The cells of row H1 are the film's own words. PREDICTION restates the
hypothesis. RESULT and STATUS summarise beats 1.2 to 1.4, and stand or fall
with them.

## Decisions, and how each was settled

### 1. Fifteen trials, not sixteen

The script has "sixteen randomised trials" in the narration and 16 RCTS in the
tag, from the abstract: "Sixteen of 695 nonduplicate records were analyzed (759
children with ADHD)."

The paper's Results open: "Fifteen trials (reported in 16 papers) met entry
criteria." Table 1 lists sixteen papers, and a footnote says that two of them,
Egeland 2013 and Hovik 2013, "refer to the same study and present analyses on
different outcomes". The paper's own breakdown adds to fifteen: six trials of
working-memory training, four of attention training, two of both, two of
inhibition and working memory, one of general executive function. The sample
sizes in Table 1 add to 759 only when that study is counted once.

**Settled (P3).** The narration says "fifteen randomised trials", and the tag
says 15 RCTS. No single analysis uses all fifteen: the four rows on screen rest
on 8, 5, 14 and 11 trials.

### 2. "Unblinded" is the paper's tendency, not its definition

The script labels the third row SYMPTOMS, UNBLINDED. The paper's analysis takes
"raters most proximal to the treatment setting (i.e., typically unblinded)". In
Table 1 the most proximal rater and the probably blinded rater are the same
person in several trials.

**Settled (P10).** The rows read SYMPTOMS, MOST PROXIMAL RATER and SYMPTOMS,
PROBABLY BLINDED RATER, the paper's two terms.

### 3. Two studies are dated by a year their work was not done in

"In 2017, Skodzik, Holling and Pedersen separated those stages": the paper's
DOI was registered on 14 November 2013, and PubMed has carried the paper since
16 November 2013. The publisher gives 28 July 2016 as its online date. The
issue it was printed in is February 2017. On any of these dates, the work was
done before 2017.

"In 2024, a study … found": the paper went online on 28 January 2024. Its data
are the baseline assessment of an earlier trial, whose protocol was approved in
January 2017.

This is the pattern the cold open's first sentence had (A8), and the brief of
the cold open said that later parts would need the same look.

**Settled (P1, P2).** Both sentences now give the year as the year of
publication: "… in adults with ADHD, published in 2017." and "A study of two
hundred and five adolescents and adults with ADHD, published in 2024, found …".
Both citations keep the year of the issue.

### 4. "No difference" for visual memory is stronger than the paper

The abstract says adults with ADHD performed "significantly worse … on verbal
but not on visual" tests. The paper's Figure 5 gives the pooled estimate for
visual long-term memory: d = −0.36, with a 99 percent interval from −0.94 to
0.22, p = .11, from ten effect sizes. The verbal estimate rests on twenty-three.
So visual memory came out a third of a standard deviation weaker, and the
difference was not significant. The 2024 study that cites the meta-analysis
adds that its authors "may not have had the power to detect differences in
visual memory due to a smaller number of studies". The cold open settled the
same case for its null result (A6).

**Settled (P7, P14).** The screen says NO SIGNIFICANT DIFFERENCE, with the
estimate and its interval under it. The narration's "Visual memory did not."
became "Visual memory showed no significant difference."

### 5. "Preserved" rests on a difference that was not significant

Pawley et al. conclude that initial learning is "preserved". The estimate is
−0.22, with an interval from −0.55 to 0.10. The estimate for delayed recall is
−0.38, from −0.70 to −0.06. The two intervals overlap widely. One excludes
zero and the other does not, and the paper does not test the difference between
the two.

The narration reports the finding as the authors state it, and then says "Where
in the sequence the loss arises is not settled", which is the right conclusion.

**Settled (P8).** PRESERVED and REDUCED stay, as the authors' words, and each
carries its estimate and interval on screen. A specialist can then see what the
two words rest on.

### 6. The adult estimates are not drawn

The script's picture has "then the adult estimates" in the forest plot, and its
source note says: "The film speaks no number here, so draw none without the
paper."

The full text was not read. The 2024 study cites the two estimates as 0.55
(verbal) and 0.49 (visuospatial), without intervals. That is a citation, not
the paper.

**Settled (P12).** The two adult rows carry the word MODERATE, from the
abstract, and no mark on the axis. When someone reads the paper, the two rows
take their estimates and intervals in `src/part1/strings.ts`, and the marks
draw themselves.

### 7. "About half a standard deviation" for long-term memory

The script: "'About half a standard deviation' rests on a later paper that
cites the estimate as 0.49. Confirm it in the original."

The text of the original could not be read. Its figures could, as images. The
first forest plot pools twenty-three effect sizes to d = −0.49, with limits
−0.71 and −0.27, and its axis is labelled "ADHD impaired" on the negative
side. The paper's other pooled estimates, read the same way: −0.58 [−0.82,
−0.33], −0.51 [−0.94, −0.08], −0.36 [−0.94, 0.22] and −0.12 [−0.64, 0.40].

The captions are cut off in the images, so which plot is which measure is an
identification, not a quotation. It rests on three things. Two later papers
give the same five numbers by name: Pawley et al. 2024 ("an effect size of 0.49
in verbal memory") and Laine et al. 2025, Journal of Neuropsychology 19(3),
454–472 ("For verbal memory, Cohen's d values for delayed free recall,
acquisition and recognition were .49, .58 and .51 … for visual memory measures
… .36 (non-significant) and .12"). The significance of each plot matches the
abstract. And the same outlying study stands out in each pair of plots.

Every plot is headed "Std. diff. in means and 99% CI". The intervals are 99
percent intervals, which is unusual, and the screen says so.

**Settled (P8).** "By about half a standard deviation" is confirmed in the
paper's own figure. The two estimates the narration turns on, verbal and
visual long-term memory, stand on screen with their intervals. Someone with the
article should still check the two captions.

### 8. The second box is marked as failed beside an interval that excludes zero

The script marks the second check box as failed after the row 0.20 [0.01,
0.40]. That interval excludes zero: on the pooled trials, symptoms rated by
probably blinded raters improved a little, and significantly (p = .04). The
narration is careful ("this test is not decisive"). The red box is not.

The paper holds a sharper answer. The test is whether reducing the
working-memory deficit reduces the disorder, and six of the fifteen trials
trained working memory alone. In those, working memory improved (verbal 0.57
[0.29, 0.82], six trials) and symptoms did not move: 0.00 [−0.31, 0.31], for
the most proximal rater, the one most likely to see an effect. The Discussion:
"Effects on ADHD were negligible even considering most proximal measures." The
abstract: "There were no effects of working memory training, specifically on
ADHD symptoms."

**Settled (P11).** A note under the plot gives that estimate and its interval.
It arrives before the box is marked. The four rows and the narration are
unchanged.

### 9. The lower end of Willcutt's range: .46 in the abstract, .43 in papers that cite it

The script, the narration and the screen take the range from the abstract:
"Effect sizes for all measures fell in the medium range (.46-.69)". The
narration speaks only the upper end, "None exceeded 0.69".

The full text was not read. Three papers that cite it give the range as .43 to
.69, read here as excerpts, one of them with the weighted mean, .54, and the
number of comparisons, 168. A doctoral thesis (Zhao 2013, Simon Fraser
University) reprints eight measures from the paper's Table 2, from 0.46
(Wisconsin Card Sorting) to 0.69 (Tower of Hanoi). The table's other measures
were not seen. If one of them is at .43, the paper's table and its abstract
differ, as in the trial of the cold open.

**Not settled.** The screen keeps 0.46–0.69, the range the authors state in
their abstract, and the band is drawn from it. The upper end holds either way.
An author's copy of the paper is in the Internet Archive, which this build
could not reach:
<http://web.archive.org/web/20170809071304/http://psych.colorado.edu/~willcutt/pdfs/Willcutt_2005_bp.pdf>.
Table 2 settles it in a minute. If the table says .43, `EF_BAND` in
`src/part1/strings.ts` takes the new value, and the band follows.

### 10. Spatial central executive: 1.06 in the abstract, 1.14 in a paper that tabulates it

The abstract gives "spatial central executive WM (effect size = 1.06,
confidence interval = 0.72-1.39)". The narration speaks 1.06.

A later review, Mueller and Tomblin 2012 (Top Lang Disord 32(3), 207–227,
PMC4264104), tabulates the four estimates of this meta-analysis in its Table 4. Three match the abstract to
the digit. The fourth reads 1.14 (0.82–1.46). The full text was not read, so it
is open whether the paper's table holds a second estimate for this category, or
whether the later table is in error.

**Not settled.** The screen and the narration keep 1.06 [0.72, 1.39], the
authors' own figure in their abstract. The paper's results table settles it.

## What the papers report, for reference

- **Faraone and Larsson 2019.** A review. The 74 percent is the mean of the
  heritability estimates of 37 twin studies "of ADHD or measures of
  inattentiveness and hyperactivity". Studies with categorical diagnoses give
  77 to 88 percent. Self-ratings in adults give 30 to 40 percent, which the
  authors put down to rater effects.
- **Pawley et al. 2024.** 205 participants with ADHD aged 14 to 45 (mean 25.8),
  from the baseline of a four-site trial, and 50 controls (mean 21.1). The
  control group was younger, and all analyses control for age. Three quarters
  of the ADHD group were on medication when tested. Test: the Rey Auditory
  Verbal Learning Test. "Initial learning" is the sum of five learning trials.
  "Delayed recall" is recall after about 30 minutes. Recognition, a week later
  by e-mail, was lower in the ADHD group (−0.38 [−0.75, −0.01], p = .046) but
  not in the sensitivity analysis. Digit span forward and backward were lower
  too. The authors call their finding on retention "largely novel" and ask for
  replication.
- **Cortese et al. 2015.** Standardised mean difference: the change in the
  trained group minus the change in the control group, over the pooled
  standard deviation before training. Random effects. With an active control
  only, the probably blinded estimate is 0.22 [−0.09, 0.53], six trials, not
  significant. Training of several functions at once gave 0.79 [0.46, 1.12] for
  the most proximal rater, five trials, with too few trials for a blinded
  estimate. Inattention alone: 0.47 [0.14, 0.80] most proximal, 0.32 [−0.01,
  0.66] probably blinded.
- **Willcutt et al. 2005, abstract.** 83 studies, 3,734 with ADHD and 2,969
  without. "Groups with ADHD exhibited significant impairment on all EF tasks."
  The strongest effects were on response inhibition, vigilance, working memory
  and planning. "Moderate effect sizes and lack of universality of EF deficits
  among individuals with ADHD suggest that EF weaknesses are neither necessary
  nor sufficient to cause all cases of ADHD."
- **Martinussen et al. 2005, abstract.** 26 studies published from 1997 to
  December 2003. The deficits "were independent of comorbidity with language
  learning disorders and weaknesses in general intellectual ability".
- **Skodzik et al. 2017, abstract.** "The long-term memory deficit was strongly
  statistically related to the memory acquisition deficit. In contrast, no
  retrieval problems were observable." Conclusion: "memory deficits in adult
  ADHD reflect a learning deficit induced at the stage of encoding".
- **Alderson et al. 2013, abstract.** 38 studies. "Several task-moderating
  variables explained significant ES variability among PH and VS studies."

## The narration, sentence by sentence

Every sentence that states a fact, and what it rests on.

| Sentence | Verdict |
| --- | --- |
| "twin studies put the heritability of ADHD near seventy-four percent" | Confirmed in the full text |
| "every figure that follows is a difference between groups, most of them moderate in size" | Holds for this part: 0.43 to 0.69, with the two spatial estimates above |
| "separated those stages in a meta-analysis of long-term memory in adults with ADHD" | Confirmed in the abstract |
| "Verbal long-term memory came out weaker, by about half a standard deviation." | Confirmed: the abstract, and d = −0.49 in the paper's first forest plot (decision 7) |
| "Visual memory showed no significant difference." | Confirmed, against the script's "Visual memory did not." (decision 4) |
| "The weakness tracked how much had been acquired in the first place, and the analysis found no sign of a retrieval problem." | Confirmed in the abstract |
| "The authors placed the deficit at encoding." | Confirmed in the abstract |
| "A study of two hundred and five adolescents and adults with ADHD … found initial learning preserved and delayed recall reduced." | Confirmed in the full text (decision 5) |
| "In children, the meta-analytic differences are large for spatial tasks, 0.85 for storage and 1.06 for manipulation, and moderate for verbal tasks." | Confirmed in the abstract. "Manipulation" is the paper's "central executive". The 1.06 has a rival figure in a later paper (decision 10) |
| "In adults they are moderate for both." | Confirmed in the abstract |
| "Willcutt and colleagues pooled eighty-three studies of executive function. Every measure showed a difference. None exceeded 0.69, and the deficits were not universal." | Confirmed in the abstract. The 0.69 holds on every reading of the range (decision 9) |
| "executive weaknesses are 'neither necessary nor sufficient' to cause the disorder" | The four words are the paper's. It goes on "to cause all cases of ADHD". The meaning is the same: what is not necessary is absent in some cases |
| "fifteen randomised trials of cognitive training" | Confirmed in the full text, against the script's sixteen (decision 1) |
| "Working memory improved, by about half a standard deviation." | Confirmed: 0.52 and 0.47 |
| "ADHD symptoms, rated by observers probably blind to treatment, improved by 0.20, with a confidence interval that starts at 0.01." | Confirmed in the full text |
| "Far transfer from training is weak in any population" | **No source is cited.** The script has it "from memory", "to be fair to the hypothesis". Cortese et al. report near transfer and "no evidence of 'far transfer'" within their trials, which is this population only |
| "reducing them does not reduce the disorder" | Holds for training of working memory alone (decision 8). On the pooled trials the blinded estimate is small and its interval starts at 0.01 |

## For the writer

Not changed, because each is the writer's to decide:

- **Four papers were not read in full.** Someone with access should read
  Skodzik, Martinussen, Alderson and Willcutt before the voice is recorded.
  Five things to look for. Willcutt's Table 2: is any measure below .46
  (decision 9)? Martinussen's results table: is the spatial central executive
  estimate 1.06 or 1.14, and are the intervals 95 percent (decision 10)? The
  captions of Skodzik's Figures 1 and 5 (decision 7). Alderson's two pooled
  estimates and their intervals, so that the adult rows can be drawn
  (decision 6). And the sentence around "neither necessary nor sufficient" in
  Willcutt's text.
- **CASE-CONTROL for the 2024 study.** A strict reader keeps the term for
  designs that sample on the outcome and look back at exposure. Here two
  groups are compared at one time. CROSS-SECTIONAL, 205 VS 50 would be beyond
  reproach.
- **"Far transfer from training is weak in any population"** has no source on
  screen or in the script. It is narration, not a number, and it argues against
  the film's own result. A reference would still be asked for in a seminar.
- **The first test is answered with executive function, not with working
  memory.** "It should be present in most cases" is asked of the
  working-memory deficit, and answered with Willcutt's finding on all executive
  measures. Working-memory tasks are among them. The step is fair, and a
  specialist will notice it.
- **Amber and blue-grey for the two studies of beat 1.2.** The script asks for
  the second marker "in the comparison colour". So amber, "the result, and the
  ADHD estimate", marks one study, and blue-grey, "the comparison group", marks
  the other. Both studies compare the same two kinds of group.
