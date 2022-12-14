import { Artboard } from '@/components/Artboard/Artboard.model';
import { Canvas } from '@/components/Canvas/Canvas.model';
import { ShapeLayer } from '@/components/ShapeLayer/ShapeLayer.model';
import { UIRecord } from '@/components/UIRecord/UIRecord.model';
import { UIRecordKey } from '@/types/Identifier';
import {
  FontSizeLength,
  HeightLength,
  LetterSpacingLength,
  LineHeightLength,
  NumberKeyword,
  NumberUnit,
  RotateLength,
  WidthLength,
  XLength,
  YLength,
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

export const convertNumberValue = (
  length: number,
  unitOrKeyword: ValueOf<NumberUnit> | ValueOf<NumberKeyword> = NumberUnit.empty,
): StyleValue => {
  if (Object.values(NumberKeyword).includes(unitOrKeyword as ValueOf<NumberKeyword>)) {
    return unitOrKeyword ?? '';
  }
  if (unitOrKeyword === NumberUnit.em) {
    return `${length / 100}${unitOrKeyword}`;
  }
  return `${length}${unitOrKeyword}`;
};

export const convertXValue = ({ length, lengthType }: XValueObject): StyleValue => {
  return convertNumberValue(length, XLength[lengthType]);
};
export const convertYValue = ({ length, lengthType }: YValueObject): StyleValue => {
  return convertNumberValue(length, YLength[lengthType]);
};
export const convertWidthValue = ({ length, lengthType }: WidthValueObject): StyleValue => {
  return convertNumberValue(length, WidthLength[lengthType]);
};
export const convertHeightValue = ({ length, lengthType }: HeightValueObject): StyleValue => {
  return convertNumberValue(length, HeightLength[lengthType]);
};
export const convertRotateValue = ({ length }: RotateValueObject): StyleValue => {
  return convertNumberValue(length, RotateLength.deg);
};
export const convertFillValue = ({ color }: FillValueObject): StyleValue => {
  return color;
};
export const convertFontSizeValue = ({ length, lengthType }: FontSizeValueObject): StyleValue => {
  return convertNumberValue(length, FontSizeLength[lengthType]);
};
export const convertFontWeightValue = ({ value }: FontWeightValueObject): StyleValue => {
  return convertNumberValue(value);
};
export const convertLineHeightValue = ({ length, lengthType }: LineHeightValueObject): StyleValue => {
  return convertNumberValue(length, LineHeightLength[lengthType]);
};
export const convertLetterSpacingValue = ({ length, lengthType }: LetterSpacingValueObject): StyleValue => {
  return convertNumberValue(length, LetterSpacingLength[lengthType]);
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
  return typeof width === 'number' ? `${width}` : `${width.top} ${width.right} ${width.bottom} ${width.left}`;
};

export const flatUIRecords = (records: Array<UIRecord>, result: Map<UIRecordKey, UIRecord> = new Map()): Map<UIRecordKey, UIRecord> => {
  const nextRecords: typeof records = [];

  records.forEach((record) => {
    if (record instanceof Artboard || record instanceof Canvas || record instanceof ShapeLayer) {
      record.children.forEach((childLayer) => {
        nextRecords.push(childLayer);
      });
    }
    result.set(record.key, record);
  });

  return nextRecords.length > 0 ? flatUIRecords(nextRecords, result) : result;
};
