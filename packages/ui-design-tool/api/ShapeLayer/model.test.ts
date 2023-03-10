import { LayerType, UIRecordType } from '@/types/Identifier';
import { NumberUnit, StrokeStylePattern } from '@/types/Unit';
import { isUIRecordKey } from '@/utils/model';
import { uuid } from '@pigyuma/utils';
import { ShapeLayer, ShapeLayerJSON, ShapeType } from './model';
import * as styles from './styles.css';

describe('ShapeLayer', () => {
  const shapeLayerKey = uuid.v4();
  const shapeLayerRecordType = UIRecordType.layer;
  const shapeLayerType = LayerType.shape;
  const shapeLayerArgs = {
    key: shapeLayerKey,
    name: 'shapeLayer',
    shapeType: ShapeType.container,
    x: { length: 100, lengthType: NumberUnit.px },
    y: { length: 200, lengthType: NumberUnit.px },
    width: { length: 300, lengthType: NumberUnit.px },
    height: { length: 400, lengthType: NumberUnit.px },
    rotate: { degrees: 45 },
    stroke: { color: 'blue', pattern: StrokeStylePattern.solid, width: 2 },
    fill: { color: 'gray' },
    children: [],
  };
  const shapeLayerJSON: ShapeLayerJSON = {
    ...shapeLayerArgs,
    type: shapeLayerRecordType,
    layerType: shapeLayerType,
  };
  const shapeLayer = new ShapeLayer({ ...shapeLayerArgs });

  test('should create instance', () => {
    expect(shapeLayer.key).toBe(shapeLayerKey);
    expect(shapeLayer.type).toBe(shapeLayerRecordType);
  });

  test('should create instance with generated key', () => {
    const shapeLayer = new ShapeLayer({ ...shapeLayerArgs, key: undefined });
    expect(isUIRecordKey(shapeLayer.key)).toBeTruthy();
  });

  test('should return correct style', () => {
    expect(ShapeLayer.getStyle(shapeLayerJSON)).toEqual({
      [styles.varNames.x]: '100px',
      [styles.varNames.y]: '200px',
      [styles.varNames.width]: '300px',
      [styles.varNames.height]: '400px',
      [styles.varNames.rotate]: '45deg',
      [styles.varNames.strokeColor]: 'blue',
      [styles.varNames.strokePattern]: 'solid',
      [styles.varNames.strokeWidth]: '2px',
      [styles.varNames.background]: 'gray',
    });
    expect(shapeLayer.style).toEqual(ShapeLayer.getStyle(shapeLayerJSON));
  });

  test('should return correct JSON object', () => {
    expect(shapeLayer.toJSON()).toEqual(shapeLayerJSON);
  });

  test('should check if object is ShapeLayerJSON', () => {
    expect(ShapeLayer.isJSON(shapeLayerJSON)).toBeTruthy();
    expect(ShapeLayer.isJSON({})).toBeFalsy();
    expect(ShapeLayer.isJSON([])).toBeFalsy();
    expect(ShapeLayer.isJSON(null)).toBeFalsy();
  });

  test('should check if object is ShapeLayer model', () => {
    expect(ShapeLayer.isModel(shapeLayer)).toBeTruthy();
    expect(ShapeLayer.isModel(shapeLayerJSON)).toBeTruthy();
    expect(ShapeLayer.isModel({})).toBeFalsy();
    expect(ShapeLayer.isModel([])).toBeFalsy();
    expect(ShapeLayer.isModel(null)).toBeFalsy();
  });
});
