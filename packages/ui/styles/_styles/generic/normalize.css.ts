/*! normalize.css v8.0.1(custom) | MIT License | github.com/necolas/normalize.css */

import { globalStyle } from '@vanilla-extract/css';

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

globalStyle(':where(html)', {
  lineHeight: '1.15' /* 1 */,
  textSizeAdjust: '100%',
});

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

globalStyle(':where(body)', {
  margin: '0',
});

/**
 * Render the `main` element consistently in IE.
 */

globalStyle(':where(main)', {
  display: 'block',
});

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

globalStyle(':where(h1)', {
  fontSize: '2em',
  margin: '0.67em 0',
});

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

globalStyle(':where(hr)', {
  boxSizing: 'content-box' /* 1 */,
  height: '0' /* 1 */,
  overflow: 'visible' /* 2 */,
});

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

globalStyle(':where(pre)', {
  fontFamily: 'monospace, monospace' /* 1 */,
  fontSize: '1em' /* 2 */,
});

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

globalStyle(':where(a)', {
  backgroundColor: 'transparent',
});

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

globalStyle(':where(abbr[title])', {
  borderBottom: 'none' /* 1 */,
  textDecoration: ['underline', 'underline dotted'] /* 2 */,
});

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

globalStyle(':where(b, strong)', {
  fontWeight: 'bolder',
});

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */

globalStyle(':where(code, kbd, samp)', {
  fontFamily: 'monospace, monospace' /* 1 */,
  fontSize: '1em' /* 2 */,
});

/**
 * Add the correct font size in all browsers.
 */

globalStyle(':where(small)', {
  fontSize: '80%',
});

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */

globalStyle(':where(sub, sup)', {
  fontSize: '75%',
  lineHeight: '0',
  position: 'relative',
  verticalAlign: 'baseline',
});

globalStyle(':where(sub)', {
  bottom: '-0.25em',
});

globalStyle(':where(sup)', {
  top: '-0.5em',
});

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

globalStyle(':where(img)', {
  borderStyle: 'none',
});

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

globalStyle(':where(button, input, optgroup, select, textarea)', {
  fontFamily: 'inherit' /* 1 */,
  fontSize: '100%' /* 1 */,
  lineHeight: '1.15' /* 1 */,
  margin: '0' /* 2 */,
});

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

globalStyle(':where(button)', {
  overflow: 'visible',
});

globalStyle(':where(input)', {
  overflow: 'visible' /* 1 */,
});

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

globalStyle(':where(button)', {
  textTransform: 'none',
});

globalStyle(':where(select)', {
  textTransform: 'none' /* 1 */,
});

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

globalStyle(':where(button, [type="button"], [type="reset"], [type="submit"])', {
  appearance: 'button',
});

/**
 * Remove the inner border and padding in Firefox.
 */

globalStyle(':where(button, [type="button"], [type="reset"], [type="submit"])::-moz-focus-inner', {
  borderStyle: 'none',
  padding: '0',
});

/**
 * Restore the focus styles unset by the previous rule.
 */

globalStyle(
  ':where(button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring)',
  {
    outline: '1px dotted ButtonText',
  },
);

/**
 * Correct the padding in Firefox.
 */

globalStyle(':where(fieldset)', {
  padding: '0.35em 0.75em 0.625em',
});

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */

globalStyle(':where(legend)', {
  boxSizing: 'border-box' /* 1 */,
  color: 'inherit' /* 2 */,
  display: 'table' /* 1 */,
  maxWidth: '100%' /* 1 */,
  padding: '0' /* 3 */,
  whiteSpace: 'normal' /* 1 */,
});

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

globalStyle(':where(progress)', {
  verticalAlign: 'baseline',
});

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

globalStyle(':where(textarea)', {
  overflow: 'auto',
});

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

globalStyle(':where([type="checkbox"], [type="radio"])', {
  boxSizing: 'border-box' /* 1 */,
  padding: '0' /* 2 */,
});

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

globalStyle(':where([type="number"])::-webkit-inner-spin-button, :where([type="number"])::-webkit-outer-spin-button', {
  height: 'auto',
});

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

globalStyle(':where([type="search"])', {
  appearance: 'textfield' /* 1 */,
  outlineOffset: '-2px' /* 2 */,
});

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

globalStyle(':where([type="search"])::-webkit-search-decoration', {
  appearance: 'none',
});

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */

globalStyle('::-webkit-file-upload-button', {
  appearance: 'button' /* 1 */,
  font: 'inherit' /* 2 */,
});

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

globalStyle(':where(details)', {
  display: 'block',
});

/*
 * Add the correct display in all browsers.
 */

globalStyle(':where(summary)', {
  display: 'list-item',
});

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

globalStyle(':where(template)', {
  display: 'none',
});

/**
 * Add the correct display in IE 10.
 */

globalStyle(':where([hidden])', {
  display: 'none',
});
