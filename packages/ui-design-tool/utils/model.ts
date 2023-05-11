import { Artboard, ArtboardData } from '@/api/Artboard/model';
import { Canvas, CanvasData } from '@/api/Canvas/model';
import { Layer, LayerData } from '@/api/Layer/model';
import { ShapeLayer, ShapeLayerData } from '@/api/ShapeLayer/model';
import { TextLayer, TextLayerData } from '@/api/TextLayer/model';
import { UIRecord, UIRecordData } from '@/api/UIRecord/model';
import { UIRecordKey } from '@/types/Identifier';

export type UIRecordWithParent = UIRecord & { parent: Artboard | Canvas | ShapeLayer | null };
export type UIRecordWithChildren = UIRecord & { children: Array<Artboard | ShapeLayer | TextLayer> };
export type RotatableUIRecord = Layer | ShapeLayer | TextLayer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordKey = (object: any): object is UIRecordKey => {
  return typeof object === 'string';
};

export type ExtractUIRecordWithParent<T> = T extends UIRecordWithParent ? T : never;
export type ExcludeUIRecordWithParent<T> = T extends UIRecordWithParent ? never : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithParent = <T extends UIRecordWithParent>(object: any): object is T => {
  // 타입 검증이므로 parent가 null이어도 존재하는 걸로 판단함
  return UIRecord.isModel(object) && (object as ExtendableAnyObject).parent !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordParent = <T extends UIRecordWithParent>(object: any): object is T & NonNullableRequired<Pick<T, 'parent'>> => {
  return isUIRecordWithParent(object) && object.parent != null;
};

export type ExtractUIRecordWithChildren<T> = T extends UIRecordWithChildren ? T : never;
export type ExcludeUIRecordWithChildren<T> = T extends UIRecordWithChildren ? never : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithChildren = <T extends UIRecordWithChildren>(object: any): object is T => {
  return UIRecord.isModel(object) && Array.isArray((object as ExtendableAnyObject).children);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordChildren = <T extends UIRecordWithChildren>(object: any): object is T => {
  return isUIRecordWithChildren(object) && object.children.length > 0;
};

export type ExtractRotatableUIRecord<T> = T extends RotatableUIRecord ? T : never;
export type ExcludeRotatableUIRecord<T> = T extends RotatableUIRecord ? never : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRotatableUIRecord = <T extends RotatableUIRecord>(object: any): object is T => {
  return UIRecord.isModel(object) && (object as ExtendableAnyObject).rotate != null;
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
