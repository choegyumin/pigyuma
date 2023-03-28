import { HandlePlacement, UIInteractionElementDataAttributeName, UIInteractionElementDataset, UIRecordKey } from '@/types/Identifier';
import { UIDesignToolStatus } from '@/types/Status';
import { useCallback } from 'react';
import useDrawFunctions from './useDrawFunctions';
import useHoverFunctions from './useHoverFunctions';
import useMoveFunctions from './useMoveFunctions';
import useResizeFunctions from './useResizeFunctions';
import useRotateFunctions from './useRotateFunctions';

export default function useInteraction() {
  const { hover } = useHoverFunctions();
  const { drawStart, drawInProgress, drawEnd } = useDrawFunctions();
  const { moveStart, moveInProgress, moveEnd } = useMoveFunctions();
  const { resizeStart, resizeInProgress, resizeEnd } = useResizeFunctions();
  const { rotateStart, rotateInProgress, rotateEnd } = useRotateFunctions();

  const interactStart = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus, target?: UIRecordKey) => {
      switch (status) {
        case UIDesignToolStatus.selection: {
          return; // selectStart()
        }
        case UIDesignToolStatus.drawing: {
          if (target == null) {
            return console.error('event target is null or undefined. drawing interaction should have event target.');
          }
          return drawStart(target, HandlePlacement.bottomRight);
        }
        case UIDesignToolStatus.input: {
          return; // inputStart(target)
        }
        case UIDesignToolStatus.moving: {
          if (target == null) {
            return console.error('event target is null or undefined. moving interaction should have event target.');
          }
          return moveStart(target);
        }
        case UIDesignToolStatus.resizing: {
          if (target == null) {
            return console.error('event target is null or undefined. resizing interaction should have event target.');
          }
          const handlePlacement = (event.target as HTMLElement | null)?.dataset[UIInteractionElementDataset.handlePlacement] as
            | HandlePlacement
            | undefined;
          if (handlePlacement == null) {
            return console.error(`event target has no ${UIInteractionElementDataAttributeName.handlePlacement} attribute.`);
          }
          return resizeStart(target, handlePlacement);
        }
        case UIDesignToolStatus.rotating: {
          if (target == null) {
            return console.error('event target is null or undefined. rotating interaction should have event target.');
          }
          return rotateStart(target);
        }
      }
    },
    [drawStart, moveStart, resizeStart, rotateStart],
  );

  const interactEnd = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus) => {
      switch (status) {
        case UIDesignToolStatus.selection:
          return; // selectEnd()
        case UIDesignToolStatus.drawing:
          return drawEnd();
        case UIDesignToolStatus.moving:
          return moveEnd();
        case UIDesignToolStatus.resizing:
          return resizeEnd();
        case UIDesignToolStatus.rotating:
          return rotateEnd();
      }
    },
    [drawEnd, moveEnd, resizeEnd, rotateEnd],
  );

  const interactInProgress = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus) => {
      switch (status) {
        case UIDesignToolStatus.idle:
          return hover();
        case UIDesignToolStatus.selection:
          return; // selectInProgress()
        case UIDesignToolStatus.drawing:
          return drawInProgress();
        case UIDesignToolStatus.moving:
          return moveInProgress();
        case UIDesignToolStatus.resizing:
          return resizeInProgress();
        case UIDesignToolStatus.rotating:
          return rotateInProgress();
      }
    },
    [hover, drawInProgress, moveInProgress, resizeInProgress, rotateInProgress],
  );

  return { interactStart, interactInProgress, interactEnd };
}
