import { Artboard } from '@/models/Artboard/model';
import { Canvas } from '@/models/Canvas/model';
import { ShapeLayer } from '@/models/ShapeLayer/model';
import useUIController from '@/renderer/hooks/useUIController';
import { UIRecordRect } from '@/types/Geometry';
import { DrawingType } from '@/types/Identifier';
import { UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import { useStableCallback } from '@pigyuma/react-utils';
import { calcDistancePointFromPoint } from '@pigyuma/utils';
import {
  ActivateAction,
  DeactivateAction,
  DrawingPayload,
  InteractionAction,
  InteractionActionType,
  BaseInteractionPayload,
  MovingPayload,
  ResizingPayload,
  RotatingPayload,
  SelectionPayload,
  TriggerAction,
} from './types';
import useInteractionTaskManager from './useInteractionTaskManager';
import { makeDefaultArtboardArgs, makeDefaultShapeLayerArgs } from './utils/record';

export default function useInteractionDispatcher() {
  const uiController = useUIController();

  const [, pushTask, runTask, shiftTask] = useInteractionTaskManager();

  const activateHandler = (action: ActivateAction) => {
    const { status, payload } = action;

    switch (status) {
      case UIDesignToolStatus.selection: {
        uiController.select([]);

        const condition = (taskPayload: SelectionPayload, pingPayload: BaseInteractionPayload) =>
          calcDistancePointFromPoint(
            { x: pingPayload.mouse.offsetX, y: pingPayload.mouse.offsetY },
            { x: taskPayload.mouse.offsetX, y: taskPayload.mouse.offsetY },
          ) >= 5;
        return pushTask({ status, payload, condition });
      }

      case UIDesignToolStatus.moving:
      case UIDesignToolStatus.resizing:
      case UIDesignToolStatus.rotating: {
        const {
          details: { targets },
        } = payload;
        const targetKeys = targets.map(({ record }) => record.key);
        uiController.select(targetKeys);

        if (targetKeys.length === 0) {
          return;
        }

        const condition = (taskPayload: MovingPayload | ResizingPayload | RotatingPayload, pingPayload: BaseInteractionPayload) =>
          calcDistancePointFromPoint(
            { x: pingPayload.mouse.offsetX, y: pingPayload.mouse.offsetY },
            { x: taskPayload.mouse.offsetX, y: taskPayload.mouse.offsetY },
          ) >= 5;

        return pushTask({ status, payload, condition });
      }

      case UIDesignToolStatus.drawing: {
        const {
          mouse,
          details: { target, drawingType },
        } = payload;
        uiController.select([]);

        if (target == null) {
          return;
        }

        const parentRecord = target.record;

        const drawingArtboard = drawingType === DrawingType.artboard;
        const drawingShapeLayer = drawingType === DrawingType.shapeLayer;

        if (!drawingArtboard && !drawingShapeLayer) {
          console.error('Drawing is only supported for ShapeLayer and Artboard.');
          return;
        }
        if (drawingArtboard && !(parentRecord instanceof Canvas)) {
          console.error('Artboard can only be drawn on Canvas.');
          return;
        }
        if (drawingShapeLayer && !(parentRecord instanceof Canvas || parentRecord instanceof Artboard)) {
          console.error('ShapeLayer can only be drawn on Canvas or Artboard.');
          return;
        }

        const xLength = mouse.offsetX - ((parentRecord as Artboard).x ?? 0);
        const yLength = mouse.offsetY - ((parentRecord as Artboard).y ?? 0);
        const widthLength = 1;
        const heightLength = 1;

        const newRecord = drawingArtboard
          ? new Artboard(makeDefaultArtboardArgs('New artboard', xLength, yLength, widthLength, heightLength))
          : new ShapeLayer(makeDefaultShapeLayerArgs('New shape', xLength, yLength, widthLength, heightLength));
        const newRect = new UIRecordRect(mouse.offsetX, mouse.offsetY, widthLength, heightLength, 0);

        uiController.append(parentRecord.key, newRecord, { saveDraft: true });

        const newPayload: DrawingPayload = {
          ...payload,
          details: {
            ...payload.details,
            target: { record: newRecord, rect: newRect },
          },
        };

        const condition = (taskPayload: DrawingPayload, pingPayload: BaseInteractionPayload) =>
          calcDistancePointFromPoint(
            { x: pingPayload.mouse.offsetX, y: pingPayload.mouse.offsetY },
            { x: taskPayload.mouse.offsetX, y: taskPayload.mouse.offsetY },
          ) >= 5;
        const enter = () => {
          uiController.select([newRecord.key]);
        };
        const leave = () => {
          uiController.flushDrafts();
          uiController.toggleMode(UIDesignToolMode.select);
        };
        const clear = () => {
          uiController.remove(newRecord.key);
        };

        return pushTask({ status, payload: newPayload, condition, enter, leave, clear });
      }

      /** @todo TextLayer 추가 및 수정 기능 구현 */
      case UIDesignToolStatus.input: {
        // const record = new TextLayer(makeDefaultTextLayerArgs('New text', xLength, yLength));
        // uiController.append(parentRecordKey, record);
        // uiController.select([record.key]);
        // return pushTask();
      }
    }
  };

  const deactivateHandler = (action: DeactivateAction) => {
    const { payload } = action;
    return shiftTask({ payload });
  };

  const triggerHandler = (action: TriggerAction) => {
    const { payload } = action;
    return runTask({ payload });
  };

  const dispatch = useStableCallback((action: InteractionAction) => {
    if (action.type === InteractionActionType.ACTIVATE) {
      return activateHandler(action);
    }
    if (action.type === InteractionActionType.DEACTIVATE) {
      return deactivateHandler(action);
    }
    if (action.type === InteractionActionType.TRIGGER) {
      return triggerHandler(action);
    }
  });

  return dispatch;
}
