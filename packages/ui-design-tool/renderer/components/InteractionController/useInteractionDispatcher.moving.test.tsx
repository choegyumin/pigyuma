import { makeDummyKeyboardStatus, makeDummyMouseStatus } from '@/api/__mocks__/DOMSelector';
import { UIDesignTool } from '@/api/UIDesignTool';
import { makeDummyArtboardJSON } from '@/models/Artboard/__mocks__/model';
import { Artboard } from '@/models/Artboard/model';
import { makeDummyShapeLayerJSON } from '@/models/ShapeLayer/__mocks__/model';
import { ShapeLayer } from '@/models/ShapeLayer/model';
import { makeUIRecordRectFromArtboard, makeUIRecordRectFromShapeLayer } from '@/types/__mocks__/Geometry';
import { UIDesignToolStatus } from '@/types/Status';
import { act, renderHook } from '@testing-library/react';
import { UIDesignToolProvider } from '../UIDesignToolProvider/UIDesignToolProvider';
import { useUIController } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { InteractionActionType, InteractionTarget } from './types';
import useInteractionDispatcher from './useInteractionDispatcher';

describe('useInteractionDispatcher - moving', () => {
  let uiDesignTool: UIDesignTool;
  let wrapper: React.FunctionComponent;
  let dispatch: ReturnType<typeof useInteractionDispatcher>;
  let reset: ReturnType<typeof useUIController>['reset'];

  beforeEach(() => {
    uiDesignTool = new UIDesignTool({ strict: false });
    wrapper = ({ children }: React.PropsWithChildren) => <UIDesignToolProvider api={uiDesignTool}>{children}</UIDesignToolProvider>;

    const { result: dispatcherResult } = renderHook(() => useInteractionDispatcher({}), { wrapper });
    dispatch = dispatcherResult.current;

    const { result: uiControllerResult } = renderHook(() => useUIController(), { wrapper });
    reset = uiControllerResult.current.reset;
  });

  test('should move Artboard when mouse is moved', () => {
    // 마우스를 (10, 10)에서 (40, 30)으로 이동시킨다.
    const mouseCoordWhenActivated = { x: 10, y: 10 };
    const mouseCoordWhenLastTriggered = { x: 40, y: 30 };

    const initialArtboardCoord = { x: 0, y: 0 };

    const expectedArtboardCoord = {
      x: initialArtboardCoord.x + mouseCoordWhenLastTriggered.x - mouseCoordWhenActivated.x,
      y: initialArtboardCoord.y + mouseCoordWhenLastTriggered.y - mouseCoordWhenActivated.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON(initialArtboardCoord));

    act(() => {
      reset([artboard]);
    });

    const targets: InteractionTarget[] = [
      {
        record: artboard,
        rect: makeUIRecordRectFromArtboard(artboard),
      },
    ];

    act(() => {
      dispatch({
        type: InteractionActionType.ACTIVATE,
        status: UIDesignToolStatus.moving,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenActivated),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets },
        },
      });

      dispatch({
        type: InteractionActionType.TRIGGER,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenLastTriggered),
          keyboard: makeDummyKeyboardStatus(),
        },
      });

      dispatch({
        type: InteractionActionType.DEACTIVATE,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
        },
      });
    });

    expect(artboard.x).toBe(expectedArtboardCoord.x);
    expect(artboard.y).toBe(expectedArtboardCoord.y);
  });

  test('should move ShapeLayer when mouse is moved', () => {
    // 마우스를 (10, 10)에서 (40, 30)으로 이동시킨다.
    const mouseCoordWhenActivated = { x: 10, y: 10 };
    const mouseCoordWhenLastTriggered = { x: 40, y: 30 };

    const initialShapeLayerCoord = { x: 0, y: 0 };

    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x + mouseCoordWhenLastTriggered.x - mouseCoordWhenActivated.x,
      y: initialShapeLayerCoord.y + mouseCoordWhenLastTriggered.y - mouseCoordWhenActivated.y,
    };

    const shapeLayer = new ShapeLayer(
      makeDummyShapeLayerJSON({
        x: { length: initialShapeLayerCoord.x, lengthType: 'px' },
        y: { length: initialShapeLayerCoord.y, lengthType: 'px' },
      }),
    );

    act(() => {
      reset([shapeLayer]);
    });

    const targets: InteractionTarget[] = [
      {
        record: shapeLayer,
        rect: makeUIRecordRectFromShapeLayer(shapeLayer),
      },
    ];

    act(() => {
      dispatch({
        type: InteractionActionType.ACTIVATE,
        status: UIDesignToolStatus.moving,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenActivated),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets },
        },
      });

      dispatch({
        type: InteractionActionType.TRIGGER,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenLastTriggered),
          keyboard: makeDummyKeyboardStatus(),
        },
      });

      dispatch({
        type: InteractionActionType.DEACTIVATE,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
        },
      });
    });

    expect(shapeLayer.x).toEqual({ length: expectedShapeLayerCoord.x, lengthType: 'px' });
    expect(shapeLayer.y).toEqual({ length: expectedShapeLayerCoord.y, lengthType: 'px' });
  });
});
