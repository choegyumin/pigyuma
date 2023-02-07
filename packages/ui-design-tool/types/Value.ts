import {
  FontSizeLengthType,
  HeightLengthType,
  LetterSpacingLengthType,
  LineHeightLengthType,
  StrokeStylePattern,
  WidthLengthType,
  XLengthType,
  YLengthType,
} from './Unit';

export type StyleValue = string;

export type FillValueObject = { color: string };
export type FontSizeValueObject = { length: number; lengthType: FontSizeLengthType };
export type FontWeightValueObject = { value: number };
export type HeightValueObject = { length: number; lengthType: HeightLengthType };
export type LetterSpacingValueObject = { length: number; lengthType: LetterSpacingLengthType };
export type LineHeightValueObject = { length: number; lengthType: LineHeightLengthType };
export type RotateValueObject = { length: number };
export type StrokeValueObject = {
  color: string;
  pattern: StrokeStylePattern;
  width: number | { top: number; right: number; bottom: number; left: number };
};
export type TextColorValueObject = { color: string };
export type WidthValueObject = { length: number; lengthType: WidthLengthType };
export type XValueObject = { length: number; lengthType: XLengthType };
export type YValueObject = { length: number; lengthType: YLengthType };
