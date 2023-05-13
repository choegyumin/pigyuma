import { ArtboardArgs } from '@/models/Artboard/model';
import { ShapeLayerArgs, ShapeType } from '@/models/ShapeLayer/model';
import { TextLayerArgs } from '@/models/TextLayer/model';
import {
  FontSizeLengthType,
  HeightLengthType,
  LetterSpacingLengthType,
  LineHeightLengthType,
  WidthLengthType,
  XLengthType,
  YLengthType,
} from '@/types/Unit';

export const makeDefaultArtboardArgs = (name: string, x: number, y: number, width: number, height: number): ArtboardArgs => ({
  name,
  x,
  y,
  width,
  height,
  fill: '#ffffff',
  children: [],
});

export const makeDefaultShapeLayerArgs = (name: string, x: number, y: number, width: number, height: number): ShapeLayerArgs => ({
  name,
  x: { length: x, lengthType: XLengthType.px },
  y: { length: y, lengthType: YLengthType.px },
  shapeType: ShapeType.container,
  width: { length: width, lengthType: WidthLengthType.px },
  height: { length: height, lengthType: HeightLengthType.px },
  rotate: { degrees: 0 },
  stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
  fill: { color: '#aaaaaa' },
  children: [],
});

export const makeDefaultTextLayerArgs = (name: string, x: number, y: number): TextLayerArgs => ({
  name,
  x: { length: x, lengthType: XLengthType.px },
  y: { length: y, lengthType: YLengthType.px },
  rotate: { degrees: 0 },
  width: { length: 0, lengthType: WidthLengthType.flexible },
  height: { length: 0, lengthType: HeightLengthType.flexible },
  textColor: { color: '#000000' },
  fontSize: { length: 16, lengthType: FontSizeLengthType.px },
  lineHeight: { length: 150, lengthType: LineHeightLengthType.percent },
  fontWeight: { value: 400 },
  letterSpacing: { length: 0, lengthType: LetterSpacingLengthType.px },
  content: '',
});
