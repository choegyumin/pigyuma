import { AtomEffect } from 'recoil';
import { SERVER_ENV } from '~/utils/env';

/**
 * Local Storage Persistence
 * See {@link https://recoiljs.org/docs/guides/atom-effects/#local-storage-persistence}
 */
export const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    if (!SERVER_ENV) {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
      onSet((newValue, _, isReset) => {
        if (isReset || newValue == null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      });
    }
  };
