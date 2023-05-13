import { UIRecordStyleVarNames, UIRecordStyleVars } from '@/types/Style';
import { pick } from '@pigyuma/utils';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate'] as const;

export const varNames = pick(UIRecordStyleVarNames, pickedVars);

export const vars = pick(UIRecordStyleVars, pickedVars);
