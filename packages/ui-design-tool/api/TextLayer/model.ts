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
import React from 'react';
import { Artboard } from '../Artboard/model';
import { Canvas } from '../Canvas/model';
import { Layer, LayerArgs, LayerJSON } from '../Layer/model';
import { ShapeLayer } from '../ShapeLayer/model';
import * as styles from './styles.css';

export interface TextLayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface TextLayerJSON extends LayerJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: Extract<LayerType, 'text'>;
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
  readonly name: string;
  readonly x: XValueObject;
  readonly y: YValueObject;
  readonly width: WidthValueObject;
  readonly height: HeightValueObject;
  readonly rotate: RotateValueObject;
  readonly textColor: TextColorValueObject;
  readonly fontSize: FontSizeValueObject;
  readonly lineHeight: LineHeightValueObject;
  /** @todo 폰트에 정의된 값을 기반으로 동작하도록 수정 (e.g. Regular, Medium, Bold, Black, ..) */
  readonly fontWeight: FontWeightValueObject;
  readonly letterSpacing: LetterSpacingValueObject;
  readonly content: string;
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

    this.name = args.name;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.rotate = args.rotate;
    this.textColor = args.textColor;
    this.fontSize = args.fontSize;
    this.lineHeight = args.lineHeight;
    this.fontWeight = args.fontWeight;
    this.letterSpacing = args.letterSpacing;
    this.content = args.content;
    this.parent = parent;
  }

  get style(): TextLayerStyle {
    return TextLayer.getStyle(this);
  }

  static getStyle(object: TextLayer | TextLayerJSON): TextLayerStyle {
    return {
      [styles.varNames.x]: convertXValue(object.x),
      [styles.varNames.y]: convertYValue(object.y),
      [styles.varNames.width]: convertWidthValue(object.width),
      [styles.varNames.height]: convertHeightValue(object.height),
      [styles.varNames.rotate]: convertRotateValue(object.rotate),
      [styles.varNames.textColor]: convertTextColorValue(object.textColor),
      [styles.varNames.fontSize]: convertFontSizeValue(object.fontSize),
      [styles.varNames.lineHeight]: convertLineHeightValue(object.lineHeight),
      [styles.varNames.fontWeight]: convertFontWeightValue(object.fontWeight),
      [styles.varNames.letterSpacing]: convertLetterSpacingValue(object.letterSpacing),
    };
  }

  toJSON(): TextLayerJSON {
    return {
      key: this.key,
      type: this.type,
      layerType: this.layerType,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotate: this.rotate,
      textColor: this.textColor,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      fontWeight: this.fontWeight,
      letterSpacing: this.letterSpacing,
      content: this.content,
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

  static makeChanges(values: DeepPartial<TextLayerData>, origin: TextLayerData) {
    const v = Layer.makeChanges(values, origin) as DeepPartial<TextLayerData>;
    return v;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static supportParent(object: any): object is Artboard | Canvas | ShapeLayer {
    return object instanceof Artboard || object instanceof Canvas || object instanceof ShapeLayer;
  }
}
