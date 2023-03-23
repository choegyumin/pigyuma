import { globalStyle, style } from '@vanilla-extract/css';
import foundations from '@/foundations';

export const root = style({
  position: 'relative',
  display: 'inline-flex',
  width: 'stretch',
  minHeight: '32px',
});

globalStyle(`${root} > input, ${root} > textarea, ${root} > button`, {
  width: 'stretch',
  paddingBlock: '7px',
  paddingInline: '11px',
  color: foundations.color.neutral.white,
  border: '0',
  borderRadius: '6px',
  background: 'hsl(215 8% 16%)',
  fontSize: '12px',
  lineHeight: '1.5',
  textAlign: 'left',
});

globalStyle(`${root} > input:focus, ${root} > textarea:focus, ${root} > button:focus`, {
  outline: 0,
  boxShadow: `inset 0 0 0 2px ${foundations.color.accent.primary}`,
});

globalStyle(`${root} > input::placeholder, ${root} > textarea::placeholder`, {
  color: `hsl(0 0% 100% / 0.5)`,
});

globalStyle(`${root} > input:read-only, ${root} > textarea:read-only`, {
  cursor: 'default',
});

globalStyle(`${root} > input:disabled, ${root} > textarea:disabled`, {
  color: `hsl(0 0% 100% / 0.2)`,
  cursor: 'default',
});
