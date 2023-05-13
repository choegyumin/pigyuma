import * as rootVars from '@/renderer/styles/rootVars.css';
import { createVar, getVarNames } from '@pigyuma/css-utils';
import { style } from '@vanilla-extract/css';

export const vars = {
  x: createVar(),
  y: createVar(),
  width: createVar(),
  height: createVar(),
  rotate: createVar(),
  visibility: createVar(),
};

export const varNames = getVarNames(vars);

const getter = {
  cssRotate: createVar(),
  overlayBorderWidth: createVar(),
};

export const root = style({
  vars: {
    [vars.x]: '',
    [vars.y]: '',
    [vars.width]: '',
    [vars.height]: '',
    [vars.rotate]: '',
    [vars.visibility]: '',
    /** See {@link https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-and-position#Rotation} */
    [getter.cssRotate]: `calc(${vars.rotate} * -1)`,
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
  border: `${getter.overlayBorderWidth} solid ${rootVars.primaryColor}`,
  rotate: getter.cssRotate,
});
