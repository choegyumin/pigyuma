import { useReducer } from 'react';

export default function useForceUpdate(): () => void {
  const [, dispatch] = useReducer((state: number) => state + 1, 0);
  return dispatch;
}
