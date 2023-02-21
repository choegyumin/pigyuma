import { UIRecordType, CanvasKey } from '@/types/Identifier';
import { Canvas, CanvasJSON } from './model';

describe('Canvas', () => {
  const canvasType = UIRecordType.canvas;
  const canvasArgs = { children: [] };
  const canvasJSON: CanvasJSON = {
    ...canvasArgs,
    key: CanvasKey,
    type: canvasType,
  };
  const canvas = new Canvas({ ...canvasArgs });

  test('should create instance', () => {
    expect(canvas.key).toBe(CanvasKey);
    expect(canvas.type).toBe(canvasType);
  });

  test('should return correct JSON object', () => {
    expect(canvas.toJSON()).toEqual(canvasJSON);
  });

  test('should check if object is CanvasJSON', () => {
    expect(Canvas.isJSON(canvasJSON)).toBeTruthy();
    expect(Canvas.isJSON({})).toBeFalsy();
    expect(Canvas.isJSON([])).toBeFalsy();
    expect(Canvas.isJSON(null)).toBeFalsy();
  });

  test('should check if object is Canvas model', () => {
    expect(Canvas.isModel(canvas)).toBeTruthy();
    expect(Canvas.isModel(canvasJSON)).toBeTruthy();
    expect(Canvas.isModel({})).toBeFalsy();
    expect(Canvas.isModel([])).toBeFalsy();
    expect(Canvas.isModel(null)).toBeFalsy();
  });
});
