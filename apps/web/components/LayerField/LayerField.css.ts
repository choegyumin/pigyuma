import foundations from '@pigyuma/design-system/foundations';
import mixins from '@pigyuma/design-system/mixins';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style([
  mixins.textBody2,
  {
    display: 'block',
  },
]);

export const label = style({
  float: 'left',
  width: '60px',
  flex: '0 0 60px',
  marginRight: foundations.spacing(2),
  lineHeight: '32px',
});

export const content = style({
  display: 'flex',
  flexWrap: 'wrap',
  width: 'stretch',
  gap: foundations.spacing(1),
});

globalStyle(`${content} > *`, {
  flex: '1 1 auto',
  maxWidth: 'stretch',
});
