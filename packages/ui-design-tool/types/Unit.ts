import { mapValues } from '@pigyuma/utils';

export enum NumberUnit {
  deg = 'deg',
  em = 'em',
  numeric = '',
  percent = '%',
  px = 'px',
}
export type NumberUnitKey = keyof typeof NumberUnit;
export type NumberUnitValue = ValueOf<typeof NumberUnit>;

export enum NumberKeyword {
  auto = 'auto',
  fitContent = 'fit-content',
  inPlace = '0', // `0px`
  stretch = '-webkit-fill-available', // `stretch`
}
export type NumberKeywordKey = keyof typeof NumberKeyword;
export type NumberKeywordValue = ValueOf<typeof NumberKeyword>;

export const FontSizeLengthTypeValue = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type FontSizeLengthTypeKey = keyof typeof FontSizeLengthTypeValue;
export const FontSizeLengthType = mapValues(FontSizeLengthTypeValue, (value, key) => key) as { [P in FontSizeLengthTypeKey]: P };

export const HeightLengthTypeValue = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.auto,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type HeightLengthTypeKey = keyof typeof HeightLengthTypeValue;
export const HeightLengthType = mapValues(HeightLengthTypeValue, (value, key) => key) as { [P in HeightLengthTypeKey]: P };

export const RotateLengthTypeValue = {
  deg: NumberUnit.deg,
};
export type RotateLengthTypeKey = keyof typeof RotateLengthTypeValue;
export const RotateLengthType = mapValues(RotateLengthTypeValue, (value, key) => key) as { [P in RotateLengthTypeKey]: P };

export const LetterSpacingLengthTypeValue = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type LetterSpacingLengthTypeKey = keyof typeof LetterSpacingLengthTypeValue;
export const LetterSpacingLengthType = mapValues(LetterSpacingLengthTypeValue, (value, key) => key) as {
  [P in LetterSpacingLengthTypeKey]: P;
};

/** @todo Unitless line-height 추가 검토 (typography token이 잘 설계된 서비스는 디자인에서 이를 사용하지 않고, html 기본값 선언에서만 쓰일 듯) */
export const LineHeightLengthTypeValue = {
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type LineHeightLengthTypeKey = keyof typeof LineHeightLengthTypeValue;
export const LineHeightLengthType = mapValues(LineHeightLengthTypeValue, (value, key) => key) as { [P in LineHeightLengthTypeKey]: P };

export const WidthLengthTypeValue = {
  filled: NumberKeyword.stretch,
  flexible: NumberKeyword.fitContent,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type WidthLengthTypeKey = keyof typeof WidthLengthTypeValue;
export const WidthLengthType = mapValues(WidthLengthTypeValue, (value, key) => key) as { [P in WidthLengthTypeKey]: P };

export const XLengthTypeValue = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type XLengthTypeKey = keyof typeof XLengthTypeValue;
export const XLengthType = mapValues(XLengthTypeValue, (value, key) => key) as { [P in XLengthTypeKey]: P };

export const YLengthTypeValue = {
  auto: NumberKeyword.inPlace,
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type YLengthTypeKey = keyof typeof YLengthTypeValue;
export const YLengthType = mapValues(YLengthTypeValue, (value, key) => key) as { [P in YLengthTypeKey]: P };

export const StrokeStylePatternValue = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
};
export type StrokeStylePatternKey = keyof typeof StrokeStylePatternValue;
export const StrokeStylePattern = mapValues(StrokeStylePatternValue, (value, key) => key) as { [P in StrokeStylePatternKey]: P };
