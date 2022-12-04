import { atom } from 'recoil';
import { MyState } from './types';
import { localStorageEffect } from '../persist';

export const myState = atom<MyState>({
  key: 'sample/myState',
  default: { author: 'choegyumin' },
  effects: [localStorageEffect('sample/myState')],
});
