import { isUnitlessCSSNumber } from '@pigyuma/utils';

/**
 * See {@link https://github.com/facebook/react/blob/v18.0.0/packages/react-dom/src/shared/dangerousStyleValue.js#L11}
 *
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
export default function parseReactStyleValue(name: string, value: unknown, isCustomProperty: boolean = name.indexOf('--') === 0): string {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  const valueEmpty = value == null || typeof value === 'boolean' || value === '';
  if (valueEmpty) {
    return '';
  }

  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !isUnitlessCSSNumber(name)) {
    return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  }

  return ('' + value).trim();
}
