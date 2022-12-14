import foundations from '@pigyuma/ui/styles/foundations';
import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { getVarName } from '@vanilla-extract/private';

export const vars = {
  visibility: createVar(),
  x: createVar(),
  y: createVar(),
  width: createVar(),
  height: createVar(),
  degrees: createVar(),
  outlineOpacity: createVar(),
  resizeHandleOpacity: createVar(),
  transformOpacity: createVar(),
};

/** @todo 반복문으로 자동화 및 모듈 분리 */
export const varNames = {
  visibility: getVarName(vars.visibility),
  x: getVarName(vars.x),
  y: getVarName(vars.y),
  width: getVarName(vars.width),
  height: getVarName(vars.height),
  degrees: getVarName(vars.degrees),
  outlineOpacity: getVarName(vars.outlineOpacity),
  resizeHandleOpacity: getVarName(vars.resizeHandleOpacity),
  transformOpacity: getVarName(vars.transformOpacity),
};

const getter = {
  rotate: createVar(),
  overlayBorderWidth: createVar(),
  handleSize: createVar(),
  handleCoordinate: createVar(),
};

export const root = style({
  vars: {
    [vars.visibility]: '',
    [vars.x]: '',
    [vars.y]: '',
    [vars.width]: '',
    [vars.height]: '',
    [vars.degrees]: '',
    [vars.outlineOpacity]: '',
    [vars.resizeHandleOpacity]: '',
    [vars.transformOpacity]: '',
    [getter.rotate]: `calc(${vars.degrees} * -1)`,
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
  rotate: getter.rotate,
});

export const outline = style({
  boxSizing: 'content-box',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  margin: `calc(${getter.overlayBorderWidth} * -1) 0 0 calc(${getter.overlayBorderWidth} * -1)`,
  border: `${getter.overlayBorderWidth} solid ${foundations.color.accent.primary}`,
  opacity: vars.outlineOpacity,
});

export const resizeHandle = style({
  position: 'absolute',
  opacity: '0',
  pointerEvents: 'auto',
});

/** @todo cursor를 --degrees 값에 따라 변경 */
export const resizeHandle$ = styleVariants({
  top: [
    resizeHandle,
    {
      bottom: getter.handleCoordinate,
      left: '0',
      right: '0',
      height: getter.handleSize,
      cursor: 'ns-resize',
    },
  ],
  right: [
    resizeHandle,
    {
      left: getter.handleCoordinate,
      top: '0',
      bottom: '0',
      width: getter.handleSize,
      cursor: 'ew-resize',
    },
  ],
  bottom: [
    resizeHandle,
    {
      top: getter.handleCoordinate,
      left: '0',
      right: '0',
      height: getter.handleSize,
      cursor: 'ns-resize',
    },
  ],
  left: [
    resizeHandle,
    {
      right: getter.handleCoordinate,
      top: '0',
      bottom: '0',
      width: getter.handleSize,
      cursor: 'ew-resize',
    },
  ],
});

/** @todo cursor를 --degrees 값에 따라 변경 */
export const resizeRatioHandle = style({
  position: 'absolute',
  width: getter.handleSize,
  height: getter.handleSize,
  padding: '3px',
  opacity: vars.resizeHandleOpacity,
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

export const resizeRatioHandle$ = styleVariants({
  topLeft: [
    resizeRatioHandle,
    {
      bottom: getter.handleCoordinate,
      right: getter.handleCoordinate,
      cursor: 'nwse-resize',
    },
  ],
  topRight: [
    resizeRatioHandle,
    {
      bottom: getter.handleCoordinate,
      left: getter.handleCoordinate,
      cursor: 'nesw-resize',
    },
  ],
  bottomRight: [
    resizeRatioHandle,
    {
      top: getter.handleCoordinate,
      left: getter.handleCoordinate,
      cursor: 'nwse-resize',
    },
  ],
  bottomLeft: [
    resizeRatioHandle,
    {
      top: getter.handleCoordinate,
      right: getter.handleCoordinate,
      cursor: 'nesw-resize',
    },
  ],
});

export const rotateHandle = style({
  position: 'absolute',
  width: `calc(${getter.handleSize} * 1.5)`,
  height: `calc(${getter.handleSize} * 1.5)`,
  pointerEvents: 'auto',
});

/** @todo cursor를 --degrees 값에 따라 변경 */
export const rotateHandle$ = styleVariants({
  topLeft: [
    rotateHandle,
    {
      bottom: getter.handleCoordinate,
      right: getter.handleCoordinate,
      cursor: 'var(--nw-rotate)',
    },
  ],
  topRight: [
    rotateHandle,
    {
      bottom: getter.handleCoordinate,
      left: getter.handleCoordinate,
      cursor: 'var(--ne-rotate)',
    },
  ],
  bottomRight: [
    rotateHandle,
    {
      top: getter.handleCoordinate,
      left: getter.handleCoordinate,
      cursor: 'var(--se-rotate)',
    },
  ],
  bottomLeft: [
    rotateHandle,
    {
      top: getter.handleCoordinate,
      right: getter.handleCoordinate,
      cursor: 'var(--sw-rotate)',
    },
  ],
});

export const transform = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%)`,
  width: 'max-content',
  padding: foundations.spacing(2),
  borderRadius: '8px',
  color: foundations.color.neutral.white,
  background: `hsl(0 0% 0% / 50%)`,
  opacity: vars.transformOpacity,
});
