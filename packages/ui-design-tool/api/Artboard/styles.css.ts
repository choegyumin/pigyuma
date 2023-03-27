import * as rootVars from '@/styles/rootVars.css';
import { UIRecordElementDataAttributeName } from '@/types/Identifier';
import { UIRecordStyleVarNames, UIRecordStyleVars } from '@/types/Style';
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
});

export const name = style({
  position: 'absolute',
  left: 0,
  bottom: '100%',
  padding: '0 4px 8px',
  fontSize: 11,
  color: '#fff',
  opacity: 0.5,
  whiteSpace: 'nowrap',
  selectors: {
    [`${root}[${UIRecordElementDataAttributeName.selected}="true"] &, &:hover`]: {
      color: rootVars.primaryColor,
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
  selectors: {
    [`${root}[${UIRecordElementDataAttributeName.selected}="true"] &`]: {},
  },
});

globalStyle(`:where(${frame} > *)`, {
  vars: emptyVars,
});
