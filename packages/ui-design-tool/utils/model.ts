import { UIRecordKey } from '@/types/Identifier';
import { Artboard, ArtboardData } from '@/ui-models/Artboard/model';
import { Canvas, CanvasData } from '@/ui-models/Canvas/model';
import { Layer, LayerData } from '@/ui-models/Layer/model';
import { ShapeLayer, ShapeLayerData } from '@/ui-models/ShapeLayer/model';
import { TextLayer, TextLayerData } from '@/ui-models/TextLayer/model';
import { UIRecord, UIRecordData } from '@/ui-models/UIRecord/model';

type UIRecordWithParent = Artboard | Layer | ShapeLayer | TextLayer;
type UIRecordWithChildren = Artboard | Canvas | ShapeLayer;
type RotatableUIRecord = Layer | ShapeLayer | TextLayer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordKey = (object: any): object is UIRecordKey => {
  return typeof object === 'string';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithParent = (object: any): object is UIRecordWithParent => {
  // 타입 검증이므로 parent가 null이어도 존재하는 걸로 판단함
  return UIRecord.isModel(object) && (object as AnyObject).parent !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordParent = (object: any): object is UIRecordWithParent & NonNullableRequired<Pick<UIRecordWithParent, 'parent'>> => {
  return isUIRecordWithParent(object) && object.parent != null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithChildren = (object: any): object is UIRecordWithChildren => {
  return UIRecord.isModel(object) && Array.isArray((object as AnyObject).children);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordChildren = (object: any): object is UIRecordWithChildren => {
  return isUIRecordWithChildren(object) && object.children.length > 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRotatableUIRecord = (object: any): object is RotatableUIRecord => {
  return UIRecord.isModel(object) && (object as AnyObject).rotate != null;
};

export interface ToUIRecordInstanceOptions {
  replaceParent?: boolean;
}

export const toUIRecordInstance = <T extends Artboard | Canvas | ShapeLayer | TextLayer | Layer | UIRecord>(
  current: ArtboardData | CanvasData | ShapeLayerData | TextLayerData | LayerData | UIRecordData,
  parent: UIRecordData | null = null,
  options: ToUIRecordInstanceOptions = {},
): T => {
  const { replaceParent = false } = options;
  const parentRecord = parent && toUIRecordInstance(parent);

  if (current instanceof UIRecord) {
    if (replaceParent) {
      Object.assign(current, { parent: parentRecord });
    }
    return current as T;
  }

  /* Layer */
  if (ShapeLayer.isModel(current)) {
    return new ShapeLayer(current, parentRecord as ConstructorParameters<typeof ShapeLayer>[1]) as T;
  }
  if (TextLayer.isModel(current)) {
    return new TextLayer(current, parentRecord as ConstructorParameters<typeof TextLayer>[1]) as T;
  }
  if (Layer.isModel(current)) {
    return new Layer(current, parentRecord as ConstructorParameters<typeof Layer>[1]) as T;
  }

  /* Artboard */
  if (Artboard.isModel(current)) {
    return new Artboard(current, parentRecord as ConstructorParameters<typeof Artboard>[1]) as T;
  }

  /* Canvas */
  if (Canvas.isModel(current)) {
    return new Canvas(current) as T;
  }

  /* Unknown */
  return new UIRecord(current as ConstructorParameters<typeof UIRecord>[0]) as T;
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
