import { UIRecordType } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { uuid } from '@pigyuma/utils';
import { Artboard, ArtboardJSON } from './model';
import * as styles from './styles.css';

describe('Artboard', () => {
  const artboardKey = uuid.v4();
  const artboardType = UIRecordType.artboard;
  const artboardArgs = {
    key: artboardKey,
    name: 'artboard',
    x: 100,
    y: 200,
    width: 300,
    height: 400,
    fill: '#fff',
    children: [],
  };
  const artboardJSON: ArtboardJSON = {
    ...artboardArgs,
    type: artboardType,
  };
  const artboard = new Artboard({ ...artboardArgs });

  test('should create instance', () => {
    expect(artboard.key).toBe(artboardKey);
    expect(artboard.type).toBe(artboardType);
  });

  test('should create instance with generated key', () => {
    const artboard = new Artboard({ ...artboardArgs, key: undefined });
    expect(isUIRecordKey(artboard.key)).toBeTruthy();
  });

  test('should return correct style', () => {
    expect(Artboard.getStyle(artboardJSON)).toEqual({
      [styles.varNames.x]: '100px',
      [styles.varNames.y]: '200px',
      [styles.varNames.width]: '300px',
      [styles.varNames.height]: '400px',
    });
    expect(artboard.style).toEqual(Artboard.getStyle(artboardJSON));
  });

  test('should return correct JSON object', () => {
    expect(artboard.toJSON()).toEqual(artboardJSON);
  });

  test('should check if object is ArtboardJSON', () => {
    expect(Artboard.validate(artboardJSON)).toBeTruthy();
    expect(Artboard.validate({})).toBeFalsy();
    expect(Artboard.validate([])).toBeFalsy();
    expect(Artboard.validate(null)).toBeFalsy();
  });
});
