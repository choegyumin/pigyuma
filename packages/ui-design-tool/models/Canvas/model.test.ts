import { UIRecordType } from '@/types/Identifier';
import { Canvas, CanvasJSON } from './model';

describe('Canvas', () => {
  const canvasType = UIRecordType.canvas;
  const canvasArgs = { children: [] };
  const canvasJSON: CanvasJSON = {
    ...canvasArgs,
    key: Canvas.key,
    type: canvasType,
  };
  const canvas = new Canvas({ ...canvasArgs });

  test('should create instance', () => {
    expect(canvas.key).toBe(Canvas.key);
    expect(canvas.type).toBe(canvasType);
  });

  test('should return correct JSON object', () => {
    expect(canvas.toJSON()).toEqual(canvasJSON);
  });

  test('should check if object is CanvasJSON', () => {
    expect(Canvas.validate(canvasJSON)).toBeTruthy();
    expect(Canvas.validate({})).toBeFalsy();
    expect(Canvas.validate([])).toBeFalsy();
    expect(Canvas.validate(null)).toBeFalsy();
  });
});
