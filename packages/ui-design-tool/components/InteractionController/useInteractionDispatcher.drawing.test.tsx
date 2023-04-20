import { makeDummyKeyboardStatus, makeDummyMouseStatus } from '@/api/__mocks__/ElementSelector';
import { Artboard } from '@/api/Artboard/model';
import { ShapeLayer } from '@/api/ShapeLayer/model';
import { UIDesignTool } from '@/api/UIDesignTool';
import { makeUIRecordRectFromCanvas } from '@/types/__mocks__/Geometry';
import { DrawingType } from '@/types/Identifier';
import { UIDesignToolStatus } from '@/types/Status';
import { act, renderHook } from '@testing-library/react';
import { UIDesignToolProvider } from '../UIDesignToolProvider/UIDesignToolProvider';
import { useUIData } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { InteractionActionType, InteractionTarget } from './types';
import useInteractionDispatcher from './useInteractionDispatcher';

describe('useInteractionDispatcher - drawing', () => {
  let uiDesignTool: UIDesignTool;
  let wrapper: React.FunctionComponent;
  let dispatch: ReturnType<typeof useInteractionDispatcher>;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool({ strict: false });
    wrapper = ({ children }: React.PropsWithChildren) => <UIDesignToolProvider api={uiDesignTool}>{children}</UIDesignToolProvider>;

    const { result: dispatcherResult } = renderHook(() => useInteractionDispatcher(), { wrapper });
    dispatch = dispatcherResult.current;
  });

  test('should draw Artboard when mouse is moved', () => {
    // 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenActivated = { x: 25, y: 25 };
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const expectedArtboardCoord = mouseCoordWhenActivated;
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const { result } = renderHook(() => useUIData(), { wrapper });

    const target: InteractionTarget = {
      record: result.current.tree,
      rect: makeUIRecordRectFromCanvas(),
    };

    act(() => {
      dispatch({
        type: InteractionActionType.ACTIVATE,
        status: UIDesignToolStatus.drawing,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenActivated),
          keyboard: makeDummyKeyboardStatus(),
          details: { target, drawingType: DrawingType.artboard },
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

    const artboard = result.current.tree.children[0] as Artboard;

    expect(artboard).toBeInstanceOf(Artboard);
    expect(artboard.x).toBe(expectedArtboardCoord.x);
    expect(artboard.y).toBe(expectedArtboardCoord.y);
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should draw ShapeLayer when mouse is moved', () => {
    // 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenActivated = { x: 25, y: 25 };
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const expectedShapeLayerCoord = mouseCoordWhenActivated;
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

    const { result } = renderHook(() => useUIData(), { wrapper });

    const target: InteractionTarget = {
      record: result.current.tree,
      rect: makeUIRecordRectFromCanvas(),
    };

    act(() => {
      dispatch({
        type: InteractionActionType.ACTIVATE,
        status: UIDesignToolStatus.drawing,
        payload: {
          mouse: makeDummyMouseStatus(mouseCoordWhenActivated),
          keyboard: makeDummyKeyboardStatus(),
          details: { target, drawingType: DrawingType.shapeLayer },
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

    const shapeLayer = result.current.tree.children[0] as ShapeLayer;

    expect(shapeLayer).toBeInstanceOf(ShapeLayer);
    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });
});
