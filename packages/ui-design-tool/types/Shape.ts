import { getUIRecordStyleValue } from '@/utils/style';
import { calcBoundsFromPoints, calcDegreesBetweenCoords, calcLayoutFromPoints, calcRectPoints, toDegrees360 } from '@pigyuma/utils';
import { UIRecordStyle } from './Style';

export interface UIRecordQuadInit extends Required<DOMQuadInit> {}

export interface UIRecordRectInit extends Required<DOMRectInit> {
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

  getBounds(): DOMRect {
    const { x, y, width, height } = calcBoundsFromPoints({ p1: this.p1, p2: this.p2, p3: this.p3, p4: this.p4 });
    return new DOMRect(x, y, width, height);
  }

  getLayout(): UIRecordRect {
    const degrees = calcDegreesBetweenCoords(this.p1, this.p2);
    const { x, y, width, height } = calcLayoutFromPoints({ p1: this.p1, p2: this.p2, p3: this.p3, p4: this.p4 });
    return new UIRecordRect(x, y, width, height, degrees);
  }

  static fromQuad(other: UIRecordQuadInit): UIRecordQuad {
    return new UIRecordQuad(other.p1, other.p2, other.p3, other.p4);
  }

  static fromRect(other: UIRecordRectInit): UIRecordQuad {
    const { p1, p2, p3, p4 } = calcRectPoints(other);
    return new UIRecordQuad(p1, p2, p3, p4);
  }

  static fromElement(other: HTMLElement): UIRecordQuad {
    return UIRecordQuad.fromRect(UIRecordRect.fromElement(other));
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

  static fromRect(other: UIRecordRectInit): UIRecordRect {
    const { x, y, width, height, degrees } = other;
    return new UIRecordRect(x, y, width, height, degrees);
  }

  static fromElement(other: HTMLElement): UIRecordRect {
    const layout = { width: other.clientWidth, height: other.clientHeight };
    const bounds = other.getBoundingClientRect();
    const degrees = parseFloat(getUIRecordStyleValue(other, UIRecordStyle.degrees)) || 0;

    const x = bounds.x + (bounds.width - layout.width) / 2;
    const y = bounds.y + (bounds.height - layout.height) / 2;
    const { width, height } = layout;

    return new UIRecordRect(x, y, width, height, degrees);
  }
}
