import { createVar, getVarNames } from '@pigyuma/css-utils';
import foundations from '@pigyuma/design-system/foundations';
import mixins from '@pigyuma/design-system/mixins';
import { style, styleVariants } from '@vanilla-extract/css';

export const vars = {
  display: createVar(),
  depth: createVar(),
};
export const varNames = getVarNames(vars);

export const row = style({});

export const row_state = styleVariants({
  selected: {
    background: foundations.color.accent.primary,
    color: '#fff',
  },
});

export const item = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '32px',
  paddingInline: `calc(${foundations.spacing(2)} + (20px * ${vars.depth})) ${foundations.spacing(2)}`,
});

export const icon = style({
  marginInlineEnd: foundations.spacing(2),
  color: '#999',
  fontSize: 16,
  verticalAlign: 'middle',
  selectors: {
    [`${row_state.selected} &`]: {
      color: '#fff',
    },
  },
});

export const name = style({
  flex: '0 0 auto',
  width: 'calc(100% - 32px)',
  overflow: 'hidden',
  position: 'relative',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  cursor: 'default',
  userSelect: 'none',
});

export const toggle = style({
  order: -1,
  flex: '0 0 auto',
  width: '32px',
  aspectRatio: '1',
  textAlign: 'center',
  color: '#999',
  selectors: {
    '&::after': {
      content: '',
      display: 'inline-block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '3px 0 3px 3px',
      borderColor: 'transparent transparent transparent currentColor',
      verticalAlign: 'middle',
      transition: `rotate ${foundations.transition.duration.fast} ${foundations.transition.easing.easeOut}`,
    },
    [`${row_state.selected} &`]: {
      color: '#fff',
    },
  },
});

export const toggle_state = styleVariants({
  expanded: {
    selectors: {
      '&::after': {
        rotate: '90deg',
      },
    },
  },
});

export const root = style([
  mixins.textBody2,
  {
    vars: {
      [vars.display]: 'block',
      [vars.depth]: '0',
    },
    display: vars.display,
    margin: 0,
    padding: 0,
    listStyle: 'none',
    selectors: {
      [`${row_state.selected} > &`]: {
        background: 'hsl(222 28% 34%)',
      },
    },
  },
]);
