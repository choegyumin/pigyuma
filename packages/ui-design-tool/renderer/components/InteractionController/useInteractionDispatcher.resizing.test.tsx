import { makeDummyKeyboardStatus, makeDummyMouseStatus } from '@/api/__mocks__/DOMSelector';
import { UIDesignTool } from '@/api/UIDesignTool';
import { makeDummyArtboardJSON } from '@/models/Artboard/__mocks__/model';
import { Artboard } from '@/models/Artboard/model';
import { makeDummyShapeLayerJSON } from '@/models/ShapeLayer/__mocks__/model';
import { ShapeLayer } from '@/models/ShapeLayer/model';
import { makeUIRecordRectFromArtboard, makeUIRecordRectFromShapeLayer } from '@/types/__mocks__/Geometry';
import { HandlePlacement } from '@/types/Identifier';
import { UIDesignToolStatus } from '@/types/Status';
import { act, renderHook } from '@testing-library/react';
import { UIDesignToolProvider } from '../UIDesignToolProvider/UIDesignToolProvider';
import { useUIController } from '../UIDesignToolProvider/UIDesignToolProvider.context';
import { InteractionActionType, InteractionTarget } from './types';
import useInteractionDispatcher from './useInteractionDispatcher';

describe('useInteractionDispatcher - resizing', () => {
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

  test('should resize Artboard when mouse is moved by grabbing top handle', () => {
    // 상단 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // Y만 flip 된다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x,
      y: initialArtboardCoord.y + initialArtboardSize.height,
    };
    // height만 변한다.
    const expectedArtboardSize = {
      width: initialArtboardSize.width,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.top },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing right handle', () => {
    // 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x,
      y: initialArtboardCoord.y,
    };
    // width만 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: initialArtboardSize.height,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.right },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing bottom handle', () => {
    // 하단 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x,
      y: initialArtboardCoord.y,
    };
    // height만 변한다.
    const expectedArtboardSize = {
      width: initialArtboardSize.width,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottom },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing left handle', () => {
    // 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X만 flip 된다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x + initialArtboardSize.width,
      y: initialArtboardCoord.y,
    };
    // width만 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: initialArtboardSize.height,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.left },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing top-left handle', () => {
    // 상단 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X, Y 모두 flip 된다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x + initialArtboardSize.width,
      y: initialArtboardCoord.y + initialArtboardSize.width,
    };
    // width, height 모두 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.topLeft },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing top-right handle', () => {
    // 상단 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // Y만 flip 된다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x,
      y: initialArtboardCoord.y + initialArtboardSize.width,
    };
    // width, height 모두 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.topRight },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing bottom-right handle', () => {
    // 하단 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedArtboardCoord = initialArtboardCoord;
    // width, height 모두 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottomRight },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize Artboard when mouse is moved by grabbing bottom-left handle', () => {
    // 상단 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialArtboardCoord = { x: 100, y: 50 };
    const initialArtboardSize = { width: 100, height: 100 };

    // X만 flip 된다.
    const expectedArtboardCoord = {
      x: initialArtboardCoord.x + initialArtboardSize.height,
      y: initialArtboardCoord.y,
    };
    // width, height 모두 변한다.
    const expectedArtboardSize = {
      width: mouseCoordWhenLastTriggered.x - expectedArtboardCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedArtboardCoord.y,
    };

    const artboard = new Artboard(makeDummyArtboardJSON({ ...initialArtboardCoord, ...initialArtboardSize }));

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottomLeft },
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
    expect(artboard.width).toBe(expectedArtboardSize.width);
    expect(artboard.height).toBe(expectedArtboardSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing top handle', () => {
    // 상단 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // Y만 flip 된다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x,
      y: initialShapeLayerCoord.y + initialShapeLayerSize.height,
    };
    // height만 변한다.
    const expectedShapeLayerSize = {
      width: initialShapeLayerSize.width,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.top },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing right handle', () => {
    // 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x,
      y: initialShapeLayerCoord.y,
    };
    // width만 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: initialShapeLayerSize.height,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.right },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing bottom handle', () => {
    // 하단 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x,
      y: initialShapeLayerCoord.y,
    };
    // height만 변한다.
    const expectedShapeLayerSize = {
      width: initialShapeLayerSize.width,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottom },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing left handle', () => {
    // 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X만 flip 된다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x + initialShapeLayerSize.width,
      y: initialShapeLayerCoord.y,
    };
    // width만 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: initialShapeLayerSize.height,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.left },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing top-left handle', () => {
    // 상단 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X, Y 모두 flip 된다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x + initialShapeLayerSize.width,
      y: initialShapeLayerCoord.y + initialShapeLayerSize.width,
    };
    // width, height 모두 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.topLeft },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing top-right handle', () => {
    // 상단 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // Y만 flip 된다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x,
      y: initialShapeLayerCoord.y + initialShapeLayerSize.width,
    };
    // width, height 모두 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.topRight },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing bottom-right handle', () => {
    // 하단 우측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X, Y 모두 flip 되지 않는다.
    const expectedShapeLayerCoord = initialShapeLayerCoord; // width, height 모두 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottomRight },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });

  test('should resize ShapeLayer when mouse is moved by grabbing bottom-left handle', () => {
    // 상단 좌측 resize 핸들을 잡아 마우스를 (400, 300)으로 이동시킨다.
    const mouseCoordWhenLastTriggered = { x: 400, y: 300 };

    const initialShapeLayerCoord = { x: 100, y: 50 };
    const initialShapeLayerSize = { width: 100, height: 100 };

    // X만 flip 된다.
    const expectedShapeLayerCoord = {
      x: initialShapeLayerCoord.x + initialShapeLayerSize.height,
      y: initialShapeLayerCoord.y,
    };
    // width, height 모두 변한다.
    const expectedShapeLayerSize = {
      width: mouseCoordWhenLastTriggered.x - expectedShapeLayerCoord.x,
      height: mouseCoordWhenLastTriggered.y - expectedShapeLayerCoord.y,
    };

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
        status: UIDesignToolStatus.resizing,
        payload: {
          mouse: makeDummyMouseStatus(),
          keyboard: makeDummyKeyboardStatus(),
          details: { targets, handlePlacement: HandlePlacement.bottomLeft },
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

    expect(shapeLayer.x.length).toBe(expectedShapeLayerCoord.x);
    expect(shapeLayer.y.length).toBe(expectedShapeLayerCoord.y);
    expect(shapeLayer.width.length).toBe(expectedShapeLayerSize.width);
    expect(shapeLayer.height.length).toBe(expectedShapeLayerSize.height);
  });
});
