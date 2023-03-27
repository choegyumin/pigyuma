import { style } from '@vanilla-extract/css';
import foundations from '@/foundations';

export const root = style({
  color: foundations.color.neutral.white,
  background: foundations.color.accent.primary,
});
