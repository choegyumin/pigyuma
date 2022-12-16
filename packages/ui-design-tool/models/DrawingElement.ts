/** @todo 모듈 분리 */

// Layer types ======================================================================

export const LayerType = {
  // `display: block;`. It behaves as `position: absolute;`, If inside Stack
  container: 'container',
  // `display: block; position: relative;`.
  stack: 'stack',
  // `display: flex; flex-direction: rows;`.
  columns: 'columns',
  // `display: flex; flex-direction: columns;`.
  rows: 'rows',
  // `display: grid;`.
  grid: 'grid',
  // `display: block;` with typography style.
  text: 'text',
} as const;
export type LayerType = typeof LayerType;

// Unit types ======================================================================

export const NumberUnit = {
  em: 'em',
  empty: '',
  keyword: '',
  percent: '%',
  px: 'px',
} as const;
export type NumberUnit = typeof NumberUnit;

export const FontSizeUnit = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type FontSizeUnit = typeof FontSizeUnit;

export const HeightUnit = {
  filled: NumberUnit.keyword, // `stretch` (`-webkit-fill-available`)
  flexible: NumberUnit.keyword, // `fit-content`
  fixed: NumberUnit.px,
  relatived: NumberUnit.percent,
};
export type HeightUnit = typeof HeightUnit;

export const LetterSpacingUnit = {
  percent: NumberUnit.em,
  px: NumberUnit.px,
};
export type LetterSpacingUnit = typeof LetterSpacingUnit;

export const LineHeightUnit = {
  px: NumberUnit.px,
  percent: NumberUnit.empty,
};
export type LineHeightUnit = typeof LineHeightUnit;

export const WidthUnit = {
  filled: NumberUnit.keyword, // `stretch` (`-webkit-fill-available`)
  flexible: NumberUnit.keyword, // `fit-content`
  fixed: NumberUnit.px,
  relatived: NumberUnit.percent,
};
export type WidthUnit = typeof WidthUnit;

export const XUnit = {
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type XUnit = typeof XUnit;

export const YUnit = {
  percent: NumberUnit.percent,
  px: NumberUnit.px,
};
export type YUnit = typeof YUnit;

export type FontSizeUnitType = keyof typeof FontSizeUnit;
export type HeightUnitType = keyof typeof HeightUnit;
export type LetterSpacingUnitType = keyof typeof LetterSpacingUnit;
export type LineHeightUnitType = keyof typeof LineHeightUnit;
export type WidthUnitType = keyof typeof WidthUnit;
export type XUnitType = keyof typeof XUnit;
export type YUnitType = keyof typeof YUnit;

// Value types ======================================================================

export type StyleValue = string;
export type TextChildren = string;

export type FontSizeValueObject = { value: number; unitType: FontSizeUnitType };
export type FontWeightValueObject = { value: number };
export type HeightValueObject = { value: number; unitType: HeightUnitType };
export type LetterSpacingValueObject = { value: number; unitType: LetterSpacingUnitType };
export type LineHeightValueObject = { value: number; unitType: LineHeightUnitType };
export type WidthValueObject = { value: number; unitType: WidthUnitType };
export type XValueObject = { value: number; unitType: XUnitType };
export type YValueObject = { value: number; unitType: YUnitType };

// Element types ======================================================================

export type ShapeDrawingElementType =
  | LayerType['container']
  | LayerType['stack']
  | LayerType['columns']
  | LayerType['rows']
  | LayerType['grid'];
export const SHAPE_DRAWING_ELEMENT_TYPES: ShapeDrawingElementType[] = [
  LayerType.container,
  LayerType.stack,
  LayerType.columns,
  LayerType.rows,
  LayerType.grid,
];

export type TextDrawingElementType = LayerType['text'];
export const TEXT_DRAWING_ELEMENT_TYPES: TextDrawingElementType[] = [LayerType.text];

export type DrawingElementType = ShapeDrawingElementType | TextDrawingElementType;

// functions ======================================================================

export const isShapeDrawingElementModel = (object: AnyObject): object is ShapeDrawingElementModel => {
  return object instanceof ShapeDrawingElement || SHAPE_DRAWING_ELEMENT_TYPES.includes(object.type);
};
export const isTextDrawingElementModel = (object: AnyObject): object is TextDrawingElementModel => {
  return object instanceof TextDrawingElement || TEXT_DRAWING_ELEMENT_TYPES.includes(object.type);
};

export const convertXValue = ({ value, unitType }: XValueObject): StyleValue => {
  return `${value}${XUnit[unitType]}`;
};
export const convertYValue = ({ value, unitType }: YValueObject): StyleValue => {
  return `${value}${YUnit[unitType]}`;
};
export const convertWidthValue = ({ value, unitType }: WidthValueObject): StyleValue => {
  return `${value}${WidthUnit[unitType]}`;
};
export const convertHeightValue = ({ value, unitType }: HeightValueObject): StyleValue => {
  return `${value}${HeightUnit[unitType]}`;
};
export const convertFontSizeValue = ({ value, unitType }: FontSizeValueObject): StyleValue => {
  const unit = FontSizeUnit[unitType];
  return `${unit === FontSizeUnit.percent ? value / 100 : value}${unit}`;
};
export const convertFontWeightValue = ({ value }: FontWeightValueObject): StyleValue => {
  return `${value}`;
};
export const convertLineHeightValue = ({ value, unitType }: LineHeightValueObject): StyleValue => {
  const unit = LineHeightUnit[unitType];
  return `${unit === LineHeightUnit.percent ? value / 100 : value}${unit}`;
};
export const convertLetterSpacingValue = ({ value, unitType }: LetterSpacingValueObject): StyleValue => {
  return `${value}${LetterSpacingUnit[unitType]}`;
};

// Element Models ======================================================================

export interface ShapeDrawingElementArgs {
  type: ShapeDrawingElement['type'];
  x: ShapeDrawingElement['x'];
  y: ShapeDrawingElement['y'];
  width: ShapeDrawingElement['width'];
  height: ShapeDrawingElement['height'];
  children?: Array<ShapeDrawingElementModel | ShapeDrawingElement | TextDrawingElementModel | TextDrawingElement>;
}

export interface ShapeDrawingElementValues {
  type: ShapeDrawingElementType;
  x: StyleValue;
  y: StyleValue;
  width: StyleValue;
  height: StyleValue;
  children: Array<ShapeDrawingElementValues | TextDrawingElementValues>;
}

export interface ShapeDrawingElementModel {
  type: ShapeDrawingElementType;
  x: XValueObject;
  y: YValueObject;
  width: WidthValueObject;
  height: HeightValueObject;
  children: Array<ShapeDrawingElementModel | TextDrawingElementModel>;
}

export class ShapeDrawingElement implements ShapeDrawingElementModel {
  public readonly type: ShapeDrawingElementType;
  public readonly x: XValueObject;
  public readonly y: YValueObject;
  public readonly width: WidthValueObject;
  public readonly height: HeightValueObject;
  public readonly children: Array<ShapeDrawingElement | TextDrawingElement>;

  constructor(args: ShapeDrawingElementArgs) {
    this.type = args.type;
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.children =
      (args.children
        ?.map((it) => {
          if (it instanceof ShapeDrawingElement || it instanceof TextDrawingElement) {
            return it;
          }
          if (isTextDrawingElementModel(it)) {
            return new TextDrawingElement(it);
          }
          if (isShapeDrawingElementModel(it)) {
            return new ShapeDrawingElement(it);
          }
          return null;
        })
        .filter(Boolean) as typeof this.children) ?? [];
  }

  get values(): ShapeDrawingElementValues {
    return {
      type: this.type,
      x: convertXValue(this.x),
      y: convertYValue(this.y),
      width: convertWidthValue(this.width),
      height: convertHeightValue(this.height),
      children: this.children.map((it) => it.values),
    };
  }
}

export interface TextDrawingElementArgs {
  type?: TextDrawingElement['type'];
  fontSize: TextDrawingElement['fontSize'];
  lineHeight: TextDrawingElement['lineHeight'];
  fontWeight: TextDrawingElement['fontWeight'];
  letterSpacing: TextDrawingElement['letterSpacing'];
  children: TextDrawingElement['children'];
}

export interface TextDrawingElementValues {
  type: TextDrawingElementType;
  fontSize: StyleValue;
  lineHeight: StyleValue;
  fontWeight: StyleValue;
  letterSpacing: StyleValue;
  children: TextChildren;
}

export interface TextDrawingElementModel {
  type: TextDrawingElementType;
  fontSize: FontSizeValueObject;
  lineHeight: LineHeightValueObject;
  /** @todo 폰트에 정의된 값을 기반으로 동작하도록 수정 */
  fontWeight: FontWeightValueObject;
  letterSpacing: LetterSpacingValueObject;
  children: string;
}

export class TextDrawingElement implements TextDrawingElementModel {
  public readonly type: TextDrawingElementType;
  public readonly fontSize: FontSizeValueObject;
  public readonly lineHeight: LineHeightValueObject;
  public readonly fontWeight: FontWeightValueObject;
  public readonly letterSpacing: LetterSpacingValueObject;
  public readonly children: string;

  constructor(args: TextDrawingElementArgs) {
    this.type = LayerType.text;
    this.fontSize = args.fontSize;
    this.lineHeight = args.lineHeight;
    this.fontWeight = args.fontWeight;
    this.letterSpacing = args.letterSpacing;
    this.children = args.children;
  }

  get values(): TextDrawingElementValues {
    return {
      type: this.type,
      fontSize: convertFontSizeValue(this.fontSize),
      lineHeight: convertLineHeightValue(this.lineHeight),
      fontWeight: convertFontWeightValue(this.fontWeight),
      letterSpacing: convertLetterSpacingValue(this.letterSpacing),
      children: this.children,
    };
  }
}
