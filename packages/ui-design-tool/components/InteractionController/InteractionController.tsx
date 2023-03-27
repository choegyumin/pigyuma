import { Artboard, ArtboardArgs } from '@/api/Artboard/model';
import { Canvas } from '@/api/Canvas/model';
import { ShapeLayer, ShapeLayerArgs, ShapeType } from '@/api/ShapeLayer/model';
import { TextLayer, TextLayerArgs } from '@/api/TextLayer/model';
import useDispatcher from '@/hooks/useDispatcher';
import useHovered from '@/hooks/useHovered';
import useItemReference from '@/hooks/useItemReference';
import useMode from '@/hooks/useMode';
import useSelected from '@/hooks/useSelected';
import useStatus from '@/hooks/useStatus';
import useUIController from '@/hooks/useUIController';
import useUISelector from '@/hooks/useUISelector';
import {
  UIInteractionElementDataAttributeName,
  UIInteractionElementDataset,
  UIDesignToolElementDataAttributeName,
  UIRecordKey,
  InteractionHandleType,
  HandlePlacement,
  UIRecordType,
} from '@/types/Identifier';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolMode, UIDesignToolStatus } from '@/types/Status';
import {
  FontSizeLengthType,
  HeightLengthType,
  LetterSpacingLengthType,
  LineHeightLengthType,
  WidthLengthType,
  XLengthType,
  YLengthType,
} from '@/types/Unit';
import { isUIRecordKey } from '@/utils/model';
import { getStatus } from '@/utils/status';
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React, { useCallback, useMemo } from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { HoveringOverlay } from '../HoveringOverlay/HoveringOverlay';
import { PointerEventsController } from '../PointerEventsController/PointerEventsController';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { useBrowserMeta } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';
import useHoverFunctions from './useHoverFunctions';
import useMoveFunctions from './useMoveFunctions';
import useResizeFunctions from './useResizeFunctions';
import useRotateFunctions from './useRotateFunctions';

const makeDefaultArtboardArgs = (name: string, x: number, y: number): ArtboardArgs => ({
  name,
  x,
  y,
  width: 1,
  height: 1,
  fill: '#ffffff',
  children: [],
});

const makeDefaultShapeLayerArgs = (name: string, x: number, y: number): ShapeLayerArgs => ({
  name,
  x: { length: x, lengthType: XLengthType.px },
  y: { length: y, lengthType: YLengthType.px },
  shapeType: ShapeType.container,
  width: { length: 1, lengthType: WidthLengthType.px },
  height: { length: 1, lengthType: HeightLengthType.px },
  rotate: { degrees: 0 },
  stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
  fill: { color: '#aaaaaa' },
  children: [],
});

const makeDefaultTextLayerArgs = (name: string, x: number, y: number): TextLayerArgs => ({
  name,
  x: { length: x, lengthType: XLengthType.px },
  y: { length: y, lengthType: YLengthType.px },
  rotate: { degrees: 0 },
  width: { length: 1, lengthType: WidthLengthType.flexible },
  height: { length: 1, lengthType: HeightLengthType.flexible },
  textColor: { color: '#000000' },
  fontSize: { length: 16, lengthType: FontSizeLengthType.px },
  lineHeight: { length: 150, lengthType: LineHeightLengthType.percent },
  fontWeight: { value: 400 },
  letterSpacing: { length: 0, lengthType: LetterSpacingLengthType.px },
  content: '',
});

/**
 * @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성
 * @todo 조건문 정리
 */
export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  const uiController = useUIController();
  const uiSelector = useUISelector();

  const getBrowserMeta = useBrowserMeta();

  const mode = useMode();
  const currentStatus = useStatus();
  const hoveredRecordKey = useHovered();
  const selectedRecordKeys = useSelected();

  const getItemReference = useItemReference();

  const { setStatus } = useDispatcher();

  const { hover } = useHoverFunctions();
  const { startMove, move, endMove } = useMoveFunctions();
  const { startResize, resize, endResize } = useResizeFunctions();
  const { startRotate, rotate, endRotate } = useRotateFunctions();

  const interactionQueue = useMemo<
    Array<{
      event: MouseEvent;
      target?: UIRecordKey;
      status: UIDesignToolStatus;
      flush?: () => void;
      calibrate?: number;
    }>
  >(() => [], []);

  const startInteraction = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus, target?: UIRecordKey) => {
      switch (status) {
        case UIDesignToolStatus.selection: {
          return; // startSelect()
        }
        case UIDesignToolStatus.drawing: {
          if (target == null) {
            return console.error('event target is null or undefined. drawing interaction should have event target.');
          }
          if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape) {
            /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링), 기능만 재사용할 뿐 보여지는 UI는 달라야 함 */
            return startResize(target, HandlePlacement.bottomRight);
          }
          if (mode === UIDesignToolMode.text) {
            return; // startText()
          }
          return console.error('not in drawing mode. drawing interaction is possible only in drawing mode.');
        }
        case UIDesignToolStatus.moving: {
          if (target == null) {
            return console.error('event target is null or undefined. moving interaction should have event target.');
          }
          return startMove(target);
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
          return startResize(target, handlePlacement);
        }
        case UIDesignToolStatus.rotating: {
          if (target == null) {
            return console.error('event target is null or undefined. rotating interaction should have event target.');
          }
          return startRotate(target);
        }
      }
    },
    [mode, startMove, startResize, startRotate],
  );

  const endInteraction = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus) => {
      switch (status) {
        case UIDesignToolStatus.selection:
          return; // endSelect()
        case UIDesignToolStatus.drawing:
          /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링) */
          return endResize();
        case UIDesignToolStatus.moving:
          return endMove();
        case UIDesignToolStatus.resizing:
          return endResize();
        case UIDesignToolStatus.rotating:
          return endRotate();
      }
    },
    [endMove, endResize, endRotate],
  );

  const progressInteraction = useCallback(
    (event: MouseEvent, status: UIDesignToolStatus) => {
      switch (status) {
        case UIDesignToolStatus.idle:
          return hover();
        case UIDesignToolStatus.selection:
          return; // select()
        case UIDesignToolStatus.drawing:
          /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링) */
          return resize();
        case UIDesignToolStatus.moving:
          return move();
        case UIDesignToolStatus.resizing:
          return resize();
        case UIDesignToolStatus.rotating:
          return rotate();
      }
    },
    [hover, move, resize, rotate],
  );

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolElementDataAttributeName.id}]`))) {
      return;
    }

    const {
      mouse: { offsetX, offsetY },
    } = getBrowserMeta();

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);
    const handleType = handle?.dataset[UIInteractionElementDataset.handleType] as InteractionHandleType | undefined;

    const interactionType: UIDesignToolInteractionType = (() => {
      if (mode === UIDesignToolMode.select) {
        return handleType != null ? UIDesignToolInteractionType.transform : UIDesignToolInteractionType.selection;
      }
      if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape || mode === UIDesignToolMode.text) {
        return UIDesignToolInteractionType.drawing;
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

    const nextStatus: UIDesignToolStatus = getStatus({ interactionType, transformMethod });

    switch (interactionType) {
      case UIDesignToolInteractionType.selection: {
        uiController.select([]);

        interactionQueue.push({ event, status: nextStatus, calibrate: 5 });

        break;
      }

      case UIDesignToolInteractionType.drawing: {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const isDrawingArtboard = mode === UIDesignToolMode.artboard;
        const isDrawingShape = mode === UIDesignToolMode.shape;

        const parentElement: HTMLElement = (() => {
          const canvas = uiSelector.query({ key: Canvas.key })!;
          if (isDrawingArtboard) {
            return canvas;
          }
          return (
            uiSelector.closest(
              { type: UIRecordType.artboard },
              isUIRecordKey(hoveredRecordKey) ? uiSelector.query({ key: hoveredRecordKey }) : null,
            ) ?? canvas
          );
        })();
        const parentRecordKey = uiSelector.dataset(parentElement).key ?? Canvas.key;
        const parentRecord = getItemReference<Canvas | Artboard>(parentRecordKey)!;
        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        const xLength = offsetX - ((parentRecord as Artboard).x ?? 0);
        const yLength = offsetY - ((parentRecord as Artboard).y ?? 0);

        const record = (() => {
          if (isDrawingArtboard) {
            return new Artboard(makeDefaultArtboardArgs('New artboard', xLength, yLength));
          }
          if (isDrawingShape) {
            return new ShapeLayer(makeDefaultShapeLayerArgs('New shape', xLength, yLength));
          }
          /** @todo TextLayer 추가 기능 구현 */
          // eslint-disable-next-line no-constant-condition
          if (false /* mode === UIDesignToolMode.text */) {
            return new TextLayer(makeDefaultTextLayerArgs('New text', xLength, yLength));
          }
        })();

        if (record == null) {
          uiController.select([]);
          break;
        }

        /** @todo useDrawFunctions 구현 시 append, select는 endInteraction에 실행 */
        uiController.append(parentRecordKey, record);
        uiController.select([record.key]);

        const flush = () => {
          uiController.remove(record.key);
        };
        interactionQueue.push({ event, target: record.key, status: nextStatus, flush, calibrate: 5 });

        break;
      }

      case UIDesignToolInteractionType.transform: {
        const transformMethod: Exclude<UIDesignToolTransformMethod, 'unable'> =
          handleType == null || handleType === InteractionHandleType.select ? UIDesignToolTransformMethod.move : handleType;

        const recordKeys: UIRecordKey[] =
          transformMethod === UIDesignToolTransformMethod.move
            ? isUIRecordKey(hoveredRecordKey)
              ? [hoveredRecordKey]
              : []
            : [...selectedRecordKeys];

        if (transformMethod === UIDesignToolTransformMethod.move) {
          /** @todo 다중 선택 기능 구현 후 조건 추가  */
          uiController.select(recordKeys);
        }

        interactionQueue.push({ event, target: recordKeys[0], status: nextStatus, calibrate: 5 });

        break;
      }

      default: {
        uiController.select([]);

        break;
      }
    }
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    interactionQueue.forEach((it) => it.flush?.());
    interactionQueue.length = 0;
    setStatus(UIDesignToolStatus.idle);
    endInteraction(event, currentStatus);
  });

  const onDocumentMouseMove = useEvent((event: MouseEvent) => {
    const interactionItem = interactionQueue.shift();

    if (interactionItem != null) {
      const movementRange =
        Math.abs(interactionItem.event.clientX - event.clientX) + Math.abs(interactionItem.event.clientY - event.clientY);

      // 마우스가 `calibrate` 이상 움직이지 않은 경우 인터랙션을 시작하지 않음 (사용자가 단순히 무언가를 클릭할 때 마우스가 밀리는 것을 보정)
      if (movementRange < (interactionItem.calibrate ?? 0)) {
        return interactionQueue.unshift(interactionItem);
      }

      setStatus(interactionItem.status);
      return startInteraction(interactionItem.event, interactionItem.status, interactionItem.target);
    }

    progressInteraction(event, currentStatus);
  });

  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mouseup', onDocumentMouseUp);
  useEventListener(document, 'mousemove', onDocumentMouseMove);

  return (
    <div className={styles.root}>
      <AxisGrid />
      <HoveringOverlay />
      <SelectionOverlay />
      <PointerEventsController />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
