import { UIRecordStyleVarNames, UIRecordStyleVars } from '@/types/Style';
import { createVar } from '@pigyuma/css-utils';
import { mapEntries, pick } from '@pigyuma/utils';
import { globalStyle, style } from '@vanilla-extract/css';

const pickedVars = ['x', 'y', 'width', 'height', 'rotate', 'textColor', 'fontSize', 'lineHeight', 'fontWeight', 'letterSpacing'] as const;

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
  display: 'inline-block',
  /** @todo 부모 UIRecord와 자신 UIRecord의 스타일을 따라가도록 개선 */
  position: 'relative',
  top: vars.y,
  left: vars.x,
  rotate: getter.cssRotate,
  width: vars.width,
  height: vars.height,
  color: vars.textColor,
  fontSize: vars.fontSize,
  lineHeight: vars.lineHeight,
  fontWeight: vars.fontWeight,
  letterSpacing: vars.letterSpacing,
  contentVisibility: 'auto',
});

globalStyle(`:where(${root} > *)`, {
  vars: emptyVars,
});
