import { mapValues } from '@pigyuma/utils';

export const NumberUnit = {
  deg: 'deg',
  em: 'em',
  numeric: '',
  percent: '%',
  px: 'px',
} as const;
export type NumberUnit = keyof typeof NumberUnit;
export type NumberUnitValue = ValueOf<typeof NumberUnit>;

export const NumberKeyword = {
  auto: 'auto',
  fitContent: 'fit-content',
  inPlace: '0', // `0px`
  stretch: '-webkit-fill-available', // `stretch`
} as const;
export type NumberKeyword = keyof typeof NumberKeyword;
export type NumberKeywordValue = ValueOf<typeof NumberKeyword>;

export const FontSizeLengthTypeValue = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type FontSizeLengthTypeValue = keyof typeof FontSizeLengthTypeValue;
export const FontSizeLengthType = mapValues(FontSizeLengthTypeValue, (value, key) => key) as { [P in FontSizeLengthTypeValue]: P };
export type FontSizeLengthType = keyof typeof FontSizeLengthType;

export const HeightLengthTypeValue = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.auto,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type HeightLengthTypeValue = keyof typeof HeightLengthTypeValue;
export const HeightLengthType = mapValues(HeightLengthTypeValue, (value, key) => key) as { [P in HeightLengthTypeValue]: P };
export type HeightLengthType = keyof typeof HeightLengthType;

export const LetterSpacingLengthTypeValue = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type LetterSpacingLengthTypeValue = keyof typeof LetterSpacingLengthTypeValue;
export const LetterSpacingLengthType = mapValues(LetterSpacingLengthTypeValue, (value, key) => key) as {
  [P in LetterSpacingLengthTypeValue]: P;
};
export type LetterSpacingLengthType = keyof typeof LetterSpacingLengthType;

/** @todo Unitless line-height 추가 검토 (typography token이 잘 설계된 서비스는 디자인에서 이를 사용하지 않고, html 기본값 선언에서만 쓰일 듯) */
export const LineHeightLengthTypeValue = {
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type LineHeightLengthTypeValue = keyof typeof LineHeightLengthTypeValue;
export const LineHeightLengthType = mapValues(LineHeightLengthTypeValue, (value, key) => key) as { [P in LineHeightLengthTypeValue]: P };
export type LineHeightLengthType = keyof typeof LineHeightLengthType;

export const WidthLengthTypeValue = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.fitContent,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type WidthLengthTypeValue = keyof typeof WidthLengthTypeValue;
export const WidthLengthType = mapValues(WidthLengthTypeValue, (value, key) => key) as { [P in WidthLengthTypeValue]: P };
export type WidthLengthType = keyof typeof WidthLengthType;

export const XLengthTypeValue = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type XLengthTypeValue = keyof typeof XLengthTypeValue;
export const XLengthType = mapValues(XLengthTypeValue, (value, key) => key) as { [P in XLengthTypeValue]: P };
export type XLengthType = keyof typeof XLengthType;

export const YLengthTypeValue = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type YLengthTypeValue = keyof typeof YLengthTypeValue;
export const YLengthType = mapValues(YLengthTypeValue, (value, key) => key) as { [P in YLengthTypeValue]: P };
export type YLengthType = keyof typeof YLengthType;

export const StrokeStylePatternValue = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
};
export type StrokeStylePatternValue = keyof typeof StrokeStylePatternValue;
export const StrokeStylePattern = mapValues(StrokeStylePatternValue, (value, key) => key) as { [P in StrokeStylePatternValue]: P };
export type StrokeStylePattern = keyof typeof StrokeStylePatternValue;
