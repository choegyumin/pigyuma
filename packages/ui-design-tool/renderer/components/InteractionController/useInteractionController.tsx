import { Artboard } from '@/models/Artboard/model';
import { Canvas } from '@/models/Canvas/model';
import useBrowserStatus from '@/renderer/hooks/useBrowserStatus';
import useHovered from '@/renderer/hooks/useHovered';
import useItemReference from '@/renderer/hooks/useItemReference';
import useMode from '@/renderer/hooks/useMode';
import useSelected from '@/renderer/hooks/useSelected';
import useUISelector from '@/renderer/hooks/useUISelector';
import { UIRecordRect } from '@/types/Geometry';
import {
  UIInteractionElementDataAttributeName,
  UIInteractionElementDataset,
  UIDesignToolElementDataAttributeName,
  InteractionHandleType,
  HandlePlacement,
  UIRecordKey,
  DrawingType,
} from '@/types/Identifier';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { isUIRecordKey, UIRecordWithParent } from '@/utils/model';
import { getStatus } from '@/utils/status';
import { useEvent } from '@pigyuma/react-utils';
import { findLinked } from '@pigyuma/utils';
import { useCallback } from 'react';
import { InteractionActionType, InteractionTarget } from './types';
import useInteractionDispatcher from './useInteractionDispatcher';

export default function useInteractionController() {
  const getBrowserStatus = useBrowserStatus();

  const getItemReference = useItemReference();

  const mode = useMode();
  const hoveredRecordKey = useHovered();
  const selectedRecordKeys = useSelected();

  const uiSelector = useUISelector();

  const dispatch = useInteractionDispatcher();

  const getInteractionTargets = useCallback(
    (recordKeys: UIRecordKey[]): InteractionTarget[] => {
      const targets: InteractionTarget[] = [];
      const missingRecordKeys: UIRecordKey[] = [];
      const missingElementKeys: UIRecordKey[] = [];

      recordKeys.forEach((key) => {
        const record = getItemReference(key);
        const element = uiSelector.query({ key });
        if (record == null) {
          missingRecordKeys.push(key);
        } else if (element == null) {
          missingElementKeys.push(key);
        } else {
          const rect = UIRecordRect.fromElement(element);
          targets.push({ record, rect });
        }
      });

      if (missingRecordKeys.length > 0) {
        console.warn(`UIRecord '${missingRecordKeys.join("', '")}' not found.`);
      }
      if (missingElementKeys.length > 0) {
        console.error(`Element with recordKey of '${missingElementKeys.join("', '")}' not found.`);
      }

      return targets;
    },
    [uiSelector, getItemReference],
  );

  const getInteractionTarget = useCallback(
    (recordKey: UIRecordKey): InteractionTarget | undefined => {
      const [target] = getInteractionTargets([recordKey]);
      return target;
    },
    [getInteractionTargets],
  );

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const { mouse, keyboard } = getBrowserStatus();

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);
    const handleType = handle?.dataset[UIInteractionElementDataset.handleType] as InteractionHandleType | undefined;
    const handlePlacement = handle?.dataset[UIInteractionElementDataset.handlePlacement] as HandlePlacement | undefined;

    const interactionType: UIDesignToolInteractionType = (() => {
      if (mode === UIDesignToolMode.select) {
        return handleType != null ? UIDesignToolInteractionType.transform : UIDesignToolInteractionType.selection;
      }
      if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape) {
        return UIDesignToolInteractionType.drawing;
      }
      if (mode === UIDesignToolMode.text) {
        return UIDesignToolInteractionType.input;
      }
      return UIDesignToolInteractionType.idle;
    })();

    const transformMethod: UIDesignToolTransformMethod = (() => {
      if (handleType == null) {
        return UIDesignToolTransformMethod.unable;
      }
      if (handleType === InteractionHandleType.select) {
        return UIDesignToolTransformMethod.move;
      }
      return handleType;
    })();

    const actionStatus: UIDesignToolStatus = getStatus({ interactionType, transformMethod });

    switch (actionStatus) {
      case UIDesignToolStatus.selection: {
        dispatch({ type: InteractionActionType.ACTIVATE, status: actionStatus, payload: { mouse, keyboard } });
        break;
      }

      case UIDesignToolStatus.moving: {
        if (!isUIRecordKey(hoveredRecordKey)) {
          console.error('hovered UIRecord element not found.');
          break;
        }

        /** @todo 다중 선택 기능 구현 후 조건 추가 */
        const targets = getInteractionTargets([hoveredRecordKey]);
        dispatch({ type: InteractionActionType.ACTIVATE, status: actionStatus, payload: { mouse, keyboard, details: { targets } } });
        break;
      }

      case UIDesignToolStatus.resizing: {
        if (handlePlacement == null) {
          console.error('handle placement type is unknown.');
          break;
        }

        const targets = getInteractionTargets([...selectedRecordKeys]);
        dispatch({
          type: InteractionActionType.ACTIVATE,
          status: actionStatus,
          payload: { mouse, keyboard, details: { targets, handlePlacement } },
        });
        break;
      }

      case UIDesignToolStatus.rotating: {
        const targets = getInteractionTargets([...selectedRecordKeys]);
        dispatch({
          type: InteractionActionType.ACTIVATE,
          status: actionStatus,
          payload: { mouse, keyboard, details: { targets } },
        });
        break;
      }

      case UIDesignToolStatus.drawing: {
        const handleRecord = isUIRecordKey(hoveredRecordKey) ? getItemReference<UIRecordWithParent>(hoveredRecordKey) : undefined;

        const drawingType = mode === UIDesignToolMode.artboard ? DrawingType.artboard : DrawingType.shapeLayer;
        const drawingArtboard = drawingType === DrawingType.artboard;

        const predicateFindParentRecord = drawingArtboard
          ? (parent: UIRecordWithParent | Canvas) => parent instanceof Canvas
          : (parent: UIRecordWithParent | Canvas | Artboard) => parent instanceof Canvas || parent instanceof Artboard;
        const parentRecord = (() => {
          const found =
            handleRecord != null
              ? findLinked<UIRecordWithParent, Canvas | Artboard>(handleRecord, 'parent', predicateFindParentRecord, { self: true })
              : undefined;
          return found ?? (getItemReference(Canvas.key) as Canvas);
        })();

        const target = getInteractionTarget(parentRecord.key);
        dispatch({
          type: InteractionActionType.ACTIVATE,
          status: actionStatus,
          payload: { mouse, keyboard, details: { target, drawingType } },
        });
        break;
      }

      /** @todo TextLayer 추가 및 수정 기능 구현 */
      case UIDesignToolStatus.input: {
        // dispatch({ type: InteractionActionType.ACTIVATE, status: actionStatus, payload: { mouse, keyboard, details: { target } } });
        break;
      }
    }
  });

  const onDocumentMouseMove = useEvent(() => {
    const { mouse, keyboard } = getBrowserStatus();
    dispatch({ type: InteractionActionType.TRIGGER, payload: { mouse, keyboard } });
  });

  const onDocumentMouseUp = useEvent(() => {
    const { mouse, keyboard } = getBrowserStatus();
    dispatch({ type: InteractionActionType.DEACTIVATE, payload: { mouse, keyboard } });
  });

  return { onDocumentMouseDown, onDocumentMouseMove, onDocumentMouseUp };
}
