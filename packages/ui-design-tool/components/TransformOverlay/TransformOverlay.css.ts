import { getVarNames } from '@pigyuma/design-system/extensions';
import foundations from '@pigyuma/design-system/foundations';
import { createVar, style, styleVariants } from '@vanilla-extract/css';

export const vars = {
  x: createVar(),
  y: createVar(),
  width: createVar(),
  height: createVar(),
  rotate: createVar(),
  visibility: createVar(),
  handleVisibility: createVar(),
  infoVisibility: createVar(),
  outlineVisibility: createVar(),
};

export const varNames = getVarNames(vars);

const getter = {
  cssRotate: createVar(),
  overlayBorderWidth: createVar(),
  handleSize: createVar(),
  handleCoordinate: createVar(),
};

export const root = style({
  vars: {
    [vars.x]: '',
    [vars.y]: '',
    [vars.width]: '',
    [vars.height]: '',
    [vars.rotate]: '',
    [vars.visibility]: '',
    [vars.handleVisibility]: '',
    [vars.infoVisibility]: '',
    [vars.outlineVisibility]: '',
    /** @see {@link https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-and-position#Rotation} */
    [getter.cssRotate]: `calc(${vars.rotate} * -1)`,
    [getter.overlayBorderWidth]: '2px',
    [getter.handleSize]: '16px',
    [getter.handleCoordinate]: `calc(100% - (${getter.handleSize} / 2) + (${getter.overlayBorderWidth} / 2))`,
  },
  position: 'absolute',
  top: '0',
  left: '0',
  width: '0',
  height: '0',
  transform: `translate3d(${vars.x}, ${vars.y}, 0)`,
  visibility: vars.visibility,
});

export const wrapper = style({
  position: 'relative',
  top: `calc(${vars.height} / 2 * -1)`,
  left: `calc(${vars.width} / 2 * -1)`,
  width: vars.width,
  height: vars.height,
  rotate: getter.cssRotate,
});

export const outline = style({
  visibility: vars.outlineVisibility,
  boxSizing: 'content-box',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  margin: `calc(${getter.overlayBorderWidth} * -1) 0 0 calc(${getter.overlayBorderWidth} * -1)`,
  border: `${getter.overlayBorderWidth} solid ${foundations.color.accent.primary}`,
});

export const resizeHandle = style({
  position: 'absolute',
  opacity: '0',
  cursor: 'grab',
  pointerEvents: 'auto',
});

export const resizeHandle$ = styleVariants({
  top: {
    bottom: getter.handleCoordinate,
    left: '0',
    right: '0',
    height: getter.handleSize,
  },
  right: {
    left: getter.handleCoordinate,
    top: '0',
    bottom: '0',
    width: getter.handleSize,
  },
  bottom: {
    top: getter.handleCoordinate,
    left: '0',
    right: '0',
    height: getter.handleSize,
  },
  left: {
    right: getter.handleCoordinate,
    top: '0',
    bottom: '0',
    width: getter.handleSize,
  },
});

export const resizeCornerHandle = style({
  visibility: vars.handleVisibility,
  position: 'absolute',
  width: getter.handleSize,
  height: getter.handleSize,
  padding: '3px',
  cursor: 'grab',
  pointerEvents: 'auto',
  selectors: {
    '&::before': {
      content: '',
      display: 'block',
      width: '100%',
      height: '100%',
      border: `2px solid ${foundations.color.accent.primary}`,
      background: foundations.color.neutral.white,
    },
  },
});

export const resizeCornerHandle$ = styleVariants({
  topLeft: {
    bottom: getter.handleCoordinate,
    right: getter.handleCoordinate,
  },
  topRight: {
    bottom: getter.handleCoordinate,
    left: getter.handleCoordinate,
  },
  bottomRight: {
    top: getter.handleCoordinate,
    left: getter.handleCoordinate,
  },
  bottomLeft: {
    top: getter.handleCoordinate,
    right: getter.handleCoordinate,
  },
});

export const rotateHandle = style({
  position: 'absolute',
  width: `calc(${getter.handleSize} * 1.5)`,
  height: `calc(${getter.handleSize} * 1.5)`,
  opacity: '0',
  cursor: 'grab',
  pointerEvents: 'auto',
});

export const rotateHandle$ = styleVariants({
  topLeft: {
    bottom: getter.handleCoordinate,
    right: getter.handleCoordinate,
  },
  topRight: {
    bottom: getter.handleCoordinate,
    left: getter.handleCoordinate,
  },
  bottomRight: {
    top: getter.handleCoordinate,
    left: getter.handleCoordinate,
  },
  bottomLeft: {
    top: getter.handleCoordinate,
    right: getter.handleCoordinate,
  },
});

export const info = style({
  visibility: vars.infoVisibility,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
  width: 'max-content',
  padding: foundations.spacing(2),
  borderRadius: '8px',
  color: foundations.color.neutral.white,
  background: `hsl(0 0% 0% / 50%)`,
});
