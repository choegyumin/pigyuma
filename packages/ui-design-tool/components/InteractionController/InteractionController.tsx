import { Artboard, ArtboardArgs } from '@/api/Artboard/model';
import { Canvas } from '@/api/Canvas/model';
import { Layer } from '@/api/Layer/model';
import { ShapeLayer, ShapeLayerArgs, ShapeType } from '@/api/ShapeLayer/model';
import { TextLayer, TextLayerArgs } from '@/api/TextLayer/model';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolMode } from '@/api/UIDesignTool';
import useDispatcher from '@/hooks/useDispatcher';
import useHovered from '@/hooks/useHovered';
import useItemReference from '@/hooks/useItemReference';
import useMode from '@/hooks/useMode';
import useSelected from '@/hooks/useSelected';
import useStatusMeta from '@/hooks/useStatusMeta';
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
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React, { useCallback, useMemo } from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { HoveringOverlay } from '../HoveringOverlay/HoveringOverlay';
import { PointerEventsController } from '../PointerEventsController/PointerEventsController';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { useBrowserMeta } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { StatusAction } from '../UIDesignToolProvider/useContextValues';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';
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
  const statusMeta = useStatusMeta();
  const hoveredRecordKey = useHovered();
  const selectedRecordKeys = useSelected();

  const getItemReference = useItemReference();

  const { setHovered, setStatus } = useDispatcher();

  const { startMove, move, endMove } = useMoveFunctions();
  const { startResize, resize, endResize } = useResizeFunctions();
  const { startRotate, rotate, endRotate } = useRotateFunctions();

  const interactionQueue = useMemo<
    Array<{
      event: MouseEvent;
      target?: UIRecordKey;
      action: StatusAction;
      flush?: () => void;
      calibrate?: number;
    }>
  >(() => [], []);

  const startInteraction = useCallback(
    (event: MouseEvent, action: StatusAction, target?: UIRecordKey) => {
      if (action.interactionType === UIDesignToolInteractionType.selection) {
        // startSelection();
      } else if (action.interactionType === UIDesignToolInteractionType.drawing) {
        if (target == null) {
          return console.error('event target is null or undefined. drawing interaction should have event target.');
        }
        if (mode === UIDesignToolMode.artboard || mode === UIDesignToolMode.shape) {
          /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링), 기능만 재사용할 뿐 보여지는 UI는 달라야 함 */
          startResize(target, HandlePlacement.bottomRight);
        }
      } else if (action.interactionType === UIDesignToolInteractionType.transform) {
        if (target == null) {
          return console.error('event target is null or undefined. transform interaction should have event target.');
        }
        if (action.transformMethod === UIDesignToolTransformMethod.move) {
          startMove(target);
        } else if (action.transformMethod === UIDesignToolTransformMethod.resize) {
          const handlePlacement = (event.target as HTMLElement | null)?.dataset[UIInteractionElementDataset.handlePlacement] as
            | HandlePlacement
            | undefined;
          if (handlePlacement == null) {
            return console.error(`event target has no ${UIInteractionElementDataAttributeName.handlePlacement} attribute.`);
          }
          startResize(target, handlePlacement);
        } else if (action.transformMethod === UIDesignToolTransformMethod.rotate) {
          startRotate(target);
        }
      }
    },
    [mode, startMove, startResize, startRotate],
  );

  const endInteraction = useCallback(
    (event: MouseEvent, action: StatusAction) => {
      if (action.interactionType === UIDesignToolInteractionType.selection) {
        // endSelection();
      } else if (action.interactionType === UIDesignToolInteractionType.drawing) {
        /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링) */
        endResize();
      } else if (action.interactionType === UIDesignToolInteractionType.transform) {
        if (action.transformMethod === UIDesignToolTransformMethod.move) {
          endMove();
        } else if (action.transformMethod === UIDesignToolTransformMethod.resize) {
          endResize();
        } else if (action.transformMethod === UIDesignToolTransformMethod.rotate) {
          endRotate();
        }
      }
    },
    [endMove, endResize, endRotate],
  );

  const progressInteraction = useCallback(
    (event: MouseEvent, action: StatusAction) => {
      if (action.interactionType === UIDesignToolInteractionType.idle) {
        const target = uiSelector.fromMouse();
        const recordKey = target != null ? uiSelector.dataset(target).key : undefined;
        const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
        const isSelectableRecord = record instanceof Artboard || record instanceof Layer;
        setHovered(isSelectableRecord ? record.key : undefined);
      } else if (action.interactionType === UIDesignToolInteractionType.selection) {
        // selection();
      } else if (action.interactionType === UIDesignToolInteractionType.drawing) {
        /** @todo useDrawFunctions 구현 시 resize 로직 추상화(리팩토링) */
        resize();
      } else if (action.interactionType === UIDesignToolInteractionType.transform) {
        if (action.transformMethod === UIDesignToolTransformMethod.move) {
          move();
        } else if (action.transformMethod === UIDesignToolTransformMethod.resize) {
          resize();
        } else if (action.transformMethod === UIDesignToolTransformMethod.rotate) {
          rotate();
        }
      }
    },
    [move, resize, rotate, uiSelector, getItemReference, setHovered],
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

    switch (interactionType) {
      case UIDesignToolInteractionType.selection: {
        uiController.select([]);

        const action = { interactionType };
        interactionQueue.push({ event, action, calibrate: 5 });

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

        const action = { interactionType };
        const flush = () => {
          uiController.remove(record.key);
        };
        interactionQueue.push({ event, target: record.key, action, flush, calibrate: 5 });

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

        const action = { interactionType, transformMethod };
        interactionQueue.push({ event, target: recordKeys[0], action, calibrate: 5 });

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
    setStatus({ interactionType: UIDesignToolInteractionType.idle });
    endInteraction(event, statusMeta);
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

      setStatus(interactionItem.action);
      return startInteraction(interactionItem.event, interactionItem.action, interactionItem.target);
    }

    progressInteraction(event, statusMeta);
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
