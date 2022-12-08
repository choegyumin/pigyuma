import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  width: ['100vw', '100svw'],
  height: ['100vh', '100svh'],
  margin: '0',
  padding: '0',
  border: '0 none',
  fontSize: '14px',
  lineHeight: '1',
  fontWeight: '400',
  background: '#202124',
  userSelect: 'none',
  // @ts-ignore
  '-webkit-app-region': 'no-drag',
});

globalStyle(`:where(${root} *, ${root} *::before, ${root} *::after)`, {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0',
  border: '0 none',
});
