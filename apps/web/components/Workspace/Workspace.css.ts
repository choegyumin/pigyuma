import { style } from '@vanilla-extract/css';

export const root = style({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  width: '100svw',
  height: '100svh',
});

export const container = style({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
});
