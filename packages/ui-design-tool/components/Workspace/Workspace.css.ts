import { style } from '@vanilla-extract/css';

export default {
  root: style({
    boxSizing: 'border-box',
    selectors: {
      '&::before, &::after': {
        boxSizing: 'border-box',
      },
    },
  }),
};
