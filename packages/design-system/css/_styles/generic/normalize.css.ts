/*! modern-normalize v1.1.0(custom) | MIT License | https://github.com/sindresorhus/modern-normalize */

import { globalStyle } from '@vanilla-extract/css';

/*
Document
========
*/

/**
Improve consistency of default fonts in all browsers (opinionated). (https://github.com/sindresorhus/modern-normalize/issues/3)
1. Firefox supports `-apple-system` but not yet `system-ui`.
*/

globalStyle(':root', {
  vars: {
    '--cursive': 'cursive',
    '--emoji': 'emoji',
    '--fangsong': 'fangsong',
    '--fantasy': 'fantasy',
    '--math': 'math',
    '--monospace': 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' /* 1 */,
    '--sans-serif': 'sans-serif',
    '--serif': 'serif',
    '--system-ui':
      'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"' /* 2 */,
    '--ui-monospace': 'ui-monospace',
    '--ui-rounded': 'ui-rounded',
    '--ui-sans-serif': 'ui-sans-serif',
    '--ui-serif': 'ui-serif',
  },
});

/**
Add more cursors (opinionated).
*/

// globalStyle(':root', {
//   vars: {},
// });

/**
Use a better box model (opinionated).
*/

globalStyle('*, ::before, ::after', {
  boxSizing: 'border-box',
});

/**
1. Correct the line height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size (opinionated).
*/

globalStyle(':where(html)', {
  lineHeight: '1.15' /* 1 */,
  textSizeAdjust: '100%' /* 2 */,
  // tabSize: '4' /* 3 */,
});

/*
Sections
========
*/

/**
1. Remove the margin in all browsers.
2. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
*/

globalStyle(':where(body)', {
  margin: '0' /* 1 */,
  fontFamily: 'var(--system-ui)' /* 2 */,
});

/*
Grouping content
================
*/

/**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

globalStyle(':where(hr)', {
  height: '0' /* 1 */,
  color: 'inherit' /* 2 */,
});

/*
Text-level semantics
====================
*/

/**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

globalStyle(':where(abbr[title])', {
  textDecoration: 'underline dotted',
});

/**
Add the correct font weight in Edge and Safari.
*/

globalStyle(':where(b, strong)', {
  fontWeight: 'bolder',
});

/**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

globalStyle(':where(code, kbd, samp, pre)', {
  fontFamily: 'var(--monospace)' /* 1 */,
  fontSize: '1em' /* 2 */,
});

/**
Add the correct font size in all browsers.
*/

globalStyle(':where(small)', {
  fontSize: '80%',
});

/**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
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

/*
Tabular data
============
*/

/**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

globalStyle(':where(table)', {
  textIndent: '0' /* 1 */,
  borderColor: 'inherit' /* 2 */,
});

/*
Forms
=====
*/

/**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

globalStyle(':where(button, input, optgroup, select, textarea)', {
  fontFamily: 'inherit' /* 1 */,
  fontSize: '100%' /* 1 */,
  lineHeight: '1.15' /* 1 */,
  margin: '0' /* 2 */,
});

/**
Remove the inheritance of text transform in Edge and Firefox.
*/

globalStyle(':where(button, select)', {
  textTransform: 'none',
});

/**
Correct the inability to style clickable types in iOS and Safari.
*/

globalStyle(':where(button, [type="button" i], [type="reset" i], [type="submit" i])', {
  appearance: 'button',
});

/**
Remove the inner border and padding in Firefox.
*/

globalStyle('::-moz-focus-inner', {
  borderStyle: 'none',
  padding: '0',
});

/**
Restore the focus styles unset by the previous rule.
*/

globalStyle(':-moz-focusring', {
  outline: '1px dotted ButtonText',
});

/**
Remove the additional ':invalid' styles in Firefox.
See: 'https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

globalStyle(':-moz-ui-invalid', {
  boxShadow: 'none',
});

/**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

globalStyle(':where(legend)', {
  padding: '0',
});

/**
Add the correct vertical alignment in Chrome and Firefox.
*/

globalStyle(':where(progress)', {
  verticalAlign: 'baseline',
});

/**
Correct the cursor style of increment and decrement buttons in Safari.
*/

globalStyle('::-webkit-inner-spin-button, ::-webkit-outer-spin-button', {
  height: 'auto',
});

/**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

globalStyle(':where([type="search" i])', {
  appearance: 'textfield' /* 1 */,
  outlineOffset: '-2px' /* 2 */,
});

/**
Remove the inner padding in Chrome and Safari on macOS.
*/

globalStyle('::-webkit-search-decoration', {
  appearance: 'none',
});

/**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

globalStyle('::-webkit-file-upload-button', {
  appearance: 'button' /* 1 */,
  font: 'inherit' /* 2 */,
});

/*
Interactive
===========
*/

/*
Add the correct display in Chrome and Safari.
*/

globalStyle(':where(summary)', {
  display: 'list-item',
});
