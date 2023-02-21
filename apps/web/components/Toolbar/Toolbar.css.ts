import { style } from '@vanilla-extract/css';
import * as rootVars from '~/styles/rootVars.css';

export const root = style({
  width: 'stretch',
  height: 49,
  color: rootVars.toolbarColor,
  borderBottom: `${rootVars.toolbarBorderWidth} ${rootVars.toolbarBorderStyle} ${rootVars.toolbarBorderColor}`,
  background: rootVars.toolbarBackground,
});
