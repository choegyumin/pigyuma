import { UIRecordKey, LayerType, UIRecordType } from '@/types/Identifier';
import { UIRecordTree } from '@/types/Tree';
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
} from '@/utils/convert';
import { clone, uuid } from '@pigyuma/utils';
import React from 'react';
import { Artboard } from '../Artboard/Artboard.model';
import { Canvas } from '../Canvas/Canvas.model';
import { Layer, LayerArgs, LayerJSON } from '../Layer/Layer.model';
import * as styles from './TextLayer.css';

export interface TextLayerJSON extends LayerJSON {
  key: UIRecordKey;
  type: Extract<UIRecordType, 'layer'>;
  layerType: Extract<LayerType, 'text'>;
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

export interface TextLayerData {
  key?: TextLayerJSON['key'];
  type: TextLayerJSON['type'];
  layerType: TextLayerJSON['layerType'];
  x: TextLayerJSON['x'];
  y: TextLayerJSON['y'];
  width: TextLayerJSON['width'];
  height: TextLayerJSON['height'];
  rotate: TextLayerJSON['rotate'];
  textColor: TextLayerJSON['textColor'];
  fontSize: TextLayerJSON['fontSize'];
  lineHeight: TextLayerJSON['lineHeight'];
  fontWeight: TextLayerJSON['fontWeight'];
  letterSpacing: TextLayerJSON['letterSpacing'];
  content: TextLayerJSON['content'];
}

export interface TextLayerStyle extends React.CSSProperties, Record<ValueOf<typeof styles.varNames>, StyleValue> {}

export interface TextLayerArgs {
  key?: TextLayerData['key'];
  type?: TextLayerData['type'];
  layerType?: TextLayerData['layerType'];
  x: TextLayerData['x'];
  y: TextLayerData['y'];
  width: TextLayerData['width'];
  height: TextLayerData['height'];
  rotate: TextLayerData['rotate'];
  textColor: TextLayerData['textColor'];
  fontSize: TextLayerData['fontSize'];
  lineHeight: TextLayerData['lineHeight'];
  fontWeight: TextLayerData['fontWeight'];
  letterSpacing: TextLayerData['letterSpacing'];
  content: TextLayerData['content'];
}

export class TextLayer extends Layer {
  public readonly key: UIRecordKey;
  public readonly type: Extract<UIRecordType, 'layer'>;
  public readonly layerType: Extract<LayerType, 'text'>;
  public readonly x: XValueObject;
  public readonly y: YValueObject;
  public readonly width: WidthValueObject;
  public readonly height: HeightValueObject;
  public readonly rotate: RotateValueObject;
  public readonly textColor: TextColorValueObject;
  public readonly fontSize: FontSizeValueObject;
  public readonly lineHeight: LineHeightValueObject;
  /** @todo 폰트에 정의된 값을 기반으로 동작하도록 수정 */
  public readonly fontWeight: FontWeightValueObject;
  public readonly letterSpacing: LetterSpacingValueObject;
  public readonly content: string;
  public readonly parent?: Artboard | Canvas | Layer;

  constructor(args: TextLayerArgs, parent?: Artboard | Canvas | Layer) {
    const superArgs = clone(args) as LayerArgs;
    superArgs.layerType = LayerType.text;
    super(superArgs, parent);
    this.key = args.key || uuid.v4();
    this.type = UIRecordType.layer;
    this.layerType = superArgs.layerType;
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

  get tree(): UIRecordTree {
    return {
      key: this.key,
      children: [],
      parent: this.parent?.key,
    };
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
      [styles.varNames.degrees]: convertRotateValue(object.rotate),
      [styles.varNames.textColor]: convertTextColorValue(object.textColor),
      [styles.varNames.fontSize]: convertFontSizeValue(object.fontSize),
      [styles.varNames.lineHeight]: convertLineHeightValue(object.lineHeight),
      [styles.varNames.fontWeight]: convertFontWeightValue(object.fontWeight),
      [styles.varNames.letterSpacing]: convertLetterSpacingValue(object.letterSpacing),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isModel(object: any): object is TextLayerJSON {
    return (
      object instanceof TextLayer ||
      (object != null &&
        typeof object === 'object' &&
        !Array.isArray(object) &&
        object.type === UIRecordType.layer &&
        object.layerType === LayerType.text)
    );
  }
}
