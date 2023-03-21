import { UIInteractionElementDataAttributeName } from '@/types/Identifier';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  width: '0',
  height: '0',
  pointerEvents: 'none',
});

globalStyle(`${root} [${UIInteractionElementDataAttributeName.handleType}]`, {
  pointerEvents: 'auto',
});
