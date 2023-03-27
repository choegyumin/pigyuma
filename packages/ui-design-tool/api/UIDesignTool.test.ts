/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { UIRecordRect } from '@/types/Geometry';
import { LayerType, UIRecordKey, UIRecordType } from '@/types/Identifier';
import { UIDesignToolInteractionType, UIDesignToolTransformMethod, UIDesignToolStatus } from '@/types/Status';
import { XLengthType } from '@/types/Unit';
import { flatUIRecords } from '@/utils/model';
import { vi } from 'vitest';
import { Artboard, ArtboardData, ArtboardJSON } from './Artboard/model';
import { ShapeLayer, ShapeLayerData, ShapeLayerJSON } from './ShapeLayer/model';
import { TextLayer, TextLayerData, TextLayerJSON } from './TextLayer/model';
import { UIDesignTool } from './UIDesignTool';
import { UIRecord } from './UIRecord/model';

function createDummyArtboard(key: UIRecordKey): ArtboardJSON;
function createDummyArtboard(key?: UIRecordKey): ArtboardData;
function createDummyArtboard(key?: UIRecordKey): ArtboardData {
  return {
    key,
    type: UIRecordType.artboard,
    name: 'Artboard',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: '#fff',
    children: [],
  };
}

function createDummyShapeLayer(key: UIRecordKey): ShapeLayerJSON;
function createDummyShapeLayer(key?: UIRecordKey): ShapeLayerData;
function createDummyShapeLayer(key?: UIRecordKey): ShapeLayerData {
  return {
    key,
    type: UIRecordType.layer,
    layerType: LayerType.shape,
    name: 'Shape Layer',
    shapeType: 'container',
    x: { length: 100, lengthType: 'px' },
    y: { length: 100, lengthType: 'px' },
    rotate: { degrees: 0 },
    width: { length: 100, lengthType: 'px' },
    height: { length: 100, lengthType: 'px' },
    stroke: { color: 'black', pattern: 'solid', width: { top: 1, right: 1, bottom: 1, left: 1 } },
    fill: { color: 'white' },
    children: [],
  };
}

function createDummyTextLayer(key: UIRecordKey): TextLayerJSON;
function createDummyTextLayer(key?: UIRecordKey): TextLayerData;
function createDummyTextLayer(key?: UIRecordKey): TextLayerData {
  return {
    key,
    type: UIRecordType.layer,
    layerType: LayerType.text,
    name: 'Text Layer',
    x: { length: 0, lengthType: 'auto' },
    y: { length: 0, lengthType: 'auto' },
    rotate: { degrees: 0 },
    width: { length: 0, lengthType: 'flexible' },
    height: { length: 0, lengthType: 'flexible' },
    textColor: { color: 'black' },
    fontSize: { length: 14, lengthType: 'px' },
    lineHeight: { length: 150, lengthType: 'percent' },
    fontWeight: { value: 400 },
    letterSpacing: { length: 0, lengthType: 'px' },
    content: 'Content',
  };
}

describe('UIDesignTool', () => {
  let uiDesignTool: UIDesignTool;
  let dummyTextLayer: TextLayerJSON;
  let dummyShapeLayer: ShapeLayerJSON;
  let dummyTextLayerInTree: TextLayerJSON;
  let dummyShapeLayerInTree: ShapeLayerJSON;
  let dummyArtboard: ArtboardJSON;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool();

    dummyArtboard = createDummyArtboard('artboard');
    dummyTextLayer = createDummyTextLayer('text-layer');
    dummyShapeLayer = createDummyShapeLayer('shape-layer');

    dummyShapeLayerInTree = createDummyShapeLayer('shape-layer-in-artboard');
    dummyTextLayerInTree = createDummyTextLayer('text-layer-in-shape-layer');

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

  describe('mount', () => {
    test('should mount when not already mounted', () => {
      uiDesignTool.mount();

      expect(() => uiDesignTool.mount()).toThrow();

      uiDesignTool.unmount();
      expect(() => uiDesignTool.mount()).not.toThrow();
    });

    test('should return metadata of browser', () => {
      const { getBrowserMeta } = uiDesignTool.mount();
      expect(getBrowserMeta()).toEqual({
        keyboard: {
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
        },
        mouse: {
          clientX: 0,
          clientY: 0,
          offsetX: 0,
          offsetY: 0,
        },
      });
    });

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
      uiDesignTool.reset([createDummyArtboard(), createDummyShapeLayer('dummy')]);

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

      uiDesignTool.prepend(parent.key, createDummyTextLayer('dummy'));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[0]).toBeInstanceOf(TextLayer);
      expect(parent.children[0]?.key).toBe('dummy');
    });

    test('should append new UIRecord to another UIRecord', () => {
      const parent = uiDesignTool.get<ShapeLayer>(dummyArtboard.key)!;
      const parentLength = parent.children.length;

      uiDesignTool.append(parent.key, createDummyTextLayer('dummy'));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[1]).toBeInstanceOf(TextLayer);
      expect(parent.children[1]?.key).toBe('dummy');
    });

    test('should insert new UIRecord before another UIRecord', () => {
      const nextSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const parent = nextSibling.parent!;
      const parentLength = parent.children.length;

      uiDesignTool.insertBefore(nextSibling.key, createDummyTextLayer('dummy'));

      expect(parent.children).toHaveLength(parentLength + 1);
      expect(parent.children[0]).toBeInstanceOf(TextLayer);
      expect(parent.children[0]?.key).toBe('dummy');
    });

    test('should insert new UIRecord after another UIRecord', () => {
      const prevSibling = uiDesignTool.get<ShapeLayer>(dummyShapeLayerInTree.key)!;
      const parent = prevSibling.parent!;
      const parentLength = parent.children.length;

      uiDesignTool.insertAfter(prevSibling.key, createDummyTextLayer('dummy'));

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
