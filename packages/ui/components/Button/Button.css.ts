import { style } from '@vanilla-extract/css';
import foundations from '@pigyuma/ui/styles/foundations';

export default {
  root: style({
    color: 'white',
    background: foundations.color.accent.primary,
  }),
};
