import { UIRecordRect } from '@/types/Geometry';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolStatus } from '@/types/Status';
import { XLengthType } from '@/types/Unit';
import { flatUIRecords } from '@/utils/model';
import { makeDummyArtboardJSON } from './Artboard/__mocks__/model';
import { Artboard, ArtboardJSON } from './Artboard/model';
import { makeDummyShapeLayerJSON } from './ShapeLayer/__mocks__/model';
import { ShapeLayer, ShapeLayerJSON } from './ShapeLayer/model';
import { makeDummyTextLayerJSON } from './TextLayer/__mocks__/model';
import { TextLayer, TextLayerData, TextLayerJSON } from './TextLayer/model';
import { UIDesignTool } from './UIDesignTool';

describe('UIDesignTool - ModelStore', () => {
  let uiDesignTool: UIDesignTool;
  let dummyTextLayer: TextLayerJSON;
  let dummyShapeLayer: ShapeLayerJSON;
  let dummyTextLayerInTree: TextLayerJSON;
  let dummyShapeLayerInTree: ShapeLayerJSON;
  let dummyArtboard: ArtboardJSON;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool();

    dummyArtboard = makeDummyArtboardJSON({ key: 'artboard' });
    dummyTextLayer = makeDummyTextLayerJSON({ key: 'text-layer' });
    dummyShapeLayer = makeDummyShapeLayerJSON({ key: 'shape-layer' });

    dummyShapeLayerInTree = makeDummyShapeLayerJSON({ key: 'shape-layer-in-artboard' });
    dummyTextLayerInTree = makeDummyTextLayerJSON({ key: 'text-layer-in-shape-layer' });

    dummyArtboard.children.push(dummyShapeLayerInTree);
    dummyShapeLayerInTree.children.push(dummyTextLayerInTree);

    uiDesignTool.reset([dummyArtboard, dummyShapeLayer, dummyTextLayer]);
  });

  describe('setStatus', () => {
    test('should update status', () => {
      const { setStatus } = uiDesignTool.mount();

      expect(uiDesignTool.status).toBe(UIDesignToolStatus.idle);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.idle);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.idle);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.unable);

      setStatus(UIDesignToolStatus.selection);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.selection);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.selection);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.unable);

      setStatus(UIDesignToolStatus.drawing);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.drawing);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.drawing);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.unable);

      setStatus(UIDesignToolStatus.moving);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.moving);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.transform);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.move);

      setStatus(UIDesignToolStatus.resizing);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.resizing);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.transform);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.resize);

      setStatus(UIDesignToolStatus.rotating);
      expect(uiDesignTool.status).toBe(UIDesignToolStatus.rotating);
      expect(uiDesignTool.interactionType).toBe(UIDesignToolInteractionType.transform);
      expect(uiDesignTool.transformMethod).toBe(UIDesignToolTransformMethod.rotate);
    });
  });

  describe('reset', () => {
    test('should reset UI records', () => {
      uiDesignTool.reset([makeDummyArtboardJSON(), makeDummyShapeLayerJSON({ key: 'dummy' })]);

      expect(uiDesignTool.tree.children).toHaveLength(2);
      expect(uiDesignTool.tree.children[0]).toBeInstanceOf(Artboard);
      expect(typeof uiDesignTool.tree.children[0]?.key).toBe('string');
      expect(uiDesignTool.tree.children[1]).toBeInstanceOf(ShapeLayer);
      expect(uiDesignTool.tree.children[1]?.key).toBe('dummy');
    });
  });

  describe('select', () => {
    test('should select UI records', () => {
      uiDesignTool.select([dummyArtboard.key]);

      expect(uiDesignTool.isSelected(dummyArtboard.key)).toBeTruthy();
      expect(uiDesignTool.isSelected(dummyShapeLayer.key)).toBeFalsy();
      expect(uiDesignTool.isSelected(dummyTextLayer.key)).toBeFalsy();
    });
  });

  describe('get', () => {
    test('should return UIRecord item', () => {
      const shapeLayer = uiDesignTool.get<ShapeLayer>(dummyShapeLayer.key);
      expect(shapeLayer).toBeInstanceOf(ShapeLayer);
      expect(shapeLayer?.key).toBe(dummyShapeLayer.key);

      const empty = uiDesignTool.get('?');
      expect(empty).toBe(undefined);
    });
  });

  describe('set', () => {
    test('should update UIRecord data', () => {
      const textLayer = uiDesignTool.get<TextLayer>(dummyTextLayer.key);
      expect(textLayer?.content).toBe(dummyTextLayer.content);

      uiDesignTool.set<TextLayerData>(dummyTextLayer.key, { content: 'Changed' });
      expect(textLayer?.content).toBe('Changed');
    });
  });

  describe('setRect', () => {
    test('should update UIRecord data with rect', () => {
      const shapeLayer = uiDesignTool.get<ShapeLayer>(dummyShapeLayer.key);
      expect(shapeLayer?.width).toEqual(dummyShapeLayer.width);

      uiDesignTool.setRect(dummyShapeLayer.key, new UIRecordRect(200, 300, 400, 500, 0));
      expect(shapeLayer?.width).toEqual({ length: 400, lengthType: XLengthType.px });
    });
  });

  describe('move', () => {
    test('should prepend UIRecord to another UIRecord', () => {
      const handle = uiDesignTool.get<TextLayer>(dummyTextLayerInTree.key)!;
      const startParent = handle.parent!;
      const destParent = uiDesignTool.get<Artboard>(dummyArtboard.key)!;

      const startChildrenLength = startParent.children.length;
      const destChildrenLength = destParent.children.length;

      uiDesignTool.move('prepend', handle.key, destParent.key);

      expect(startParent.children).toHaveLength(startChildrenLength - 1);
      expect(destParent.children).toHaveLength(destChildrenLength + 1);
      expect(destParent.children[0]).toBe(handle);
      expect(handle.parent?.key).toBe(destParent.key);
    });

    test('should append UIRecord to another UIRecord', () => {
      const handle = uiDesignTool.get<TextLayer>(dummyTextLayerInTree.key)!;
      const startParent = handle.parent!;
      const destParent = uiDesignTool.get<Artboard>(dummyArtboard.key)!;

      const startChildrenLength = startParent.children.length;
      const destChildrenLength = destParent.children.length;

      uiDesignTool.move('append', handle.key, destParent.key);

      expect(startParent.children).toHaveLength(startChildrenLength - 1);
      expect(destParent.children).toHaveLength(destChildrenLength + 1);
      expect(destParent.children[1]).toBe(handle);
      expect(handle.parent?.key).toBe(destParent.key);
    });

    test('should insert UIRecord before another UIRecord', () => {
      const handle = uiDesignTool.get<TextLayer>(dummyTextLayerInTree.key)!;
      const startParent = handle.parent!;
      const destNextSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const destParent = destNextSibling.parent!;

      const startChildrenLength = startParent.children.length;
      const destChildrenLength = destParent.children.length;

      uiDesignTool.move('insertBefore', handle.key, destNextSibling.key);

      expect(startParent.children).toHaveLength(startChildrenLength - 1);
      expect(destParent.children).toHaveLength(destChildrenLength + 1);
      expect(destParent.children[0]).toBe(handle);
      expect(handle.parent?.key).toBe(destParent.key);
    });

    test('should insert UIRecord after another UIRecord', () => {
      const handle = uiDesignTool.get<TextLayer>(dummyTextLayerInTree.key)!;
      const startParent = handle.parent!;
      const destPrevSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const destParent = destPrevSibling.parent!;

      const startChildrenLength = startParent.children.length;
      const destChildrenLength = destParent.children.length;

      uiDesignTool.move('insertAfter', handle.key, destPrevSibling.key);

      expect(startParent.children).toHaveLength(startChildrenLength - 1);
      expect(destParent.children).toHaveLength(destChildrenLength + 1);
      expect(destParent.children[1]).toBe(handle);
      expect(handle.parent?.key).toBe(destParent.key);
    });
  });

  describe('prepend/append/insertBefore/insertAfter', () => {
    test('should prepend new UIRecord to another UIRecord', () => {
      const parent = uiDesignTool.get<ShapeLayer>(dummyArtboard.key)!;
      const parentLength = parent.children.length;

      uiDesignTool.prepend(parent.key, makeDummyTextLayerJSON({ key: 'dummy' }));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[0]).toBeInstanceOf(TextLayer);
      expect(parent.children[0]?.key).toBe('dummy');
    });

    test('should append new UIRecord to another UIRecord', () => {
      const parent = uiDesignTool.get<ShapeLayer>(dummyArtboard.key)!;
      const parentLength = parent.children.length;

      uiDesignTool.append(parent.key, makeDummyTextLayerJSON({ key: 'dummy' }));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[1]).toBeInstanceOf(TextLayer);
      expect(parent.children[1]?.key).toBe('dummy');
    });

    test('should insert new UIRecord before another UIRecord', () => {
      const nextSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const parent = nextSibling.parent!;
      const parentLength = parent.children.length;

      uiDesignTool.insertBefore(nextSibling.key, makeDummyTextLayerJSON({ key: 'dummy' }));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[0]).toBeInstanceOf(TextLayer);
      expect(parent.children[0]?.key).toBe('dummy');
    });

    test('should insert new UIRecord after another UIRecord', () => {
      const prevSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const parent = prevSibling.parent!;
      const parentLength = parent.children.length;

      uiDesignTool.insertAfter(prevSibling.key, makeDummyTextLayerJSON({ key: 'dummy' }));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[1]).toBeInstanceOf(TextLayer);
      expect(parent.children[1]?.key).toBe('dummy');
    });
  });

  describe('remove', () => {
    test('should remove UIRecord', () => {
      const target = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const parent = target.parent!;
      const parentLength = parent.children.length;
      const pairsLength = uiDesignTool.pairs.size;
      const removedPairsLength = flatUIRecords(target.children).size + 1;

      expect(target != null).toBeTruthy();

      uiDesignTool.remove(target.key);

      expect(parent.children).toHaveLength(parentLength - 1);
      expect(uiDesignTool.pairs).toHaveLength(pairsLength - removedPairsLength);
      expect(uiDesignTool.get(target.key)).toBe(undefined);
    });
  });
});
