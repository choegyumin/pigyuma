import { UIDesignToolStatus } from '@/types/Status';
import { useCallback } from 'react';
import useDrawFunctions from './interactions/useDrawFunctions';
import useMoveFunctions from './interactions/useMoveFunctions';
import useResizeFunctions from './interactions/useResizeFunctions';
import useRotateFunctions from './interactions/useRotateFunctions';
import { InteractionPing, InteractionTask } from './types';

export default function useInteractFunctions() {
  const { movePrepare, moveStart, moveExecute, moveEnd } = useMoveFunctions();
  const { resizePrepare, resizeStart, resizeExecute, resizeEnd } = useResizeFunctions();
  const { rotatePrepare, rotateStart, rotateExecute, rotateEnd } = useRotateFunctions();
  const { drawPrepare, drawStart, drawExecute, drawEnd } = useDrawFunctions();

  const interactPrepare = useCallback(
    (task: InteractionTask) => {
      switch (task.status) {
        case UIDesignToolStatus.selection:
          return; // selectPrepare(task.payload)
        case UIDesignToolStatus.moving:
          return movePrepare(task.payload);
        case UIDesignToolStatus.resizing:
          return resizePrepare(task.payload);
        case UIDesignToolStatus.rotating:
          return rotatePrepare(task.payload);
        case UIDesignToolStatus.drawing:
          return drawPrepare(task.payload);
        case UIDesignToolStatus.input:
          return; // inputPrepare(task.payload)
      }
    },
    [movePrepare, resizePrepare, rotatePrepare, drawPrepare],
  );

  const interactStart = useCallback(
    (ping: InteractionPing) => {
      switch (ping.status) {
        case UIDesignToolStatus.selection:
          return; // selectStart(ping.payload)
        case UIDesignToolStatus.moving:
          return moveStart(ping.payload);
        case UIDesignToolStatus.resizing:
          return resizeStart(ping.payload);
        case UIDesignToolStatus.rotating:
          return rotateStart(ping.payload);
        case UIDesignToolStatus.drawing:
          return drawStart(ping.payload);
        case UIDesignToolStatus.input:
          return; // inputStart(ping.payload)
      }
    },
    [moveStart, resizeStart, rotateStart, drawStart],
  );

  const interactExecute = useCallback(
    (ping: InteractionPing) => {
      switch (ping.status) {
        case UIDesignToolStatus.selection:
          return; // selectExecute(ping.payload)
        case UIDesignToolStatus.moving:
          return moveExecute(ping.payload);
        case UIDesignToolStatus.resizing:
          return resizeExecute(ping.payload);
        case UIDesignToolStatus.rotating:
          return rotateExecute(ping.payload);
        case UIDesignToolStatus.drawing:
          return drawExecute(ping.payload);
        case UIDesignToolStatus.input:
          return; // inputExecute(ping.payload)
      }
    },
    [moveExecute, resizeExecute, rotateExecute, drawExecute],
  );

  const interactEnd = useCallback(
    (ping: InteractionPing) => {
      switch (ping.status) {
        case UIDesignToolStatus.selection:
          return; // selectEnd(ping.payload)
        case UIDesignToolStatus.moving:
          return moveEnd(ping.payload);
        case UIDesignToolStatus.resizing:
          return resizeEnd(ping.payload);
        case UIDesignToolStatus.rotating:
          return rotateEnd(ping.payload);
        case UIDesignToolStatus.drawing:
          return drawEnd(ping.payload);
        case UIDesignToolStatus.input:
          return; // inputEnd(ping.payload)
      }
    },
    [moveEnd, resizeEnd, rotateEnd, drawEnd],
  );

  return { interactPrepare, interactStart, interactExecute, interactEnd };
}
