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

export interface FillValueObject {
  color: string;
}
export interface FontSizeValueObject {
  length: number;
  lengthType: FontSizeLengthType;
}
export interface FontWeightValueObject {
  value: number;
}
export interface HeightValueObject {
  length: number;
  lengthType: HeightLengthType;
}
export interface LetterSpacingValueObject {
  length: number;
  lengthType: LetterSpacingLengthType;
}
export interface LineHeightValueObject {
  length: number;
  lengthType: LineHeightLengthType;
}
export interface RotateValueObject {
  degrees: number;
}
export interface StrokeValueObject {
  color: string;
  pattern: StrokeStylePattern;
  width: { top: number; right: number; bottom: number; left: number };
}
export interface TextColorValueObject {
  color: string;
}
export interface WidthValueObject {
  length: number;
  lengthType: WidthLengthType;
}
export interface XValueObject {
  length: number;
  lengthType: XLengthType;
}
export interface YValueObject {
  length: number;
  lengthType: YLengthType;
}
