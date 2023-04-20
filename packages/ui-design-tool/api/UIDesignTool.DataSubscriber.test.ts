import { UIRecordRect } from '@/types/Geometry';
import { UIRecordKey } from '@/types/Identifier';
import { vi } from 'vitest';
import { makeDummyArtboardJSON } from './Artboard/__mocks__/model';
import { ArtboardJSON } from './Artboard/model';
import { makeDummyShapeLayerJSON } from './ShapeLayer/__mocks__/model';
import { ShapeLayerJSON } from './ShapeLayer/model';
import { makeDummyTextLayerJSON } from './TextLayer/__mocks__/model';
import { TextLayerData, TextLayerJSON } from './TextLayer/model';
import { UIDesignTool } from './UIDesignTool';
import { UIRecord } from './UIRecord/model';

describe('UIDesignTool - DataSubscriber', () => {
  let uiDesignTool: UIDesignTool;
  let dummyTextLayer: TextLayerJSON;
  let dummyShapeLayer: ShapeLayerJSON;
  let dummyTextLayerInTree: TextLayerJSON;
  let dummyShapeLayerInTree: ShapeLayerJSON;
  let dummyArtboard: ArtboardJSON;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool({ strict: false });

    dummyArtboard = makeDummyArtboardJSON({ key: 'artboard' });
    dummyTextLayer = makeDummyTextLayerJSON({ key: 'text-layer' });
    dummyShapeLayer = makeDummyShapeLayerJSON({ key: 'shape-layer' });

    dummyShapeLayerInTree = makeDummyShapeLayerJSON({ key: 'shape-layer-in-artboard' });
    dummyTextLayerInTree = makeDummyTextLayerJSON({ key: 'text-layer-in-shape-layer' });

    dummyArtboard.children.push(dummyShapeLayerInTree);
    dummyShapeLayerInTree.children.push(dummyTextLayerInTree);

    uiDesignTool.reset([dummyArtboard, dummyShapeLayer, dummyTextLayer]);
  });

  /** @todo 레이어 순서 및 그룹 변경 기능 구현 시: listener 실행을 유발하는 누락된 메서드 추가 */
  describe('subscribeTree', () => {
    test('should bind listener and call when record tree changes', () => {
      const listener = vi.fn<[UIRecord[]], void>();
      uiDesignTool.subscribeTree(listener);

      uiDesignTool.set<TextLayerData>(dummyTextLayer.key, { content: '1' });
      uiDesignTool.set<TextLayerData>(dummyTextLayer.key, { content: '2' });
      uiDesignTool.setRect(dummyShapeLayer.key, new UIRecordRect(200, 300, 400, 500, 0));
      uiDesignTool.move('insertAfter', dummyTextLayerInTree.key, dummyShapeLayerInTree.key);
      uiDesignTool.remove(dummyTextLayerInTree.key);
      expect(listener).toHaveBeenCalledTimes(5);

      uiDesignTool.unsubscribeTree(listener);
      uiDesignTool.setRect(dummyShapeLayer.key, new UIRecordRect(100, 100, 100, 100, 0));
      expect(listener).toHaveBeenCalledTimes(5);
    });
  });

  /** @todo 레이어 순서 및 그룹 변경 기능 구현 시: listener 실행을 유발하는 누락된 메서드 추가 */
  describe('subscribeSelection', () => {
    test('should bind listener and call when selection changes', () => {
      const listener = vi.fn<[UIRecordKey[]], void>();
      uiDesignTool.subscribeSelection(listener);

      uiDesignTool.select([dummyArtboard.key]);
      uiDesignTool.select([dummyShapeLayer.key]);
      uiDesignTool.select([dummyTextLayer.key]);
      // Ignored
      uiDesignTool.select([dummyTextLayer.key]);
      uiDesignTool.select([dummyShapeLayer.key, dummyTextLayer.key]);
      // Ignored
      uiDesignTool.select([dummyShapeLayer.key, dummyTextLayer.key]);
      uiDesignTool.select([dummyTextLayer.key, dummyShapeLayer.key]);
      expect(listener).toHaveBeenCalledTimes(5);

      uiDesignTool.unsubscribeSelection(listener);
      uiDesignTool.select([dummyArtboard.key, dummyShapeLayer.key, dummyTextLayer.key]);
      expect(listener).toHaveBeenCalledTimes(5);
    });
  });
});
