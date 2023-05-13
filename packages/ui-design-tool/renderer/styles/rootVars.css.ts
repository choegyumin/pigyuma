import { createGlobalVar } from '@pigyuma/css-utils';
import { root } from '../components/UIDesignCanvas/UIDesignCanvas.css';

const v = <T extends string>(name: T, value: string) => createGlobalVar(root, name, value);

export const primaryColor = v('primaryColor', 'hsl(215 92% 58%)');
