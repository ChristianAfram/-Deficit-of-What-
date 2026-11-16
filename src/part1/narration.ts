// The narration of Part 0 and Part 1 (beats 0.1 to 1.5): script version 3,
// word for word, with the amended sentences marked. One entry per sentence.
// Do not edit a sentence here without recording it in docs/brief-part-1.md:
// tests/part1-narration.test.ts compares the two.

import {wordCount, type Line} from '../kit/cues';

export type SentenceId =
  | 'p01' | 'p02' | 'p03' | 'p04'
  | 'p05'
  | 'p06' | 'p07' | 'p08' | 'p09' | 'p10' | 'p11' | 'p12' | 'p13'
  | 'p14' | 'p15' | 'p16' | 'p17' | 'p18' | 'p19' | 'p20'
  | 'p21' | 'p22' | 'p23' | 'p24' | 'p25' | 'p26' | 'p27' | 'p28' | 'p29'
  | 'p30' | 'p31' | 'p32' | 'p33';

export type Sentence = Line<SentenceId>;

export const NARRATION: readonly Sentence[] = [
  // 0.1 What is not in question
  {id: 'p01', beat: '0.1', paragraph: 1, text: 'Two limits before the evidence.'},
  {
    id: 'p02',
    beat: '0.1',
    paragraph: 1,
    text: 'Nothing here disputes the diagnosis: twin studies put the heritability of ADHD near seventy-four percent, and its impairments are measured, not assumed.',
  },
  {
    id: 'p03',
    beat: '0.1',
    paragraph: 2,
    text: 'And every figure that follows is a difference between groups, most of them moderate in size.',
  },
  {
    id: 'p04',
    beat: '0.1',
    paragraph: 2,
    text: 'The distributions overlap, and none of these measures classifies an individual.',
  },

  // 1.1 The prediction
  {
    id: 'p05',
    beat: '1.1',
    paragraph: 3,
    text: 'If ADHD were a deficit of memory, the loss should appear where memories are kept and recovered: in retention and in retrieval.',
  },

  // 1.2 Long-term memory
  {
    id: 'p06',
    beat: '1.2',
    paragraph: 4,
    // Amended (brief, amendment P1): the year is the year of publication.
    text: 'Skodzik, Holling and Pedersen separated those stages in a meta-analysis of long-term memory in adults with ADHD, published in 2017.',
  },
  {
    id: 'p07',
    beat: '1.2',
    paragraph: 4,
    text: 'Verbal long-term memory came out weaker, by about half a standard deviation.',
  },
  {id: 'p08', beat: '1.2', paragraph: 4, text: 'Visual memory did not.'},
  {
    id: 'p09',
    beat: '1.2',
    paragraph: 5,
    text: 'The weakness tracked how much had been acquired in the first place, and the analysis found no sign of a retrieval problem.',
  },
  {id: 'p10', beat: '1.2', paragraph: 5, text: 'The authors placed the deficit at encoding.'},
  {id: 'p11', beat: '1.2', paragraph: 6, text: 'That localisation is contested.'},
  {
    id: 'p12',
    beat: '1.2',
    paragraph: 6,
    // Amended (brief, amendment P2): the year is the year of publication.
    text: 'A study of two hundred and five adolescents and adults with ADHD, published in 2024, found initial learning preserved and delayed recall reduced.',
  },
  {id: 'p13', beat: '1.2', paragraph: 6, text: 'Where in the sequence the loss arises is not settled.'},

  // 1.3 Working memory
  {id: 'p14', beat: '1.3', paragraph: 7, text: 'Working memory is the stronger candidate.'},
  {
    id: 'p15',
    beat: '1.3',
    paragraph: 7,
    text: 'In children, the meta-analytic differences are large for spatial tasks, 0.85 for storage and 1.06 for manipulation, and moderate for verbal tasks.',
  },
  {id: 'p16', beat: '1.3', paragraph: 7, text: 'In adults they are moderate for both.'},
  {id: 'p17', beat: '1.3', paragraph: 7, text: 'This deficit is real, and it is replicated.'},
  {id: 'p18', beat: '1.3', paragraph: 8, text: 'But a core deficit has to pass two further tests.'},
  {id: 'p19', beat: '1.3', paragraph: 8, text: 'It should be present in most cases.'},
  {id: 'p20', beat: '1.3', paragraph: 8, text: 'And reducing it should reduce the disorder.'},

  // 1.4 Two tests
  {
    id: 'p21',
    beat: '1.4',
    paragraph: 9,
    text: 'On the first, Willcutt and colleagues pooled eighty-three studies of executive function.',
  },
  {id: 'p22', beat: '1.4', paragraph: 9, text: 'Every measure showed a difference.'},
  {id: 'p23', beat: '1.4', paragraph: 9, text: 'None exceeded 0.69, and the deficits were not universal.'},
  {
    id: 'p24',
    beat: '1.4',
    paragraph: 9,
    text: 'Their conclusion: executive weaknesses are "neither necessary nor sufficient" to cause the disorder.',
  },
  {
    id: 'p25',
    beat: '1.4',
    paragraph: 10,
    // Amended (brief, amendment P3): fifteen trials, reported in sixteen papers.
    text: 'On the second, fifteen randomised trials of cognitive training.',
  },
  {id: 'p26', beat: '1.4', paragraph: 10, text: 'Working memory improved, by about half a standard deviation.'},
  {
    id: 'p27',
    beat: '1.4',
    paragraph: 10,
    text: 'ADHD symptoms, rated by observers probably blind to treatment, improved by 0.20, with a confidence interval that starts at 0.01.',
  },
  {
    id: 'p28',
    beat: '1.4',
    paragraph: 11,
    text: 'Far transfer from training is weak in any population, so this test is not decisive.',
  },
  {id: 'p29', beat: '1.4', paragraph: 11, text: 'It is still not what a core deficit predicts.'},

  // 1.5 Status: memory
  {id: 'p30', beat: '1.5', paragraph: 12, text: 'The status of the first hypothesis.'},
  {
    id: 'p31',
    beat: '1.5',
    paragraph: 12,
    text: 'Memory is involved: encoding and working memory are weaker on average.',
  },
  {id: 'p32', beat: '1.5', paragraph: 12, text: 'As the defining deficit it is not supported.'},
  {
    id: 'p33',
    beat: '1.5',
    paragraph: 12,
    text: 'The effects are moderate, they are absent in many cases, and reducing them does not reduce the disorder.',
  },
];

export const TOTAL_WORDS = NARRATION.reduce((sum, s) => sum + wordCount(s.text), 0);
