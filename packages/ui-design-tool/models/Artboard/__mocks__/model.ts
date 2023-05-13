import { UIRecordType } from '@/types/Identifier';
import { uuid } from '@pigyuma/utils';
import { ArtboardJSON } from '../model';

export function makeDummyArtboardJSON(data: Partial<ArtboardJSON> = {}): ArtboardJSON {
  const key = uuid.v4();
  return Object.assign(
    {
      key,
      type: UIRecordType.artboard,
      name: `Artboard (${key})`,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: '#fff',
      children: [],
    },
    data,
  );
}
