import { UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';
import { ArtboardJSON } from '../model';

export function makeDummyArtboardJSON(data: Partial<ArtboardJSON> = {}): ArtboardJSON {
  return Object.assign(
    {
      key: uuid.v4(),
      type: UIRecordType.artboard,
      name: 'Artboard',
      x: 100,
      y: 50,
      width: 400,
      height: 300,
      fill: '#fff',
      children: [],
    },
    data,
  );
}
