import foundations from '@pigyuma/ui/styles/foundations';
import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { getVarName } from '@vanilla-extract/private';

export const vars = {
  visibility: createVar(),
  x: createVar(),
  y: createVar(),
  axisXLeft: createVar(),
  axisXRight: createVar(),
  axisXLength: createVar(),
  axisYTop: createVar(),
  axisYBottom: createVar(),
  axisYLength: createVar(),
};

/** @todo 반복문으로 자동화 및 모듈 분리 */
export const varNames = {
  visibility: getVarName(vars.visibility),
  x: getVarName(vars.x),
  y: getVarName(vars.y),
  axisXLeft: getVarName(vars.axisXLeft),
  axisXRight: getVarName(vars.axisXRight),
  axisXLength: getVarName(vars.axisXLength),
  axisYTop: getVarName(vars.axisYTop),
  axisYBottom: getVarName(vars.axisYBottom),
  axisYLength: getVarName(vars.axisYLength),
};

const getter = {
  axisBorderWidth: createVar(),
};

export const root = style({
  vars: {
    [vars.visibility]: '',
    [vars.x]: '',
    [vars.y]: '',
    [vars.axisXLeft]: '',
    [vars.axisXRight]: '',
    [vars.axisXLength]: '',
    [vars.axisYTop]: '',
    [vars.axisYBottom]: '',
    [vars.axisYLength]: '',
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

export const axis$ = styleVariants({
  x: [
    axis,
    {
      top: '0',
      right: vars.axisXRight,
      left: vars.axisXLeft,
      width: vars.axisXLength,
      borderTopWidth: getter.axisBorderWidth,
    },
  ],
  y: [
    axis,
    {
      left: '0',
      top: vars.axisYTop,
      bottom: vars.axisYBottom,
      height: vars.axisYLength,
      borderLeftWidth: getter.axisBorderWidth,
    },
  ],
});
