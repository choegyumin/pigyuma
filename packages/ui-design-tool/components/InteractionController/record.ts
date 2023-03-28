import { ArtboardArgs } from '@/api/Artboard/model';
import { ShapeLayerArgs, ShapeType } from '@/api/ShapeLayer/model';
import { TextLayerArgs } from '@/api/TextLayer/model';
import {
  FontSizeLengthType,
  HeightLengthType,
  LetterSpacingLengthType,
  LineHeightLengthType,
  WidthLengthType,
  XLengthType,
  YLengthType,
} from '@/types/Unit';

export const makeDefaultArtboardArgs = (name: string, x: number, y: number): ArtboardArgs => ({
  name,
  x,
  y,
  width: 1,
  height: 1,
  fill: '#ffffff',
  children: [],
});

export const makeDefaultShapeLayerArgs = (name: string, x: number, y: number): ShapeLayerArgs => ({
  name,
  x: { length: x, lengthType: XLengthType.px },
  y: { length: y, lengthType: YLengthType.px },
  shapeType: ShapeType.container,
  width: { length: 1, lengthType: WidthLengthType.px },
  height: { length: 1, lengthType: HeightLengthType.px },
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
  width: { length: 1, lengthType: WidthLengthType.flexible },
  height: { length: 1, lengthType: HeightLengthType.flexible },
  textColor: { color: '#000000' },
  fontSize: { length: 16, lengthType: FontSizeLengthType.px },
  lineHeight: { length: 150, lengthType: LineHeightLengthType.percent },
  fontWeight: { value: 400 },
  letterSpacing: { length: 0, lengthType: LetterSpacingLengthType.px },
  content: '',
});
