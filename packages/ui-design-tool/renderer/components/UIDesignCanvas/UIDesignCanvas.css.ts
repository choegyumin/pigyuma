import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  direction: 'ltr',
  writingMode: 'horizontal-tb',
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  width: '100%',
  height: '100%',
  margin: '0',
  padding: '0',
  border: '0 none',
  fontSize: '14px',
  lineHeight: '1',
  fontWeight: '400',
  background: '#202124',
  userSelect: 'none',
  outline: '0',
  // @ts-ignore
  '-webkit-app-region': 'no-drag',
});

export const root_mode = styleVariants({
  select: {
    cursor: 'default',
  },
  artboard: {
    cursor: 'crosshair !important',
  },
  shape: {
    cursor: 'crosshair !important',
  },
  text: {
    cursor: 'text !important',
  },
  hand: {
    cursor: 'grab !important',
  },
});

globalStyle(`${root_mode.artboard} *`, {
  cursor: 'crosshair !important',
});

globalStyle(`${root_mode.shape} *`, {
  cursor: 'crosshair !important',
});

globalStyle(`${root_mode.text} *`, {
  cursor: 'text !important',
});

export const ui = style({
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
});

globalStyle(`:where(${ui} *, ${ui} *::before, ${ui} *::after)`, {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0',
  border: '0 none',
});
