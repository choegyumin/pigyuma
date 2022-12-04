import { selector } from 'recoil';
import { myState } from './sample/states';

export const mySelector = selector({
  key: 'mySelector',
  get: ({ get }) => get(myState) != null,
});
