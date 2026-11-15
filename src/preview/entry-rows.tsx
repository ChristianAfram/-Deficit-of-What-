import {registerRoot} from 'remotion';
import {ResultRows} from '../coldopen/figures/ResultRows';
import {previewOf} from './Preview';

registerRoot(previewOf('figure', <ResultRows standalone />));
