import { LayerType, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';
import { ShapeLayerJSON } from '../model';

export function makeDummyShapeLayerJSON(data: Partial<ShapeLayerJSON> = {}): ShapeLayerJSON {
  return Object.assign(
    {
      key: uuid.v4(),
      type: UIRecordType.layer,
      layerType: LayerType.shape,
      name: 'Shape Layer',
      shapeType: 'container',
      x: { length: 100, lengthType: 'px' },
      y: { length: 50, lengthType: 'px' },
      rotate: { degrees: 0 },
      width: { length: 400, lengthType: 'px' },
      height: { length: 300, lengthType: 'px' },
      stroke: { color: 'black', pattern: 'solid', width: { top: 1, right: 1, bottom: 1, left: 1 } },
      fill: { color: 'white' },
      children: [],
    },
    data,
  );
}
