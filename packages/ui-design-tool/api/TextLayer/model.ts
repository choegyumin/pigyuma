import { UIRecordKey, LayerType, UIRecordType, UIRecordElementDataset } from '@/types/Identifier';
import {
  FontSizeValueObject,
  FontWeightValueObject,
  HeightValueObject,
  LetterSpacingValueObject,
  LineHeightValueObject,
  RotateValueObject,
  StyleValue,
  TextColorValueObject,
  WidthValueObject,
  XValueObject,
  YValueObject,
} from '@/types/Value';
import {
  convertFontSizeValue,
  convertFontWeightValue,
  convertHeightValue,
  convertLetterSpacingValue,
  convertLineHeightValue,
  convertRotateValue,
  convertTextColorValue,
  convertWidthValue,
  convertXValue,
  convertYValue,
} from '@/utils/value';
import { clone, uuid } from '@pigyuma/utils';
import { produce } from 'immer';
import React from 'react';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { Layer, LayerArgs, LayerJSON } from '../Layer/model';
import { ShapeLayer } from '../ShapeLayer/model';
import * as styles from './styles.css';

export interface TextLayerValues {
  name: string;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  rotate: RotateValueObject;
  textColor: TextColorValueObject;
  fontSize: FontSizeValueObject;
  lineHeight: LineHeightValueObject;
  fontWeight: FontWeightValueObject;
  letterSpacing: LetterSpacingValueObject;
  content: string;
}

export interface TextLayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface TextLayerJSON extends LayerJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: Extract<LayerType, 'text'>;
  values: TextLayerValues;
}

type OptionalTextLayerDataKey = 'key';
export interface TextLayerData
  extends Partial<Pick<TextLayerJSON, OptionalTextLayerDataKey>>,
    Omit<TextLayerJSON, OptionalTextLayerDataKey> {}

type OptionalTextLayerArgsKey = 'key' | 'type' | 'layerType';
export interface TextLayerArgs
  extends Partial<Pick<TextLayerJSON, OptionalTextLayerArgsKey>>,
    Omit<TextLayerJSON, OptionalTextLayerArgsKey> {}

export class TextLayer extends Layer implements TextLayerJSON {
  readonly key: UIRecordKey;
  readonly type: Extract<UIRecordType, 'layer'>;
  readonly layerType: Extract<LayerType, 'text'>;
  readonly values: Readonly<TextLayerValues>;
  readonly parent: Artboard | Canvas | ShapeLayer | null;

  constructor(args: TextLayerArgs, parent: Artboard | Canvas | ShapeLayer | null = null) {
    const superArgs = clone(args) as LayerArgs;
    superArgs.key = superArgs.key || uuid.v4();
    superArgs.type = UIRecordType.layer;
    superArgs.layerType = LayerType.text;

    super(superArgs);
    this.key = superArgs.key;
    this.type = superArgs.type;
    this.layerType = superArgs.layerType;

    this.values = args.values;
    this.parent = parent;
  }

  get style(): TextLayerStyle {
    return TextLayer.getStyle(this);
  }

  static getStyle(object: TextLayer | TextLayerJSON): TextLayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.values.x),
      [styles.varNames.y]: convertYValue(object.values.y),
      [styles.varNames.width]: convertWidthValue(object.values.width),
      [styles.varNames.height]: convertHeightValue(object.values.height),
      [styles.varNames.rotate]: convertRotateValue(object.values.rotate),
      [styles.varNames.textColor]: convertTextColorValue(object.values.textColor),
      [styles.varNames.fontSize]: convertFontSizeValue(object.values.fontSize),
      [styles.varNames.lineHeight]: convertLineHeightValue(object.values.lineHeight),
      [styles.varNames.fontWeight]: convertFontWeightValue(object.values.fontWeight),
      [styles.varNames.letterSpacing]: convertLetterSpacingValue(object.values.letterSpacing),
    };
  }

  toJSON(): TextLayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      values: this.values,
    };
  }

  /** @todo 정밀한 조건으로 재작성 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validate(object: any): object is TextLayerJSON {
    return (
      object != null &&
      typeof object === 'object' &&
      !Array.isArray(object) &&
      object.type === UIRecordType.layer &&
      object.layerType === LayerType.text
    );
  }

  static isElement(element: Element | null): boolean {
    return (
      element instanceof HTMLElement &&
      element.dataset[UIRecordElementDataset.type] === UIRecordType.layer &&
      element.dataset[UIRecordElementDataset.layerType] === LayerType.text
    );
  }

  static makeValuesChanges(values: DeepPartial<TextLayerValues>, origin: TextLayerValues) {
    // prettier-ignore
    return produce(Layer.makeValuesChanges(values, origin) as unknown as TextLayerValues, (draft) => {
      if (values.textColor?.color != null) { draft.textColor.color = values.textColor.color; }
      if (values.fontSize?.length != null) { draft.fontSize.length = values.fontSize.length; }
      if (values.fontSize?.lengthType != null) { draft.fontSize.lengthType = values.fontSize.lengthType; }
      if (values.lineHeight?.length != null) { draft.lineHeight.length = values.lineHeight.length; }
      if (values.lineHeight?.lengthType != null) { draft.lineHeight.lengthType = values.lineHeight.lengthType; }
      if (values.fontWeight?.value != null) { draft.fontWeight.value = values.fontWeight.value; }
      if (values.letterSpacing?.length != null) { draft.letterSpacing.length = values.letterSpacing.length; }
      if (values.letterSpacing?.lengthType != null) { draft.letterSpacing.lengthType = values.letterSpacing.lengthType; }
      if (values.content != null) { draft.content = values.content; }
    });
  }
}
