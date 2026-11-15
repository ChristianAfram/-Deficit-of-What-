// The film's two typefaces, bundled with the project and loaded from local
// files, so a render never needs the network.
//
// Script, "The look": "One condensed sans for tags and table heads. One text
// sans with tabular figures for numbers and citations."

import {loadFont} from '@remotion/fonts';
import {cancelRender, continueRender, delayRender} from 'remotion';
import barlow500 from '@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2';
import barlow600 from '@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2';
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2';
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff2';
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff2';

export const FONT = {
  /** Tags, marks, labels, table heads, DEFICIT and the title. */
  condensed: 'Barlow Condensed',
  /** Citations, numbers, notes, captions. Always set with tabular figures. */
  text: 'Inter',
} as const;

const faces: {family: string; url: string; weight: string}[] = [
  {family: FONT.condensed, url: barlow500, weight: '500'},
  {family: FONT.condensed, url: barlow600, weight: '600'},
  {family: FONT.text, url: inter400, weight: '400'},
  {family: FONT.text, url: inter500, weight: '500'},
  {family: FONT.text, url: inter600, weight: '600'},
];

// No frame is rendered until every face is ready, so no frame can fall back
// to a system font.
const handle = delayRender('Loading Barlow Condensed and Inter');
Promise.all(faces.map((face) => loadFont(face)))
  .then(() => continueRender(handle))
  .catch((error) => cancelRender(error));
