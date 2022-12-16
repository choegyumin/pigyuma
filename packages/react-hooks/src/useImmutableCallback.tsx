import ReactTypes from '@pigyuma/react-utility-types';
import { useCallback } from 'react';

export default function useImmutableCallback<T extends ReactTypes.CallbackFunction>(callback: T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<T>(callback, []);
}
