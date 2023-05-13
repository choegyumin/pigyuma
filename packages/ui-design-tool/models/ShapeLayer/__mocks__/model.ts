import { LayerType, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';
import { ShapeLayerJSON } from '../model';

export function makeDummyShapeLayerJSON(data: Partial<ShapeLayerJSON> = {}): ShapeLayerJSON {
  const key = uuid.v4();
  return Object.assign(
    {
      key,
      type: UIRecordType.layer,
      layerType: LayerType.shape,
      name: `Shape Layer (${key})`,
      shapeType: 'container',
      x: { length: 0, lengthType: 'px' },
      y: { length: 0, lengthType: 'px' },
      rotate: { degrees: 0 },
      width: { length: 100, lengthType: 'px' },
      height: { length: 100, lengthType: 'px' },
      stroke: { color: 'black', pattern: 'solid', width: { top: 1, right: 1, bottom: 1, left: 1 } },
      fill: { color: 'white' },
      children: [],
    },
    data,
  );
}
