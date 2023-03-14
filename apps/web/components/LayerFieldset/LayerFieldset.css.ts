import foundations from '@pigyuma/design-system/foundations';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: foundations.spacing(2),
});
