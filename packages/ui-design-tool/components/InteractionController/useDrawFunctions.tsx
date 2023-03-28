import useResizeFunctions from './useResizeFunctions';

export default function useDrawFunctions() {
  /** @todo useResizeFunctions와 모든 로직을 공유해도 되는지 확인 */
  const { resizeStart: drawStart, resizeEnd: drawEnd, resizeInProgress: drawInProgress } = useResizeFunctions();
  return { drawStart, drawEnd, drawInProgress };
}
