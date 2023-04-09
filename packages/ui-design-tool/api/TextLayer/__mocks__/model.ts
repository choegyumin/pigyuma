import { LayerType, UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';
import { TextLayerJSON } from '../model';

export function makeDummyTextLayerJSON(data: Partial<TextLayerJSON> = {}): TextLayerJSON {
  return Object.assign(
    {
      key: uuid.v4(),
      type: UIRecordType.layer,
      layerType: LayerType.text,
      name: 'Text Layer',
      x: { length: 0, lengthType: 'auto' },
      y: { length: 0, lengthType: 'auto' },
      rotate: { degrees: 0 },
      width: { length: 0, lengthType: 'flexible' },
      height: { length: 0, lengthType: 'flexible' },
      textColor: { color: 'black' },
      fontSize: { length: 14, lengthType: 'px' },
      lineHeight: { length: 150, lengthType: 'percent' },
      fontWeight: { value: 400 },
      letterSpacing: { length: 0, lengthType: 'px' },
      content: 'Content',
    },
    data,
  );
}
