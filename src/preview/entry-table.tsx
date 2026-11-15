import {registerRoot} from 'remotion';
import {DeficitTable} from '../coldopen/figures/DeficitTable';
import {previewOf} from './Preview';

registerRoot(previewOf('table', <DeficitTable />));
