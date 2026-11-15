import {registerRoot} from 'remotion';
import {CrossoverDiagram} from '../coldopen/figures/CrossoverDiagram';
import {previewOf} from './Preview';

registerRoot(previewOf('figure', <CrossoverDiagram />));
