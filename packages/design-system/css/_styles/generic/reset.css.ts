import { globalStyle } from '@vanilla-extract/css';
import foundations from '@/foundations';

const BUTTON_INPUT_TYPE_SELECTOR = '[type="button" i], [type="image" i], [type="reset" i], [type="submit" i]';
const IMAEG_BUTTON_INPUT_TYPE_SELECTOR = '[type="button" i], [type="image" i], [type="reset" i], [type="submit" i]';
const HIDDEN_INPUT_TYPE_SELECTOR = '[type="hidden" i]';

globalStyle(`:where(button, input:where(${BUTTON_INPUT_TYPE_SELECTOR}))`, {
  all: 'unset',
  textAlign: 'center',
});

globalStyle(':where(:focus, :focus-visible, :focus-within)', {
  outline: `${foundations.system.interaction.focusRingColor} none 0`,
});

globalStyle(
  `
  :where(:is(input:not(${BUTTON_INPUT_TYPE_SELECTOR}, ${IMAEG_BUTTON_INPUT_TYPE_SELECTOR}, ${HIDDEN_INPUT_TYPE_SELECTOR}), select):focus),
  :where(:not(input:not(${BUTTON_INPUT_TYPE_SELECTOR}, ${IMAEG_BUTTON_INPUT_TYPE_SELECTOR}), select):focus-visible)
  `,
  {
    outlineStyle: 'auto',
    outlineWidth: 'medium',
  },
);

globalStyle(':where([tabindex^="-"]:is(:focus, :focus-visible))', {
  outlineStyle: 'none',
  outlineWidth: '0',
});

globalStyle('html', {
  color: foundations.system.base.color,
});

globalStyle('body', {
  letterSpacing: foundations.system.base.letterSpacing,
  lineHeight: foundations.system.base.lineHeight,
  fontFamily: foundations.system.base.fontFamily,
  fontSize: foundations.system.base.fontSize,
  fontVariant: foundations.system.base.fontVariant,
  fontWeight: foundations.system.base.fontWeight,
  overflowWrap: 'anywhere',
  tabSize: '4',
  wordBreak: 'keep-all',
  wordWrap: 'break-word',
});

globalStyle('body, #root, #__next', {
  minHeight: ['100vh', '100svh'],
});

globalStyle('fieldset', {
  margin: '0',
  padding: '0',
  border: '0',
  minInlineSize: 'unset',
});

globalStyle('a, label, summary, button, input, select, textarea', {
  // @ts-ignore
  '-webkit-app-region': 'no-drag',
});

globalStyle(`a, summary, button, input:where(${BUTTON_INPUT_TYPE_SELECTOR}, ${IMAEG_BUTTON_INPUT_TYPE_SELECTOR}), select`, {
  cursor: 'pointer',
});

globalStyle(
  `input:where(:not(${BUTTON_INPUT_TYPE_SELECTOR}, ${IMAEG_BUTTON_INPUT_TYPE_SELECTOR}, ${HIDDEN_INPUT_TYPE_SELECTOR})), select, textarea`,
  {
    borderRadius: '0',
    userSelect: 'auto',
  },
);

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('textarea', {
  resize: 'vertical',
});
