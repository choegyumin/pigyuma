import { UIRecordElementDataAttributeName } from '@/types/Identifier';
import { UIRecordStyleVarNames, UIRecordStyleVars } from '@/types/Style';
import foundations from '@pigyuma/design-system/foundations';
import { mapEntries, pick } from '@pigyuma/utils';
import { globalStyle, style } from '@vanilla-extract/css';

const pickedVars = ['x', 'y', 'width', 'height', 'background'] as const;

export const varNames = pick(UIRecordStyleVarNames, pickedVars);

export const vars = pick(UIRecordStyleVars, pickedVars);

const emptyVars = mapEntries(vars, (value) => [value, '' as const]);

export const root = style({
  vars: emptyVars,
  position: 'absolute',
  transform: `translate3d(${vars.x}, ${vars.y}, 0)`,
  width: vars.width,
  height: vars.height,
  background: vars.background,
  pointerEvents: 'none',
});

export const name = style({
  position: 'absolute',
  left: 0,
  bottom: '100%',
  padding: `0 ${foundations.spacing(1)} ${foundations.spacing(2)}`,
  fontSize: 11,
  color: foundations.color.neutral.white,
  opacity: 0.5,
  pointerEvents: 'auto',
  selectors: {
    [`${root}[${UIRecordElementDataAttributeName.selected}="true"] &, &:hover`]: {
      color: foundations.color.accent.primary,
      opacity: 1,
    },
  },
});

export const frame = style({
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  pointerEvents: 'none',
  selectors: {
    [`${root}[${UIRecordElementDataAttributeName.selected}="true"] &`]: {
      pointerEvents: 'auto',
    },
  },
});

globalStyle(`:where(${frame} > *)`, {
  vars: emptyVars,
  pointerEvents: 'auto',
});
