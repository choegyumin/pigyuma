import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  display: 'inline-flex',
});

export const trigger = style({
  minWidth: 97,
});

export const select = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
});
