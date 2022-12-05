import { style } from '@vanilla-extract/css';

export const blindMixin = () => ({
  overflow: 'hidden!important' as 'hidden',
  position: 'absolute!important' as 'absolute',
  zIndex: '-1!important' as '-1',
  width: '1px!important' as '1px',
  height: '1px!important' as '1px',
  margin: '0!important' as '0',
  padding: '0!important' as '0',
  border: '0!important' as '0',
  clip: 'rect(0 0 0 0)!important' as 'rect(0 0 0 0)',
  clipPath: 'inset(50%)!important' as 'inset(50%)',
  pointerEvents: 'none!important' as 'none',
});
export const blindStyle = style(blindMixin());

// for Screen reader to read text within inline elements
export const inlineBlindMixin = () => ({
  display: 'inline-block!important' as 'inline-block',
  position: 'relative!important' as 'relative',
  zIndex: '-1!important' as '-1',
  color: 'transparent!important' as 'transparent',
  background: 'none!important' as 'none',
  width: '1px!important' as '1px',
  height: '1px!important' as '1px',
  margin: '0!important' as '0',
  padding: '0!important' as '0',
  border: '0!important' as '0',
  fontSize: '1px!important' as '1px',
  lineHeight: '0!important' as '0',
  letterSpacing: '-1em!important' as '-1em',
  whiteSpace: 'nowrap!important' as 'nowrap',
  clip: 'rect(0 0 0 0)!important' as 'rect(0 0 0 0)',
  clipPath: 'inset(50%)!important' as 'inset(50%)',
  pointerEvents: 'none!important' as 'none',
});
export const inlineBlindStyle = style(inlineBlindMixin());
