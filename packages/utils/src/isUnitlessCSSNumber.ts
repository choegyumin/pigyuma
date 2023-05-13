/**
 * See {@link https://github.com/facebook/react/blob/v18.0.0/packages/react-dom/src/shared/CSSProperty.js#L8}
 * See {@link https://github.com/vanilla-extract-css/vanilla-extract/blob/%40vanilla-extract/css%401.9.2/packages/css/src/transformCss.ts#L26}
 *
 * CSS properties which accept numbers but are not in units of "px".
 */
const UnitlessCSSNumberTable = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};
type UnitlessCSSNumber = keyof typeof UnitlessCSSNumberTable;

export default function isUnitlessCSSNumber(name: string): name is UnitlessCSSNumber {
  return Object.prototype.hasOwnProperty.call(UnitlessCSSNumberTable, name) && UnitlessCSSNumberTable[name];
}
