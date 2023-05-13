import { parseReactStyle } from '@pigyuma/react-utils';
import React, { useCallback, useState } from 'react';
import useStableCallback from './useStableCallback';

class ReactStyle {
  constructor(style: React.CSSProperties) {
    Object.assign(this, style);
  }

  /**
   * Reusing and mutating a `style` object between renders has been deprecated. This mirrors our change to freeze the `props` object.
   * See 0.14.0 CHANGELOG - Deprecations {@link https://github.com/facebook/react/blob/main/CHANGELOG.md#0140-october-7-2015}
   */
  freeze(): React.CSSProperties {
    return { ...this } as React.CSSProperties;
  }
}

export type SetStyleAction = React.CSSProperties | ((prevStyle: React.CSSProperties) => React.CSSProperties);

export default function useDOMStyle(
  initialValue: React.CSSProperties | (() => React.CSSProperties),
  selector: () => NodeListOf<HTMLElement | SVGElement> | Array<HTMLElement | SVGElement | null>,
): [ReactStyle, React.Dispatch<SetStyleAction>] {
  const [initialStyle] = useState<React.CSSProperties>(initialValue);
  const [style] = useState<ReactStyle>(() => new ReactStyle(initialStyle));

  const changeReactState = useCallback(
    (newStyle: React.CSSProperties) => {
      Object.entries(newStyle).forEach(([key, value]) => {
        if (value == null) {
          delete style[key];
        } else {
          style[key] = value;
        }
      });
    },
    [style],
  );

  const changeDOMStyle = useCallback(
    (newStyle: React.CSSProperties) => {
      const domStyle = parseReactStyle(newStyle);
      const entries = Object.entries(domStyle);
      const elements = selector();

      for (let i = 0; i < elements.length; i += 1) {
        const element = elements[i];
        if (element == null) {
          continue;
        }
        for (let j = 0; j < entries.length; j += 1) {
          const [key, value] = entries[j];
          element.style.setProperty(key, `${value}` ?? null);
        }
      }
    },
    [selector],
  );

  const setStyle = useStableCallback((value: SetStyleAction) => {
    const newStyle = typeof value === 'function' ? value(style.freeze()) : value;
    changeReactState(newStyle);
    changeDOMStyle(newStyle);
  });

  return [style, setStyle];
}
