import { makeDummyKeyboardStatus, makeDummyMouseStatus } from '@/api/__mocks__/DOMSelector';
import { makeDummyShapeLayerJSON } from '@/api/ShapeLayer/__mocks__/model';
import { ShapeLayer } from '@/api/ShapeLayer/model';
import { UIDesignTool } from '@/api/UIDesignTool';
import { makeUIRecordRectFromShapeLayer } from '@/types/__mocks__/Geometry';
import { UIDesignToolStatus } from '@/types/Status';
import { act, renderHook } from '@testing-library/react';
import { UIDesignToolProvider } from '../UIDesignToolProvider/UIDesignToolProvider';
import { useUIController } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { InteractionActionType, InteractionTarget } from './types';
import useInteractionDispatcher from './useInteractionDispatcher';

describe('useInteractionDispatcher - rotating', () => {
  let uiDesignTool: UIDesignTool;
  let wrapper: React.FunctionComponent;
  let dispatch: ReturnType<typeof useInteractionDispatcher>;
  let reset: ReturnType<typeof useUIController>['reset'];

  beforeEach(() => {
    uiDesignTool = new UIDesignTool({ strict: false });
    wrapper = ({ children }: React.PropsWithChildren) => <UIDesignToolProvider api={uiDesignTool}>{children}</UIDesignToolProvider>;

    const { result: dispatcherResult } = renderHook(() => useInteractionDispatcher(), { wrapper });
    dispatch = dispatcherResult.current;

    const { result: uiControllerResult } = renderHook(() => useUIController(), { wrapper });
    reset = uiControllerResult.current.reset;
  });

  test('should rotate ShapeLayer when mouse is moved', () => {
    const initialShapeLayerCoord = { x: 25, y: 25 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    const expectedShapeLayerRotate = 45;

    // 마우스를 (25, 25)에서 (0, 75)으로 이동시킨다.
    const mouseCoordWhenActivated = { x: 25, y: 25 };
    const mouseCoordWhenLastTriggered = { x: 0, y: 75 };

    const shapeLayer = new ShapeLayer(
      makeDummyShapeLayerJSON({
        x: { length: initialShapeLayerCoord.x, lengthType: 'px' },
        y: { length: initialShapeLayerCoord.y, lengthType: 'px' },
        width: { length: initialShapeLayerSize.width, lengthType: 'px' },
        height: { length: initialShapeLayerSize.height, lengthType: 'px' },
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
        status: UIDesignToolStatus.rotating,
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

    expect(shapeLayer.rotate.degrees).toBe(expectedShapeLayerRotate);
  });
});
