import { MutableRefObject, RefCallback } from 'react';

export default function setRef<
  R extends MutableRefObject<unknown> | RefCallback<unknown>,
  V extends R extends MutableRefObject<infer T> ? T : R extends RefCallback<infer T> ? T : never,
>(ref: R, value: V): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
