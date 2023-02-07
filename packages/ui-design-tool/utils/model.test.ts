import { CanvasKey, LayerType, UIRecordType } from '@/types/Identifier';
import { NumberUnit, StrokeStylePattern } from '@/types/Unit';
import { Artboard, ArtboardArgs, ArtboardData } from '@/ui-models/Artboard/model';
import { Canvas, CanvasArgs, CanvasData } from '@/ui-models/Canvas/model';
import { Layer, LayerArgs, LayerData } from '@/ui-models/Layer/model';
import { ShapeLayer, ShapeLayerArgs, ShapeLayerData, ShapeType } from '@/ui-models/ShapeLayer/model';
import { TextLayer, TextLayerArgs, TextLayerData } from '@/ui-models/TextLayer/model';
import { UIRecord, UIRecordArgs, UIRecordData } from '@/ui-models/UIRecord/model';
import { cloneDeep } from '@pigyuma/utils';
import {
  isUIRecordKey,
  isUIRecordWithParent,
  hasUIRecordParent,
  isUIRecordWithChildren,
  hasUIRecordChildren,
  isRotatableUIRecord,
  toUIRecordInstance,
  flatUIRecords,
} from './model';

const x = { length: 100, lengthType: NumberUnit.px } as const;
const y = { length: 100, lengthType: NumberUnit.px } as const;
const width = { length: 200, lengthType: NumberUnit.px } as const;
const height = { length: 200, lengthType: NumberUnit.px } as const;
const rotate = { length: 0 } as const;
const stroke = { color: 'blue', pattern: StrokeStylePattern.solid, width: 2 } as const;
const fill = { color: 'gray' } as const;
const textColor = { color: 'black' } as const;
const fontSize = { length: 14, lengthType: NumberUnit.px } as const;
const lineHeight = { length: 21, lengthType: NumberUnit.px } as const;
const fontWeight = { value: 400 } as const;
const letterSpacing = { length: 0, lengthType: NumberUnit.px } as const;

const dummyUIRecordArgs: UIRecordArgs = { type: UIRecordType.layer };
const dummyCanvasArgs: CanvasArgs = { children: [] };
const dummyArtboardArgs: ArtboardArgs = { name: 'artboard', x: 0, y: 0, width: 0, height: 0, children: [] };
const dummyLayerArgs: LayerArgs = { layerType: LayerType.shape, name: 'layer', x, y, width, height, rotate };
const dummyShapeLayerArgs: ShapeLayerArgs = {
  shapeType: ShapeType.container,
  name: 'shape-layer',
  x,
  y,
  width,
  height,
  rotate,
  stroke,
  fill,
  children: [],
};
const dummyTextLayerArgs: TextLayerArgs = {
  name: 'text-layer',
  x,
  y,
  width,
  height,
  rotate,
  textColor,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  content: 'content',
};

const dummyUIRecordData: UIRecordData = { ...dummyUIRecordArgs };
const dummyCanvasData: CanvasData = { ...dummyCanvasArgs, type: UIRecordType.canvas };
const dummyArtboardData: ArtboardData = { ...dummyArtboardArgs, type: UIRecordType.artboard };
const dummyLayerData: LayerData = { ...dummyLayerArgs, type: UIRecordType.layer };
const dummyShapeLayerData: ShapeLayerData = { ...dummyShapeLayerArgs, type: UIRecordType.layer, layerType: LayerType.shape };
const dummyTextLayerData: TextLayerData = { ...dummyTextLayerArgs, type: UIRecordType.layer, layerType: LayerType.text };

const dummyUIRecord = new UIRecord(dummyUIRecordArgs);
const dummyCanvas = new Canvas(dummyCanvasArgs);
const dummyArtboard = new Artboard(dummyArtboardArgs);
const dummyLayer = new Layer(dummyLayerArgs);
const dummyShapeLayer = new ShapeLayer(dummyShapeLayerArgs);
const dummyTextLayer = new TextLayer(dummyTextLayerArgs);

describe('isUIRecordKey', () => {
  test('should check if value type is UIRecordKey', () => {
    expect(isUIRecordKey('string')).toBeTruthy();
    expect(isUIRecordKey('')).toBeTruthy();
    expect(isUIRecordKey(1)).toBeFalsy();
    expect(isUIRecordKey(0)).toBeFalsy();
    expect(isUIRecordKey(true)).toBeFalsy();
    expect(isUIRecordKey(false)).toBeFalsy();
    expect(isUIRecordKey([])).toBeFalsy();
    expect(isUIRecordKey({})).toBeFalsy();
    expect(isUIRecordKey(Symbol())).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isUIRecordKey(function () {})).toBeFalsy();
  });
});

describe('isUIRecordWithParent', () => {
  test('should check if value can have parent', () => {
    expect(isUIRecordWithParent({})).toBeFalsy();
    expect(isUIRecordWithParent(dummyUIRecord)).toBeFalsy();
    expect(isUIRecordWithParent(dummyCanvas)).toBeFalsy();
    expect(isUIRecordWithParent(dummyArtboard)).toBeTruthy();
    expect(isUIRecordWithParent(dummyLayer)).toBeTruthy();
    expect(isUIRecordWithParent(dummyShapeLayer)).toBeTruthy();
    expect(isUIRecordWithParent(dummyTextLayer)).toBeTruthy();
  });
});

describe('hasUIRecordParent', () => {
  const dummyArtboardHasParent = new Artboard(dummyArtboardArgs, cloneDeep(dummyCanvas));
  const dummyLayerHasParent = new Layer(dummyLayerArgs, cloneDeep(dummyArtboardHasParent));
  const dummyShapeLayerHasParent = new ShapeLayer(dummyShapeLayerArgs, cloneDeep(dummyArtboardHasParent));
  const dummyTextLayerHasParent = new TextLayer(dummyTextLayerArgs, cloneDeep(dummyArtboardHasParent));

  test('should check if value has parent', () => {
    expect(hasUIRecordParent({})).toBeFalsy();
    expect(hasUIRecordParent(dummyArtboard)).toBeFalsy();
    expect(hasUIRecordParent(dummyArtboardHasParent)).toBeTruthy();
    expect(hasUIRecordParent(dummyLayer)).toBeFalsy();
    expect(hasUIRecordParent(dummyLayerHasParent)).toBeTruthy();
    expect(hasUIRecordParent(dummyShapeLayer)).toBeFalsy();
    expect(hasUIRecordParent(dummyShapeLayerHasParent)).toBeTruthy();
    expect(hasUIRecordParent(dummyTextLayer)).toBeFalsy();
    expect(hasUIRecordParent(dummyTextLayerHasParent)).toBeTruthy();
  });
});

describe('isUIRecordWithChildren', () => {
  test('should check if value can have children', () => {
    expect(isUIRecordWithChildren({})).toBeFalsy();
    expect(isUIRecordWithChildren(dummyUIRecord)).toBeFalsy();
    expect(isUIRecordWithChildren(dummyCanvas)).toBeTruthy();
    expect(isUIRecordWithChildren(dummyArtboard)).toBeTruthy();
    expect(isUIRecordWithChildren(dummyLayer)).toBeFalsy();
    expect(isUIRecordWithChildren(dummyShapeLayer)).toBeTruthy();
    expect(isUIRecordWithChildren(dummyTextLayer)).toBeFalsy();
  });
});

describe('hasUIRecordChildren', () => {
  const dummyCanvasHasChildren = new Canvas({
    ...dummyCanvasArgs,
    children: [dummyArtboard.toJSON(), dummyShapeLayer.toJSON(), dummyTextLayer.toJSON()],
  });
  const dummyArtboardHasChildren = new Artboard({
    ...dummyArtboardArgs,
    children: [dummyShapeLayer.toJSON(), dummyTextLayer.toJSON()],
  });
  const dummyShapeLayerHasChildren = new ShapeLayer({
    ...dummyShapeLayerArgs,
    children: [dummyTextLayer.toJSON()],
  });

  test('should check if value has children', () => {
    expect(hasUIRecordChildren({})).toBeFalsy();
    expect(hasUIRecordChildren(dummyCanvas)).toBeFalsy();
    expect(hasUIRecordChildren(dummyCanvasHasChildren)).toBeTruthy();
    expect(hasUIRecordChildren(dummyArtboard)).toBeFalsy();
    expect(hasUIRecordChildren(dummyArtboardHasChildren)).toBeTruthy();
    expect(hasUIRecordChildren(dummyShapeLayer)).toBeFalsy();
    expect(hasUIRecordChildren(dummyShapeLayerHasChildren)).toBeTruthy();
  });
});

describe('isRotatableUIRecord', () => {
  test('should check if value can rotate', () => {
    expect(isRotatableUIRecord({})).toBeFalsy();
    expect(isRotatableUIRecord(dummyUIRecord)).toBeFalsy();
    expect(isRotatableUIRecord(dummyCanvas)).toBeFalsy();
    expect(isRotatableUIRecord(dummyArtboard)).toBeFalsy();
    expect(isRotatableUIRecord(dummyLayer)).toBeTruthy();
    expect(isRotatableUIRecord(dummyShapeLayer)).toBeTruthy();
    expect(isRotatableUIRecord(dummyTextLayer)).toBeTruthy();
  });
});

describe('toUIRecordInstance', () => {
  test('should return instance from data', () => {
    expect(toUIRecordInstance(dummyUIRecordData)).toBeInstanceOf(UIRecord);
    expect(toUIRecordInstance(dummyCanvasData)).toBeInstanceOf(Canvas);
    expect(toUIRecordInstance(dummyArtboardData)).toBeInstanceOf(Artboard);
    expect(toUIRecordInstance(dummyLayerData)).toBeInstanceOf(Layer);
    expect(toUIRecordInstance(dummyShapeLayerData)).toBeInstanceOf(ShapeLayer);
    expect(toUIRecordInstance(dummyTextLayerData)).toBeInstanceOf(TextLayer);
  });
});

describe('flatUIRecords', () => {
  test('should return instance from data', () => {
    const tree = [
      new Canvas({
        ...dummyCanvasArgs,
        children: [
          new TextLayer({ ...dummyTextLayerArgs, key: 'a' }),
          new Artboard({
            ...dummyArtboardArgs,
            key: 'b',
            children: [
              new ShapeLayer({
                ...dummyShapeLayerArgs,
                key: 'c',
                children: [
                  new TextLayer({ ...dummyTextLayerArgs, key: 'd' }),
                  new ShapeLayer({ ...dummyShapeLayerArgs, key: 'e', children: [new TextLayer({ ...dummyTextLayerArgs, key: 'f' })] }),
                ],
              }),
            ],
          }),
        ],
      }),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = tree[0] as any;
    const a = canvas.children[0];
    const b = canvas.children[1];
    const c = canvas.children[1].children[0];
    const d = canvas.children[1].children[0].children[0];
    const e = canvas.children[1].children[0].children[1];
    const f = canvas.children[1].children[0].children[1].children[0];
    expect(flatUIRecords(tree).size).toEqual(7);
    expect(flatUIRecords(tree).get(CanvasKey)).toBe(canvas);
    expect(flatUIRecords(tree).get('a')).toBe(a);
    expect(flatUIRecords(tree).get('b')).toBe(b);
    expect(flatUIRecords(tree).get('c')).toBe(c);
    expect(flatUIRecords(tree).get('d')).toBe(d);
    expect(flatUIRecords(tree).get('e')).toBe(e);
    expect(flatUIRecords(tree).get('f')).toBe(f);
  });
});
