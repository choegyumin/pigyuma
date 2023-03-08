import { style } from '@vanilla-extract/css';
import foundations from '@/foundations';

export const root = style({
  color: 'white',
  background: foundations.color.accent.primary,
});
