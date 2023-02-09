import { UIRecordType } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { uuid } from '@pigyuma/utils';
import { UIRecord, UIRecordJSON } from './model';

describe('UIRecord', () => {
  const uiRecordKey = uuid.v4();
  const uiRecordType = UIRecordType.canvas;
  const uiRecordArgs = { key: uiRecordKey, type: uiRecordType };
  const uiRecordJSON: UIRecordJSON = { ...uiRecordArgs };
  const uiRecord = new UIRecord({ ...uiRecordArgs });

  test('should create instance', () => {
    expect(uiRecord.key).toBe(uiRecordKey);
    expect(uiRecord.type).toBe(uiRecordType);
  });

  test('should create instance with generated key', () => {
    const uiRecord = new UIRecord({ ...uiRecordArgs, key: undefined });
    expect(isUIRecordKey(uiRecord.key)).toBeTruthy();
  });

  test('should return correct JSON object', () => {
    expect(uiRecord.toJSON()).toEqual(uiRecordJSON);
  });

  test('should check if object is UIRecordJSON', () => {
    expect(UIRecord.isJSON(uiRecordJSON)).toBeTruthy();
    expect(UIRecord.isJSON({})).toBeFalsy();
    expect(UIRecord.isJSON([])).toBeFalsy();
    expect(UIRecord.isJSON(null)).toBeFalsy();
  });

  test('should check if object is UIRecord model', () => {
    expect(UIRecord.isModel(uiRecord)).toBeTruthy();
    expect(UIRecord.isModel(uiRecordJSON)).toBeTruthy();
    expect(UIRecord.isModel({})).toBeFalsy();
    expect(UIRecord.isModel([])).toBeFalsy();
    expect(UIRecord.isModel(null)).toBeFalsy();
  });
});
