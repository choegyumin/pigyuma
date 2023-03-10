import { LayerType, UIRecordType } from '@/types/Identifier';
import { NumberUnit } from '@/types/Unit';
import { isUIRecordKey } from '@/utils/model';
import { uuid } from '@pigyuma/utils';
import { TextLayer, TextLayerJSON } from './model';
import * as styles from './styles.css';

describe('TextLayer', () => {
  const textLayerKey = uuid.v4();
  const textLayerRecordType = UIRecordType.layer;
  const textLayerType = LayerType.text;
  const textLayerArgs = {
    key: textLayerKey,
    name: 'textLayer',
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
  };
  const textLayerJSON: TextLayerJSON = {
    ...textLayerArgs,
    type: textLayerRecordType,
    layerType: textLayerType,
  };
  const textLayer = new TextLayer({ ...textLayerArgs });

  test('should create instance', () => {
    expect(textLayer.key).toBe(textLayerKey);
    expect(textLayer.type).toBe(textLayerRecordType);
  });

  test('should create instance with generated key', () => {
    const textLayer = new TextLayer({ ...textLayerArgs, key: undefined });
    expect(isUIRecordKey(textLayer.key)).toBeTruthy();
  });

  test('should return correct style', () => {
    expect(textLayer.style).toEqual({
      [styles.varNames.x]: '100px',
      [styles.varNames.y]: '200px',
      [styles.varNames.width]: '300px',
      [styles.varNames.height]: '400px',
      [styles.varNames.rotate]: '45deg',
      [styles.varNames.textColor]: 'black',
      [styles.varNames.fontSize]: '14px',
      [styles.varNames.lineHeight]: '21px',
      [styles.varNames.fontWeight]: '400',
      [styles.varNames.letterSpacing]: '0px',
    });
    expect(TextLayer.getStyle(textLayerJSON)).toEqual(textLayer.style);
  });

  test('should return correct JSON object', () => {
    expect(textLayer.toJSON()).toEqual(textLayerJSON);
  });

  test('should check if object is TextLayerJSON', () => {
    expect(TextLayer.isJSON(textLayerJSON)).toBeTruthy();
    expect(TextLayer.isJSON({})).toBeFalsy();
    expect(TextLayer.isJSON([])).toBeFalsy();
    expect(TextLayer.isJSON(null)).toBeFalsy();
  });

  test('should check if object is TextLayer model', () => {
    expect(TextLayer.isModel(textLayer)).toBeTruthy();
    expect(TextLayer.isModel(textLayerJSON)).toBeTruthy();
    expect(TextLayer.isModel({})).toBeFalsy();
    expect(TextLayer.isModel([])).toBeFalsy();
    expect(TextLayer.isModel(null)).toBeFalsy();
  });
});
