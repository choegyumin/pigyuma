import foundations from '@pigyuma/design-system/foundations';
import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({});

export const button = style({
  aspectRatio: '1',
  height: '100%',
  fontSize: 20,
  transition: `background ${foundations.transition.duration.fast} ${foundations.transition.easing.easeOut}`,
  selectors: {
    '&:where(:hover)': {
      background: foundations.color.neutral.black,
    },
  },
});

export const button$ = styleVariants({
  selected: {
    background: foundations.color.accent.primary,
  },
});
