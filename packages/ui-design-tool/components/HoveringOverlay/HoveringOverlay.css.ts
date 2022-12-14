import foundations from '@pigyuma/ui/styles/foundations';
import { createVar, style } from '@vanilla-extract/css';
import { getVarName } from '@vanilla-extract/private';

export const vars = {
  visibility: createVar(),
  x: createVar(),
  y: createVar(),
  width: createVar(),
  height: createVar(),
  degrees: createVar(),
};

/** @todo 반복문으로 자동화 및 모듈 분리 */
export const varNames = {
  visibility: getVarName(vars.visibility),
  x: getVarName(vars.x),
  y: getVarName(vars.y),
  width: getVarName(vars.width),
  height: getVarName(vars.height),
  degrees: getVarName(vars.degrees),
};

const getter = {
  rotate: createVar(),
  overlayBorderWidth: createVar(),
};

export const root = style({
  vars: {
    [vars.visibility]: '',
    [vars.x]: '',
    [vars.y]: '',
    [vars.width]: '',
    [vars.height]: '',
    [vars.degrees]: '',
    [getter.rotate]: `calc(${vars.degrees} * -1)`,
    [getter.overlayBorderWidth]: '2.5px',
  },
  boxSizing: 'content-box',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '0',
  height: '0',
  transform: `translate3d(${vars.x}, ${vars.y}, 0)`,
  visibility: vars.visibility,
});

export const outline = style({
  boxSizing: 'content-box',
  position: 'absolute',
  top: `calc(${vars.height} / 2 * -1)`,
  left: `calc(${vars.width} / 2 * -1)`,
  width: vars.width,
  height: vars.height,
  margin: `calc(${getter.overlayBorderWidth} * -1) 0 0 calc(${getter.overlayBorderWidth} * -1)`,
  border: `${getter.overlayBorderWidth} solid ${foundations.color.accent.primary}`,
  rotate: getter.rotate,
});
