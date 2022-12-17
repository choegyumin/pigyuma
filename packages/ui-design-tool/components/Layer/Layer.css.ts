import { pick } from '@pigyuma/utils';
import { vars as uiRecordVars, varNames as uiRecordVarNames } from '../UIRecord/UIRecord.css';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate'] as const;

export const varNames = pick(uiRecordVarNames, pickedVars);

export const vars = pick(uiRecordVars, pickedVars);
