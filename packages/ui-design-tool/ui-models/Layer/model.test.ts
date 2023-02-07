import { LayerType, UIRecordType } from '@/types/Identifier';
import { NumberUnit } from '@/types/Unit';
import { isUIRecordKey } from '@/utils/model';
import { uuid } from '@pigyuma/utils';
import { Layer, LayerJSON } from './model';
import * as styles from './styles.css';

describe('Layer', () => {
  const layerKey = uuid.v4();
  const layerRecordType = UIRecordType.layer;
  const layerArgs = {
    key: layerKey,
    name: 'layer',
    layerType: LayerType.shape,
    x: { length: 100, lengthType: NumberUnit.px },
    y: { length: 200, lengthType: NumberUnit.px },
    width: { length: 300, lengthType: NumberUnit.px },
    height: { length: 400, lengthType: NumberUnit.px },
    rotate: { length: 45 },
  };
  const layerJSON: LayerJSON = {
    ...layerArgs,
    type: layerRecordType,
  };
  const layer = new Layer({ ...layerArgs });

  test('should create instance', () => {
    expect(layer.key).toBe(layerKey);
    expect(layer.type).toBe(layerRecordType);
  });

  test('should create instance with generated key', () => {
    const layer = new Layer({ ...layerArgs, key: undefined });
    expect(isUIRecordKey(layer.key)).toBeTruthy();
  });

  test('should return correct style', () => {
    expect(Layer.getStyle(layerJSON)).toEqual({
      [styles.varNames.x]: '100px',
      [styles.varNames.y]: '200px',
      [styles.varNames.width]: '300px',
      [styles.varNames.height]: '400px',
      [styles.varNames.rotate]: '45deg',
    });
    expect(layer.style).toEqual(Layer.getStyle(layerJSON));
  });

  test('should return correct JSON object', () => {
    expect(layer.toJSON()).toEqual(layerJSON);
  });

  test('should check if object is LayerJSON', () => {
    expect(Layer.isJSON(layerJSON)).toBeTruthy();
    expect(Layer.isJSON({})).toBeFalsy();
    expect(Layer.isJSON([])).toBeFalsy();
    expect(Layer.isJSON(null)).toBeFalsy();
  });

  test('should check if object is Layer model', () => {
    expect(Layer.isModel(layer)).toBeTruthy();
    expect(Layer.isModel(layerJSON)).toBeTruthy();
    expect(Layer.isModel({})).toBeFalsy();
    expect(Layer.isModel([])).toBeFalsy();
    expect(Layer.isModel(null)).toBeFalsy();
  });
});
