import {
  FontSizeLengthType,
  HeightLengthType,
  LetterSpacingLengthType,
  LineHeightLengthType,
  NumberKeyword,
  NumberUnit,
  StrokeStylePattern,
  WidthLengthType,
  XLengthType,
  YLengthType,
} from '@/types/Unit';
import {
  convertNumberValue,
  convertXValue,
  convertYValue,
  convertWidthValue,
  convertHeightValue,
  convertRotateValue,
  convertFillValue,
  convertFontSizeValue,
  convertFontWeightValue,
  convertLineHeightValue,
  convertLetterSpacingValue,
  convertTextColorValue,
  convertStrokeColorValue,
  convertStrokePatternValue,
  convertStrokeWidthValue,
} from './value';

describe('convertNumberValue', () => {
  test('should combine value and unit correctly', () => {
    expect(convertNumberValue(1, NumberUnit.deg)).toBe('1deg');
    expect(convertNumberValue(1, NumberUnit.em)).toBe('0.01em');
    expect(convertNumberValue(1, NumberUnit.numeric)).toBe('1');
    expect(convertNumberValue(1, NumberUnit.percent)).toBe('1%');
    expect(convertNumberValue(1, NumberUnit.px)).toBe('1px');
    expect(convertNumberValue(1, NumberKeyword.auto)).toBe('auto');
    expect(convertNumberValue(1, NumberKeyword.fitContent)).toBe('fit-content');
    expect(convertNumberValue(1, NumberKeyword.inPlace)).toBe('0');
    expect(convertNumberValue(1, NumberKeyword.stretch)).toBe('-webkit-fill-available');
  });
});

describe('convertXValue', () => {
  test('should return style value from XValueObject', () => {
    expect(convertXValue({ length: 1, lengthType: XLengthType.auto })).toBe('0');
    expect(convertXValue({ length: 1, lengthType: XLengthType.percent })).toBe('1%');
    expect(convertXValue({ length: 1, lengthType: XLengthType.px })).toBe('1px');
  });
});

describe('convertYValue', () => {
  test('should return style value from YValueObject', () => {
    expect(convertYValue({ length: 1, lengthType: YLengthType.auto })).toBe('0');
    expect(convertYValue({ length: 1, lengthType: YLengthType.percent })).toBe('1%');
    expect(convertYValue({ length: 1, lengthType: YLengthType.px })).toBe('1px');
  });
});

describe('convertWidthValue', () => {
  test('should return style value from WidthValueObject', () => {
    expect(convertWidthValue({ length: 1, lengthType: WidthLengthType.filled })).toBe('-webkit-fill-available');
    expect(convertWidthValue({ length: 1, lengthType: WidthLengthType.flexible })).toBe('fit-content');
    expect(convertWidthValue({ length: 1, lengthType: WidthLengthType.percent })).toBe('1%');
    expect(convertWidthValue({ length: 1, lengthType: WidthLengthType.px })).toBe('1px');
  });
});

describe('convertHeightValue', () => {
  test('should return style value from HeightValueObject', () => {
    expect(convertHeightValue({ length: 1, lengthType: HeightLengthType.filled })).toBe('-webkit-fill-available');
    expect(convertHeightValue({ length: 1, lengthType: HeightLengthType.flexible })).toBe('auto');
    expect(convertHeightValue({ length: 1, lengthType: HeightLengthType.percent })).toBe('1%');
    expect(convertHeightValue({ length: 1, lengthType: HeightLengthType.px })).toBe('1px');
  });
});

describe('convertRotateValue', () => {
  test('should return style value from RotateValueObject', () => {
    expect(convertRotateValue({ degrees: 1 })).toBe('1deg');
  });
});

describe('convertFillValue', () => {
  test('should return style value from FillValueObject', () => {
    expect(convertFillValue({ color: 'black' })).toBe('black');
  });
});

describe('convertFontSizeValue', () => {
  test('should return style value from FontSizeValueObject', () => {
    expect(convertFontSizeValue({ length: 1, lengthType: FontSizeLengthType.percent })).toBe('0.01em');
    expect(convertFontSizeValue({ length: 1, lengthType: FontSizeLengthType.px })).toBe('1px');
  });
});

describe('convertFontWeightValue', () => {
  test('should return style value from FontWeightValueObject', () => {
    expect(convertFontWeightValue({ value: 400 })).toBe('400');
  });
});

describe('convertLineHeightValue', () => {
  test('should return style value from LineHeightValueObject', () => {
    expect(convertLineHeightValue({ length: 1, lengthType: LineHeightLengthType.percent })).toBe('1%');
    expect(convertLineHeightValue({ length: 1, lengthType: LineHeightLengthType.px })).toBe('1px');
  });
});

describe('convertLetterSpacingValue', () => {
  test('should return style value from LetterSpacingValueObject', () => {
    expect(convertLetterSpacingValue({ length: 1, lengthType: LetterSpacingLengthType.percent })).toBe('0.01em');
    expect(convertLetterSpacingValue({ length: 1, lengthType: LetterSpacingLengthType.px })).toBe('1px');
  });
});

describe('convertTextColorValue', () => {
  test('should return style value from TextColorValueObject', () => {
    expect(convertTextColorValue({ color: 'black' })).toBe('black');
  });
});

describe('convertStrokeColorValue', () => {
  test('should return style value from StrokeColorValueObject', () => {
    expect(convertStrokeColorValue({ color: 'black', pattern: StrokeStylePattern.solid, width: 1 })).toBe('black');
  });
});

describe('convertStrokePatternValue', () => {
  test('should return style value from StrokePatternValueObject', () => {
    expect(convertStrokePatternValue({ color: 'black', pattern: StrokeStylePattern.solid, width: 1 })).toBe('solid');
    expect(convertStrokePatternValue({ color: 'black', pattern: StrokeStylePattern.dashed, width: 1 })).toBe('dashed');
    expect(convertStrokePatternValue({ color: 'black', pattern: StrokeStylePattern.dotted, width: 1 })).toBe('dotted');
    expect(convertStrokePatternValue({ color: 'black', pattern: StrokeStylePattern.double, width: 1 })).toBe('double');
  });
});

describe('convertStrokeWidthValue', () => {
  test('should return style value from StrokeWidthValueObject', () => {
    expect(convertStrokeWidthValue({ color: 'black', pattern: StrokeStylePattern.solid, width: 1 })).toBe('1px');
    expect(
      convertStrokeWidthValue({ color: 'black', pattern: StrokeStylePattern.solid, width: { top: 1, right: 2, bottom: 3, left: 4 } }),
    ).toBe('1px 2px 3px 4px');
  });
});
