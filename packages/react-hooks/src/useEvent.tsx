import useStableCallback from './useStableCallback';

/**
 * useEvent
 * @see {@link https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md}
 */
export default function useEvent<T extends (...args: any[]) => void>(callback: T): T {
  return useStableCallback(callback);
}
