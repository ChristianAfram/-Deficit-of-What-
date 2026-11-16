// The kit's fonts module loads its faces into a browser, where a render
// happens. A test runs in Node, where there is no page to load a face into,
// so a test that reads the type roles gets a loader that does nothing.

import {vi} from 'vitest';

vi.mock('@remotion/fonts', () => ({loadFont: () => Promise.resolve()}));
