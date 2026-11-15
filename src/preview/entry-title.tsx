import {registerRoot} from 'remotion';
import {Title} from '../coldopen/figures/Title';
import {previewOf} from './Preview';

registerRoot(previewOf('plain', <Title />));
