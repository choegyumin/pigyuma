import { getVarNames } from '@pigyuma/ui/styles/extensions';
import { createVar, style } from '@vanilla-extract/css';

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
