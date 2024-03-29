import { createVar, getVarNames } from '@pigyuma/css-utils';
import { style } from '@vanilla-extract/css';

export const vars = {
  cursor: createVar(),
  visibility: createVar(),
};

export const varNames = getVarNames(vars);

export const root = style({
  vars: {
    [vars.cursor]: '',
    [vars.visibility]: '',
  },
  visibility: vars.visibility,
  position: 'fixed',
  zIndex: 16777271,
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  opacity: '0',
  cursor: vars.cursor,
});
