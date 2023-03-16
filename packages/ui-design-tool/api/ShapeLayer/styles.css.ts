import { UIRecordStyleVarNames, UIRecordStyleVars } from '@/types/Style';
import { createVar } from '@pigyuma/css-utils';
import { mapEntries, pick } from '@pigyuma/utils';
import { globalStyle, style } from '@vanilla-extract/css';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate', 'strokeColor', 'strokePattern', 'strokeWidth', 'background'] as const;

export const varNames = pick(UIRecordStyleVarNames, pickedVars);

export const vars = pick(UIRecordStyleVars, pickedVars);

const emptyVars = mapEntries(vars, (value) => [value, '' as const]);

const getter = {
  cssRotate: createVar(),
};

export const root = style({
  vars: {
    ...emptyVars,
    /** @see {@link https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-and-position#Rotation} */
    [getter.cssRotate]: `calc(${vars.rotate} * -1)`,
  },
  display: 'block',
  boxSizing: 'border-box',
  /** @todo 부모 UIRecord와 자신 UIRecord의 스타일을 따라가도록 개선 */
  position: 'absolute',
  top: vars.y,
  left: vars.x,
  rotate: getter.cssRotate,
  width: vars.width,
  height: vars.height,
  border: `0 ${vars.strokePattern} ${vars.strokeColor}`,
  borderWidth: vars.strokeWidth,
  background: vars.background,
  contentVisibility: 'auto',
});

globalStyle(`:where(${root} > *)`, {
  vars: emptyVars,
});
