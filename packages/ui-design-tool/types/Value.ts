import {
  FontSizeLengthTypeKey,
  HeightLengthTypeKey,
  LetterSpacingLengthTypeKey,
  LineHeightLengthTypeKey,
  StrokeStylePatternKey,
  WidthLengthTypeKey,
  XLengthTypeKey,
  YLengthTypeKey,
} from './Unit';

export type StyleValue = string;

export type FillValueObject = { color: string };
export type FontSizeValueObject = { length: number; lengthType: FontSizeLengthTypeKey };
export type FontWeightValueObject = { value: number };
export type HeightValueObject = { length: number; lengthType: HeightLengthTypeKey };
export type LetterSpacingValueObject = { length: number; lengthType: LetterSpacingLengthTypeKey };
export type LineHeightValueObject = { length: number; lengthType: LineHeightLengthTypeKey };
export type RotateValueObject = { length: number };
export type StrokeValueObject = {
  color: string;
  pattern: StrokeStylePatternKey;
  width: number | { top: number; right: number; bottom: number; left: number };
};
export type TextColorValueObject = { color: string };
export type WidthValueObject = { length: number; lengthType: WidthLengthTypeKey };
export type XValueObject = { length: number; lengthType: XLengthTypeKey };
export type YValueObject = { length: number; lengthType: YLengthTypeKey };
