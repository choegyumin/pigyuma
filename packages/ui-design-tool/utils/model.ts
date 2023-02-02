import { Artboard } from '@/components/Artboard/Artboard.model';
import { Canvas } from '@/components/Canvas/Canvas.model';
import { Layer } from '@/components/Layer/Layer.model';
import { ShapeLayer } from '@/components/ShapeLayer/ShapeLayer.model';
import { TextLayer } from '@/components/TextLayer/TextLayer.model';
import {
  UIRecord,
  UIRecordChildrenAttributes,
  UIRecordData,
  UIRecordJSON,
  UIRecordParentAttributes,
} from '@/components/UIRecord/UIRecord.model';
import { UIRecordKey } from '@/types/Identifier';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordKey = (object: any): object is UIRecordKey => {
  return typeof object === 'string';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithParent = (object: any): object is UIRecordJSON & UIRecordParentAttributes => {
  // 타입 검증이므로 parent가 null이어도 존재하는 걸로 판단함
  return UIRecord.isModel(object) && (object as AnyObject).parent !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordParent = (object: any): object is UIRecordJSON & NonNullableRequired<UIRecordParentAttributes> => {
  return isUIRecordWithParent(object) && object.parent != null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUIRecordWithChildren = (object: any): object is UIRecordJSON & UIRecordChildrenAttributes => {
  return UIRecord.isModel(object) && Array.isArray((object as AnyObject).children);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasUIRecordChildren = (object: any): object is UIRecordJSON & UIRecordChildrenAttributes => {
  return isUIRecordWithChildren(object) && object.children.length > 0;
};

export interface ToUIRecordInstanceOptions {
  replaceParent?: boolean;
}

export const toUIRecordInstance = (
  current: UIRecordData,
  parent: UIRecordData | null = null,
  options: ToUIRecordInstanceOptions = {},
): UIRecord | Canvas | Artboard | Layer | ShapeLayer | TextLayer => {
  const { replaceParent = false } = options;
  const parentRecord = parent && toUIRecordInstance(parent);

  if (current instanceof UIRecord) {
    if (replaceParent) {
      Object.assign(current, { parent: parentRecord });
    }
    return current;
  }

  /* Layer */
  if (ShapeLayer.isModel(current)) {
    return new ShapeLayer(current, parentRecord as ConstructorParameters<typeof ShapeLayer>[1]);
  }
  if (TextLayer.isModel(current)) {
    return new TextLayer(current, parentRecord as ConstructorParameters<typeof TextLayer>[1]);
  }
  if (Layer.isModel(current)) {
    return new Layer(current, parentRecord as ConstructorParameters<typeof Layer>[1]);
  }

  /* Artboard */
  if (Artboard.isModel(current)) {
    return new Artboard(current, parentRecord as ConstructorParameters<typeof Artboard>[1]);
  }

  /* Canvas */
  if (Canvas.isModel(current)) {
    return new Canvas(current);
  }

  /* Unknown */
  return new UIRecord(current);
};
