import foundations from '@pigyuma/design-system/foundations';
import mixins from '@pigyuma/design-system/mixins';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style([
  mixins.textBody2,
  {
    display: 'flex',
  },
]);

export const label = style({
  width: '60px',
  flex: '0 0 60px',
  marginInlineEnd: foundations.spacing(2),
  lineHeight: '32px',
});

export const content = style({
  display: 'flex',
  flex: '1 1 auto',
  flexWrap: 'wrap',
  width: '0px',
  gap: foundations.spacing(1),
});

globalStyle(`${content} > *`, {
  flex: '1 1 auto',
  maxWidth: 'stretch',
});
