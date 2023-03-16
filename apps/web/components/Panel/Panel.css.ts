import foundations from '@pigyuma/design-system/foundations';
import mixins from '@pigyuma/design-system/mixins';
import { style, styleVariants } from '@vanilla-extract/css';
import * as rootVars from '~/styles/rootVars.css';

export const root = style({
  overflow: 'auto',
  width: 241,
  height: 'stretch',
  color: rootVars.panelColor,
  paddingBlock: foundations.spacing(2),
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

export const group = style({
  paddingBlock: foundations.spacing(2),
});

export const heading = style([
  mixins.textCaption,
  {
    margin: 0,
    paddingBlock: foundations.spacing(2),
    paddingInline: foundations.spacing(5),
  },
]);

export const content = style({
  paddingInline: foundations.spacing(5),
});
