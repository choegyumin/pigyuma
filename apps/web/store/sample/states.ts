import { atom } from 'recoil';
import { localStorageEffect } from '../persist';
import { MyState } from './types';

export const myState = atom<MyState>({
  key: 'sample/myState',
  default: { author: 'choegyumin' },
  effects: [localStorageEffect('sample/myState')],
});
