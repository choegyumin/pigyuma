import { createVar, getVarNames } from '@pigyuma/css-utils';
import { style } from '@vanilla-extract/css';

export const vars = {
  color: createVar(),
};
export const varNames = getVarNames(vars);

export const root = style({
  vars: {
    [vars.color]: '#000',
  },
  position: 'relative',
  display: 'inline-flex',
});

export const trigger = style({
  minWidth: 97,
  whiteSpace: 'nowrap',
});

export const picker = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
});

export const color = style({
  display: 'inline-block',
  position: 'relative',
  height: 18,
  aspectRatio: '1',
  verticalAlign: 'top',
  marginInlineEnd: 7,
  background:
    'linear-gradient(45deg, #bfbfbf 25%, transparent 25%),linear-gradient(-45deg, #bfbfbf 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #bfbfbf 75%),linear-gradient(-45deg, transparent 75%, #bfbfbf 75%), #fff',
  backgroundSize: '18px 18px',
  backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: vars.color,
    },
  },
});
