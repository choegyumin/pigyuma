import { JSDOM } from 'jsdom';
import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from './Geometry';

describe('UIRecordQuad', () => {
  test('should create instance', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };
    const p3 = { x: 100, y: 100 };
    const p4 = { x: 0, y: 100 };
    const quad = new UIRecordQuad(p1, p2, p3, p4);
    expect(quad.p1).toEqual({ w: 1, z: 0, ...p1 });
    expect(quad.p2).toEqual({ w: 1, z: 0, ...p2 });
    expect(quad.p3).toEqual({ w: 1, z: 0, ...p3 });
    expect(quad.p4).toEqual({ w: 1, z: 0, ...p4 });
  });

  test('should create instance from quad', () => {
    const init: UIRecordQuadInit = {
      p1: { x: 0, y: 0 },
      p2: { x: 100, y: 0 },
      p3: { x: 100, y: 100 },
      p4: { x: 0, y: 100 },
    };
    const fromInit = UIRecordQuad.fromQuad(init);
    const fromInstance = UIRecordQuad.fromQuad(UIRecordQuad.fromQuad(init));
    expect(fromInit).toBeInstanceOf(UIRecordQuad);
    expect(fromInit.p1).toEqual({ w: 1, z: 0, ...init.p1 });
    expect(fromInit.p2).toEqual({ w: 1, z: 0, ...init.p2 });
    expect(fromInit.p3).toEqual({ w: 1, z: 0, ...init.p3 });
    expect(fromInit.p4).toEqual({ w: 1, z: 0, ...init.p4 });
    expect(fromInstance).toBeInstanceOf(UIRecordQuad);
    expect(fromInstance.p1).toEqual(fromInit.p1);
    expect(fromInstance.p2).toEqual(fromInit.p2);
    expect(fromInstance.p3).toEqual(fromInit.p3);
    expect(fromInstance.p4).toEqual(fromInit.p4);
  });

  test('should create instance from rect', () => {
    const init: UIRecordRectInit = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0,
    };
    const fromInit = UIRecordQuad.fromRect(init);
    const fromInstance = UIRecordQuad.fromRect(UIRecordRect.fromRect(init));
    expect(fromInit).toBeInstanceOf(UIRecordQuad);
    expect(fromInit.p1).toEqual({ w: 1, z: 0, x: 0, y: 0 });
    expect(fromInit.p2).toEqual({ w: 1, z: 0, x: 100, y: 0 });
    expect(fromInit.p3).toEqual({ w: 1, z: 0, x: 100, y: 100 });
    expect(fromInit.p4).toEqual({ w: 1, z: 0, x: 0, y: 100 });
    expect(fromInstance).toBeInstanceOf(UIRecordQuad);
    expect(fromInstance.p1).toEqual(fromInit.p1);
    expect(fromInstance.p2).toEqual(fromInit.p2);
    expect(fromInstance.p3).toEqual(fromInit.p3);
    expect(fromInstance.p4).toEqual(fromInit.p4);
  });

  test('should return bounding rect (DOMRect)', () => {
    const init: UIRecordQuadInit = {
      p1: { x: 0, y: 0 },
      p2: { x: 100, y: 0 },
      p3: { x: 100, y: 100 },
      p4: { x: 0, y: 100 },
    };
    const quad = UIRecordQuad.fromQuad(init);
    const bounds = quad.getBounds();
    expect(bounds).toBeInstanceOf(DOMRect);
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(100);
    expect(bounds.height).toBe(100);
  });

  test('should return layout rect (UIRecordRect)', () => {
    const init: UIRecordQuadInit = {
      p1: { x: 0, y: 0 },
      p2: { x: 100, y: 0 },
      p3: { x: 100, y: 100 },
      p4: { x: 0, y: 100 },
    };
    const quad = UIRecordQuad.fromQuad(init);
    const layout = quad.getLayout();
    expect(layout).toBeInstanceOf(UIRecordRect);
    expect(layout.x).toBe(0);
    expect(layout.y).toBe(0);
    expect(layout.width).toBe(100);
    expect(layout.height).toBe(100);
    expect(layout.rotate).toBe(0);
  });

  test('should return correct JSON object', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };
    const p3 = { x: 100, y: 100 };
    const p4 = { x: 0, y: 100 };
    const quad = new UIRecordQuad(p1, p2, p3, p4);
    const json = quad.toJSON();
    const expected = {
      p1: { w: 1, z: 0, ...p1 },
      p2: { w: 1, z: 0, ...p2 },
      p3: { w: 1, z: 0, ...p3 },
      p4: { w: 1, z: 0, ...p4 },
    };
    expect(json).not.toBeInstanceOf(UIRecordRect);
    expect(json).toEqual(expected);
  });
});

describe('UIRecordRect', () => {
  test('should create instance', () => {
    const x = 10;
    const y = 10;
    const width = 10;
    const height = 10;
    const rotate = 10;
    const rect = new UIRecordRect(x, y, width, height, rotate);
    expect(rect.x).toEqual(x);
    expect(rect.y).toEqual(y);
    expect(rect.top).toEqual(y);
    expect(rect.right).toEqual(x + width);
    expect(rect.bottom).toEqual(y + height);
    expect(rect.left).toEqual(x);
    expect(rect.width).toEqual(width);
    expect(rect.height).toEqual(height);
    expect(rect.rotate).toEqual(rotate);
  });

  test('should create instance from rect', () => {
    const init = { x: 10, y: 20, width: 30, height: 40, rotate: 50 };
    const fromInit = UIRecordRect.fromRect(init);
    const fromInstance = UIRecordRect.fromRect(UIRecordRect.fromRect(init));
    expect(fromInit).toBeInstanceOf(UIRecordRect);
    expect(fromInit.x).toEqual(init.x);
    expect(fromInit.y).toEqual(init.y);
    expect(fromInit.top).toEqual(init.y);
    expect(fromInit.right).toEqual(init.x + init.width);
    expect(fromInit.bottom).toEqual(init.y + init.height);
    expect(fromInit.left).toEqual(init.x);
    expect(fromInit.width).toEqual(init.width);
    expect(fromInit.height).toEqual(init.height);
    expect(fromInit.rotate).toEqual(init.rotate);
    expect(fromInstance).toBeInstanceOf(UIRecordRect);
    expect(fromInstance.x).toEqual(fromInit.x);
    expect(fromInstance.y).toEqual(fromInit.y);
    expect(fromInstance.top).toEqual(fromInit.top);
    expect(fromInstance.right).toEqual(fromInit.right);
    expect(fromInstance.bottom).toEqual(fromInit.bottom);
    expect(fromInstance.left).toEqual(fromInit.left);
    expect(fromInstance.width).toEqual(fromInit.width);
    expect(fromInstance.height).toEqual(fromInit.height);
    expect(fromInstance.rotate).toEqual(fromInit.rotate);
  });

  test('should create instance from element', () => {
    const dom = new JSDOM('<!DOCTYPE html>');
    const element = dom.window.document.createElement('div');
    const fromElement = UIRecordRect.fromElement(element);
    expect(fromElement).toBeInstanceOf(UIRecordRect);
  });

  test('should return correct JSON object', () => {
    const x = 10;
    const y = 10;
    const width = 10;
    const height = 10;
    const rotate = 10;
    const rect = new UIRecordRect(x, y, width, height, rotate);
    const json = rect.toJSON();
    const expected = {
      x: x,
      y: y,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      width: width,
      height: height,
      rotate: rotate,
    };
    expect(json).not.toBeInstanceOf(UIRecordRect);
    expect(json).toEqual(expected);
  });
});
