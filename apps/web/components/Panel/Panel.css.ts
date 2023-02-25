import { style, styleVariants } from '@vanilla-extract/css';
import * as rootVars from '~/styles/rootVars.css';

export const root = style({
  overflow: 'auto',
  width: 241,
  height: 'stretch',
  color: rootVars.panelColor,
  border: `0 ${rootVars.panelBorderStyle} ${rootVars.panelBorderColor}`,
  background: rootVars.panelBackground,
});

export const root$ = styleVariants({
  left: {
    order: -1,
    borderRightWidth: rootVars.panelBorderWidth,
  },
  right: {
    order: 1,
    borderLeftWidth: rootVars.panelBorderWidth,
  },
});
