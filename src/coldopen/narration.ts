// The narration of the cold open, word for word from script version 3.
// One entry per sentence. Do not edit a sentence here without editing the
// script: tests/narration.test.ts compares this file against the brief.

export type SentenceId =
  | 's01'
  | 's02'
  | 's03'
  | 's04'
  | 's05'
  | 's06'
  | 's07'
  | 's08'
  | 's09'
  | 's10'
  | 's11'
  | 's12'
  | 's13';

export type Sentence = {
  id: SentenceId;
  /** Paragraph of the script the sentence belongs to (1 to 6). */
  paragraph: number;
  text: string;
};

export const NARRATION: readonly Sentence[] = [
  {
    id: 's01',
    paragraph: 1,
    text: 'In 2022, a triple-masked crossover trial tested an assumption that had rarely been tested directly.',
  },
  {
    id: 's02',
    paragraph: 1,
    text: 'One hundred and seventy-three children with ADHD received extended-release methylphenidate for three weeks and placebo for three weeks, in randomised order, while being taught academic content in small groups.',
  },
  {
    id: 's03',
    paragraph: 2,
    text: 'Under methylphenidate, arithmetic output rose by thirty-seven percent per minute, and rule violations fell by fifty-three percent per hour.',
  },
  {
    id: 's04',
    paragraph: 3,
    text: 'The amount of content the children learned did not differ between conditions.',
  },
  // (pause, 2 seconds)
  {id: 's05', paragraph: 4, text: 'The drug did what it is known to do.'},
  {id: 's06', paragraph: 4, text: 'Learning did not follow.'},
  {
    id: 's07',
    paragraph: 5,
    text: 'The expectation that it would follow rests on a model carried in the name of the diagnosis: a deficit.',
  },
  {
    id: 's08',
    paragraph: 5,
    text: 'Three candidates recur, in clinical explanation and in public belief.',
  },
  {id: 's09', paragraph: 5, text: 'A deficit of memory.'},
  {id: 's10', paragraph: 5, text: 'A deficit of attention.'},
  {id: 's11', paragraph: 5, text: 'A deficit of dopamine.'},
  {id: 's12', paragraph: 5, text: 'Each makes predictions that can be checked.'},
  {id: 's13', paragraph: 6, text: 'This film checks them.'},
];

/** Words as the script counts them: whitespace-separated tokens. */
export const wordCount = (text: string): number => text.trim().split(/\s+/).length;

export const TOTAL_WORDS = NARRATION.reduce((sum, s) => sum + wordCount(s.text), 0);
