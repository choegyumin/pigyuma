import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  boxSizing: 'border-box',
  position: 'relative',
  width: ['100vw', '100svw'],
  height: ['100vh', '100svh'],
  margin: '0',
  padding: '0',
  border: '0 none',
  fontSize: '16px',
  lineHeight: '1',
  fontWeight: '400',
});

globalStyle(`${root} *::before, ${root} *::fater,`, {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0',
  border: '0 none',
});
