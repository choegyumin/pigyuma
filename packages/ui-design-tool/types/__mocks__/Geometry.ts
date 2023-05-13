import { ArtboardData } from '@/models/Artboard/model';
import { ShapeLayerData } from '@/models/ShapeLayer/model';
import { UIRecordRect } from '../Geometry';

export function makeUIRecordRectFromCanvas(): UIRecordRect {
  return new UIRecordRect(0, 0, 1920, 1080, 0);
}

export function makeUIRecordRectFromArtboard(artboard: ArtboardData): UIRecordRect {
  return new UIRecordRect(artboard.x, artboard.y, artboard.width, artboard.height, 0);
}

export function makeUIRecordRectFromShapeLayer(shapeLayer: ShapeLayerData): UIRecordRect {
  return new UIRecordRect(
    shapeLayer.x.length,
    shapeLayer.y.length,
    shapeLayer.width.length,
    shapeLayer.height.length,
    shapeLayer.rotate.degrees,
  );
}
