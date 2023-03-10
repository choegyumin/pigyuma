import { RawShapeLayerComponent } from '@/api/ShapeLayer/component';
import { ShapeLayer, ShapeType } from '@/api/ShapeLayer/model';
import { RawTextLayerComponent } from '@/api/TextLayer/component';
import { TextLayer } from '@/api/TextLayer/model';
import { UIRecordStyle } from '@/types/Style';
import { NumberUnit, StrokeStylePattern } from '@/types/Unit';
import { render } from '@testing-library/react';
import { getComputedUIRecordStyleValue, getComputedUIRecordStyle } from './style';

const dummyShapeLayer = new ShapeLayer({
  name: 'shape-layer',
  shapeType: ShapeType.container,
  x: { length: 100, lengthType: NumberUnit.px },
  y: { length: 200, lengthType: NumberUnit.px },
  width: { length: 300, lengthType: NumberUnit.px },
  height: { length: 400, lengthType: NumberUnit.px },
  rotate: { degrees: 45 },
  stroke: { color: 'blue', pattern: StrokeStylePattern.solid, width: 2 },
  fill: { color: 'gray' },
  children: [],
});

const dummyTextLayer = new TextLayer({
  name: 'text-layer',
  x: { length: 100, lengthType: NumberUnit.px },
  y: { length: 200, lengthType: NumberUnit.px },
  width: { length: 300, lengthType: NumberUnit.px },
  height: { length: 400, lengthType: NumberUnit.px },
  rotate: { degrees: 45 },
  textColor: { color: 'black' },
  fontSize: { length: 14, lengthType: NumberUnit.px },
  lineHeight: { length: 21, lengthType: NumberUnit.px },
  fontWeight: { value: 400 },
  letterSpacing: { length: 0, lengthType: NumberUnit.px },
  content: 'content',
});

describe('getComputedUIRecordStyleValue', () => {
  test('should return correct style value', () => {
    const { container: shapeContainer } = render(<RawShapeLayerComponent data={dummyShapeLayer} />);
    const { container: textContainer } = render(<RawTextLayerComponent data={dummyTextLayer} />);
    const shapeLayer = shapeContainer.firstElementChild as HTMLElement;
    const textLayer = textContainer.firstElementChild as HTMLElement;
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.x)).toBe('100px');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.y)).toBe('200px');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.width)).toBe('300px');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.height)).toBe('400px');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.rotate)).toBe('45deg');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.strokeColor)).toBe('blue');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.strokePattern)).toBe('solid');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.strokeWidth)).toBe('2px');
    expect(getComputedUIRecordStyleValue(shapeLayer, UIRecordStyle.background)).toBe('gray');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.x)).toBe('100px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.y)).toBe('200px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.width)).toBe('300px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.height)).toBe('400px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.rotate)).toBe('45deg');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.textColor)).toBe('black');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.fontSize)).toBe('14px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.lineHeight)).toBe('21px');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.fontWeight)).toBe('400');
    expect(getComputedUIRecordStyleValue(textLayer, UIRecordStyle.letterSpacing)).toBe('0px');
  });
});

describe('getComputedUIRecordStyle', () => {
  test('should return correct style', () => {
    const { container: shapeContainer } = render(<RawShapeLayerComponent data={dummyShapeLayer} />);
    const { container: textContainer } = render(<RawTextLayerComponent data={dummyTextLayer} />);
    const shapeLayer = shapeContainer.firstElementChild as HTMLElement;
    const textLayer = textContainer.firstElementChild as HTMLElement;
    expect(getComputedUIRecordStyle(shapeLayer)).toEqual({
      [UIRecordStyle.x]: '100px',
      [UIRecordStyle.y]: '200px',
      [UIRecordStyle.width]: '300px',
      [UIRecordStyle.height]: '400px',
      [UIRecordStyle.rotate]: '45deg',
      [UIRecordStyle.strokeColor]: 'blue',
      [UIRecordStyle.strokePattern]: 'solid',
      [UIRecordStyle.strokeWidth]: '2px',
      [UIRecordStyle.background]: 'gray',
      [UIRecordStyle.textColor]: '',
      [UIRecordStyle.fontSize]: '',
      [UIRecordStyle.lineHeight]: '',
      [UIRecordStyle.fontWeight]: '',
      [UIRecordStyle.letterSpacing]: '',
    });
    expect(getComputedUIRecordStyle(textLayer)).toEqual({
      [UIRecordStyle.x]: '100px',
      [UIRecordStyle.y]: '200px',
      [UIRecordStyle.width]: '300px',
      [UIRecordStyle.height]: '400px',
      [UIRecordStyle.rotate]: '45deg',
      [UIRecordStyle.textColor]: 'black',
      [UIRecordStyle.fontSize]: '14px',
      [UIRecordStyle.lineHeight]: '21px',
      [UIRecordStyle.fontWeight]: '400',
      [UIRecordStyle.letterSpacing]: '0px',
      [UIRecordStyle.strokeColor]: '',
      [UIRecordStyle.strokePattern]: '',
      [UIRecordStyle.strokeWidth]: '',
      [UIRecordStyle.background]: '',
    });
  });
});
