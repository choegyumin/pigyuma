import { getUIRecordStyleValue } from '@/utils/style';
import {
  calcBoundsFromLayout,
  calcBoundsFromPoints,
  calcDegreesBetweenCoords,
  UNSAFE_calcLayoutFromBounds,
  calcLayoutFromPoints,
  calcRectPoints,
  toDegrees360,
} from '@pigyuma/utils';
import { UIRecordStyle } from './Style';

export interface UIRecordQuadInit extends Required<DOMQuadInit> {}

export interface UIRecordBoundingRectInit extends Required<DOMRectInit> {
  degrees: number;
}

export interface UIRecordLayoutRectInit extends Required<DOMRectInit> {
  degrees: number;
}

export class UIRecordQuad implements DOMQuad {
  readonly #points: {
    p1: DOMPoint;
    p2: DOMPoint;
    p3: DOMPoint;
    p4: DOMPoint;
  };

  constructor(p1: DOMPointInit, p2: DOMPointInit, p3: DOMPointInit, p4: DOMPointInit) {
    this.#points = {
      p1: new DOMPoint(p1.x, p1.y, p1.z, p1.w),
      p2: new DOMPoint(p2.x, p2.y, p2.z, p2.w),
      p3: new DOMPoint(p3.x, p3.y, p3.z, p3.w),
      p4: new DOMPoint(p4.x, p4.y, p4.z, p4.w),
    };
  }

  get p1() {
    return this.#points.p1;
  }
  get p2() {
    return this.#points.p2;
  }
  get p3() {
    return this.#points.p3;
  }
  get p4() {
    return this.#points.p4;
  }

  toJSON() {
    return {
      p1: this.p1.toJSON(),
      p2: this.p2.toJSON(),
      p3: this.p3.toJSON(),
      p4: this.p4.toJSON(),
    };
  }

  getRect(type?: 'bounds'): UIRecordBoundingRect;
  getRect(type?: 'layout'): UIRecordLayoutRect;
  getRect(type: 'bounds' | 'layout' = 'bounds'): UIRecordBoundingRect | UIRecordLayoutRect {
    if (type === 'bounds') {
      return this.getBounds();
    }
    if (type === 'layout') {
      return this.getBounds();
    }
    throw new Error('type must be bounds or layout');
  }

  getBounds(): UIRecordBoundingRect {
    const degrees = calcDegreesBetweenCoords(this.p1, this.p2);
    const { x, y, width, height } = calcBoundsFromPoints({ p1: this.p1, p2: this.p2, p3: this.p3, p4: this.p4 });
    return new UIRecordBoundingRect(x, y, width, height, degrees);
  }

  getLayout(): UIRecordLayoutRect {
    const degrees = calcDegreesBetweenCoords(this.p1, this.p2);
    const { x, y, width, height } = calcLayoutFromPoints({ p1: this.p1, p2: this.p2, p3: this.p3, p4: this.p4 });
    return new UIRecordLayoutRect(x, y, width, height, degrees);
  }

  static fromQuad(other: UIRecordQuadInit): UIRecordQuad {
    return new UIRecordQuad(other.p1, other.p2, other.p3, other.p4);
  }

  static fromRect(other: UIRecordBoundingRectInit, type?: 'bounds'): UIRecordQuad;
  static fromRect(other: UIRecordLayoutRectInit, type?: 'layout'): UIRecordQuad;
  static fromRect(other: UIRecordBoundingRectInit | UIRecordLayoutRectInit, type: 'bounds' | 'layout' = 'bounds'): UIRecordQuad {
    if (type === 'bounds') {
      return UIRecordQuad.fromBounds(other);
    }
    if (type === 'layout') {
      return UIRecordQuad.fromLayout(other);
    }
    throw new Error('type must be bounds or layout');
  }

  static fromBounds(other: UIRecordBoundingRectInit): UIRecordQuad {
    const { x, y, width, height, degrees } = other;
    const rect = UNSAFE_calcLayoutFromBounds({ x, y, width, height, degrees });
    const { p1, p2, p3, p4 } = calcRectPoints({ ...rect, degrees });
    return new UIRecordQuad(p1, p2, p3, p4);
  }

  static fromLayout(other: UIRecordLayoutRectInit): UIRecordQuad {
    const { p1, p2, p3, p4 } = calcRectPoints(other);
    return new UIRecordQuad(p1, p2, p3, p4);
  }

  static fromElement(other: HTMLElement): UIRecordQuad {
    const degrees = parseFloat(getUIRecordStyleValue(other, UIRecordStyle.degrees));
    const rect = UNSAFE_calcLayoutFromBounds({ ...other.getBoundingClientRect().toJSON(), degrees });
    const { p1, p2, p3, p4 } = calcRectPoints({ ...rect, degrees });
    return new UIRecordQuad(p1, p2, p3, p4);
  }
}

export class UIRecordRect implements DOMRect {
  readonly #rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    degrees: number;
  };

  constructor(x: number, y: number, width: number, height: number, degrees: number) {
    this.#rect = { x, y, width, height, degrees: toDegrees360(degrees) };
  }

  get x() {
    return this.#rect.x;
  }
  get y() {
    return this.#rect.y;
  }
  get width() {
    return this.#rect.width;
  }
  get height() {
    return this.#rect.height;
  }
  get degrees() {
    return this.#rect.degrees;
  }

  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
      degrees: this.degrees,
    };
  }

  static fromRect(other: UIRecordBoundingRectInit, type?: 'bounds'): UIRecordBoundingRect;
  static fromRect(other: UIRecordLayoutRectInit, type?: 'layout'): UIRecordBoundingRect;
  static fromRect(other: UIRecordBoundingRectInit | UIRecordLayoutRectInit, type: 'bounds' | 'layout' = 'bounds'): UIRecordBoundingRect {
    if (type === 'bounds') {
      return UIRecordBoundingRect.fromBounds(other);
    }
    if (type === 'layout') {
      return UIRecordBoundingRect.fromLayout(other);
    }
    throw new Error('type must be bounds or layout');
  }
}

export class UIRecordBoundingRect extends UIRecordRect {
  readonly #rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    degrees: number;
  };

  constructor(x: number, y: number, width: number, height: number, degrees: number) {
    super(x, y, width, height, degrees);
    this.#rect = { x, y, width, height, degrees };
  }

  static fromBounds(other: UIRecordBoundingRectInit): UIRecordBoundingRect {
    const { x, y, width, height, degrees } = other;
    return new UIRecordBoundingRect(x, y, width, height, degrees);
  }

  static fromLayout(other: UIRecordLayoutRectInit): UIRecordBoundingRect {
    const { degrees } = other;
    const { x, y, width, height } = calcBoundsFromLayout(other);
    return new UIRecordBoundingRect(x, y, width, height, degrees);
  }

  static fromElement(other: HTMLElement): UIRecordBoundingRect {
    const degrees = parseFloat(getUIRecordStyleValue(other, UIRecordStyle.degrees));
    const { x, y, width, height } = other.getBoundingClientRect();
    return new UIRecordBoundingRect(x, y, width, height, degrees);
  }
}

export class UIRecordLayoutRect extends UIRecordRect {
  readonly #rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    degrees: number;
  };

  constructor(x: number, y: number, width: number, height: number, degrees: number) {
    super(x, y, width, height, degrees);
    this.#rect = { x, y, width, height, degrees };
  }

  static fromBounds(other: UIRecordBoundingRectInit): UIRecordLayoutRect {
    const { degrees } = other;
    const { x, y, width, height } = UNSAFE_calcLayoutFromBounds(other);
    return new UIRecordLayoutRect(x, y, width, height, degrees);
  }

  static fromLayout(other: UIRecordLayoutRectInit): UIRecordLayoutRect {
    const { x, y, width, height, degrees } = other;
    return new UIRecordLayoutRect(x, y, width, height, degrees);
  }

  static fromElement(other: HTMLElement): UIRecordLayoutRect {
    const degrees = parseFloat(getUIRecordStyleValue(other, UIRecordStyle.degrees));
    const { x, y, width, height } = UNSAFE_calcLayoutFromBounds({ ...other.getBoundingClientRect().toJSON(), degrees });
    return new UIRecordLayoutRect(x, y, width, height, degrees);
  }
}
