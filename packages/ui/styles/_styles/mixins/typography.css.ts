import foundations from '@/styles/foundations';
import { style } from '@vanilla-extract/css';

export const textBodyMixin = () => ({
  letterSpacing: foundations.typography.styles.body.letterSpacing,
  lineHeight: foundations.typography.styles.body.lineHeight,
  fontFamily: foundations.typography.styles.body.fontFamily,
  fontSize: foundations.typography.styles.body.fontSize,
  fontVariant: foundations.typography.styles.body.fontVariant,
  fontWeight: foundations.typography.styles.body.fontWeight,
});
export const textBodyStyle = style(textBodyMixin());
