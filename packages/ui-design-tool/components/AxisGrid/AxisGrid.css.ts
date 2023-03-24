import { createVar, getVarNames } from '@pigyuma/css-utils';
import foundations from '@pigyuma/design-system/foundations';
import { style, styleVariants } from '@vanilla-extract/css';

export const vars = {
  x: createVar(),
  y: createVar(),
  axisXLeft: createVar(),
  axisXRight: createVar(),
  axisXLength: createVar(),
  axisYTop: createVar(),
  axisYBottom: createVar(),
  axisYLength: createVar(),
  visibility: createVar(),
};

export const varNames = getVarNames(vars);

const getter = {
  axisBorderWidth: createVar(),
};

export const root = style({
  vars: {
    [vars.x]: '',
    [vars.y]: '',
    [vars.axisXLeft]: '',
    [vars.axisXRight]: '',
    [vars.axisXLength]: '',
    [vars.axisYTop]: '',
    [vars.axisYBottom]: '',
    [vars.axisYLength]: '',
    [vars.visibility]: '',
    [getter.axisBorderWidth]: '1px',
  },
  position: 'absolute',
  top: '0',
  left: '0',
  width: getter.axisBorderWidth,
  height: getter.axisBorderWidth,
  transform: `translate3d(${vars.x}, ${vars.y}, 0)`,
  visibility: vars.visibility,
});

export const axis = style({
  position: 'absolute',
  margin: 'auto',
  width: '0',
  height: '0',
  border: `0 dashed ${foundations.color.accent.primary}`,
});

export const axis_direction = styleVariants({
  x: {
    top: '0',
    right: vars.axisXRight,
    left: vars.axisXLeft,
    width: vars.axisXLength,
    borderTopWidth: getter.axisBorderWidth,
  },
  y: {
    left: '0',
    top: vars.axisYTop,
    bottom: vars.axisYBottom,
    height: vars.axisYLength,
    borderLeftWidth: getter.axisBorderWidth,
  },
});
