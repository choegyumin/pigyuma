export const NumberUnit = {
  deg: 'deg',
  em: 'em',
  empty: '',
  percent: '%',
  px: 'px',
} as const;
export type NumberUnit = NonReadonly<typeof NumberUnit>;
export type NumberUnitType = keyof NumberUnit;

export const NumberKeyword = {
  auto: 'auto',
  fitContent: 'fit-content',
  inPlace: '0', // `0px`
  stretch: '-webkit-fill-available', // `stretch`
} as const;
export type NumberKeyword = NonReadonly<typeof NumberKeyword>;
export type NumberKeywordType = keyof NumberKeyword;

export const FontSizeLength = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type FontSizeLength = NonReadonly<typeof FontSizeLength>;
export type FontSizeLengthType = keyof FontSizeLength;

export const HeightLength = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.auto,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type HeightLength = NonReadonly<typeof HeightLength>;
export type HeightLengthType = keyof HeightLength;

export const RotateLength = {
  deg: NumberUnit.deg,
};
export type RotateLength = NonReadonly<typeof RotateLength>;
export type RotateLengthType = keyof RotateLength;

export const LetterSpacingLength = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type LetterSpacingLength = NonReadonly<typeof LetterSpacingLength>;
export type LetterSpacingLengthType = keyof LetterSpacingLength;

export const LineHeightLength = {
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type LineHeightLength = NonReadonly<typeof LineHeightLength>;
export type LineHeightLengthType = keyof LineHeightLength;

export const WidthLength = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.fitContent,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type WidthLength = NonReadonly<typeof WidthLength>;
export type WidthLengthType = keyof WidthLength;

export const XLength = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type XLength = NonReadonly<typeof XLength>;
export type XLengthType = keyof XLength;

export const YLength = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type YLength = NonReadonly<typeof YLength>;
export type YLengthType = keyof YLength;

export const StrokeStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
};
export type StrokeStyle = NonReadonly<typeof StrokeStyle>;
export type StrokeStyleType = keyof StrokeStyle;
