import {
  FontSizeLengthTypeValue,
  HeightLengthTypeValue,
  LetterSpacingLengthTypeValue,
  LineHeightLengthTypeValue,
  NumberKeyword,
  NumberKeywordValue,
  NumberUnit,
  NumberUnitValue,
  WidthLengthTypeValue,
  XLengthTypeValue,
  YLengthTypeValue,
} from '@/types/Unit';
import {
  FillValueObject,
  FontSizeValueObject,
  FontWeightValueObject,
  HeightValueObject,
  LetterSpacingValueObject,
  LineHeightValueObject,
  RotateValueObject,
  StrokeValueObject,
  StyleValue,
  TextColorValueObject,
  WidthValueObject,
  XValueObject,
  YValueObject,
} from '@/types/Value';

export const fixNumberValue = (number: number) => Number(number.toFixed(2));

export const convertNumberValue = (
  length: number,
  unitOrKeyword: NumberUnitValue | NumberKeywordValue = NumberUnit.numeric,
): StyleValue => {
  if (Object.values(NumberKeyword).includes(unitOrKeyword as NumberKeywordValue)) {
    return unitOrKeyword ?? '';
  }
  // 1em = 100%, 0.01em = 1%
  if (unitOrKeyword === NumberUnit.em) {
    return `${length / 100}${unitOrKeyword}`;
  }
  return `${length}${unitOrKeyword}`;
};

export const convertXValue = ({ length, lengthType }: XValueObject): StyleValue => {
  return convertNumberValue(length, XLengthTypeValue[lengthType]);
};
export const convertYValue = ({ length, lengthType }: YValueObject): StyleValue => {
  return convertNumberValue(length, YLengthTypeValue[lengthType]);
};
export const convertWidthValue = ({ length, lengthType }: WidthValueObject): StyleValue => {
  return convertNumberValue(length, WidthLengthTypeValue[lengthType]);
};
export const convertHeightValue = ({ length, lengthType }: HeightValueObject): StyleValue => {
  return convertNumberValue(length, HeightLengthTypeValue[lengthType]);
};
export const convertRotateValue = ({ degrees }: RotateValueObject): StyleValue => {
  return convertNumberValue(degrees, NumberUnit.deg);
};
export const convertFillValue = ({ color }: FillValueObject): StyleValue => {
  return color;
};
export const convertFontSizeValue = ({ length, lengthType }: FontSizeValueObject): StyleValue => {
  return convertNumberValue(length, FontSizeLengthTypeValue[lengthType]);
};
export const convertFontWeightValue = ({ value }: FontWeightValueObject): StyleValue => {
  return convertNumberValue(value);
};
export const convertLineHeightValue = ({ length, lengthType }: LineHeightValueObject): StyleValue => {
  return convertNumberValue(length, LineHeightLengthTypeValue[lengthType]);
};
export const convertLetterSpacingValue = ({ length, lengthType }: LetterSpacingValueObject): StyleValue => {
  return convertNumberValue(length, LetterSpacingLengthTypeValue[lengthType]);
};
export const convertTextColorValue = ({ color }: TextColorValueObject): StyleValue => {
  return color;
};
export const convertStrokeColorValue = ({ color }: StrokeValueObject): StyleValue => {
  return `${color}`;
};
export const convertStrokePatternValue = ({ pattern }: StrokeValueObject): StyleValue => {
  return `${pattern}`;
};
export const convertStrokeWidthValue = ({ width }: StrokeValueObject): StyleValue => {
  const top = convertNumberValue(width.top, NumberUnit.px);
  const right = convertNumberValue(width.right, NumberUnit.px);
  const bottom = convertNumberValue(width.bottom, NumberUnit.px);
  const left = convertNumberValue(width.left, NumberUnit.px);
  return `${top} ${right} ${bottom} ${left}`;
};
