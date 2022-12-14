import { parseReactStyle } from '@pigyuma/react-utils';
import React, { useRef, useState } from 'react';
import useStableCallback from './useStableCallback';

interface ReactStyle extends React.CSSProperties {
  new (style: React.CSSProperties): React.CSSProperties;
  freeze(): React.CSSProperties;
}

class ReactStyle implements ReactStyle {
  #ref: React.MutableRefObject<React.CSSProperties>;

  constructor(style: React.CSSProperties, ref: React.MutableRefObject<React.CSSProperties>) {
    this.#ref = ref;
    Object.assign(this, style);
  }

  /**
   * Reusing and mutating a `style` object between renders has been deprecated. This mirrors our change to freeze the `props` object.
   * @see 0.14.0 CHANGELOG - Deprecations {@link https://github.com/facebook/react/blob/main/CHANGELOG.md#0140-october-7-2015}
   */
  freeze(): React.CSSProperties {
    return this.#ref.current;
  }
}

export type SetStyleAction = React.CSSProperties | ((prevStyle: React.CSSProperties) => React.CSSProperties);

export default function useDOMStyle(
  initialValue: React.CSSProperties | (() => React.CSSProperties),
  selector: () => NodeListOf<HTMLElement | SVGElement> | Array<HTMLElement | SVGElement | null>,
): [ReactStyle, React.Dispatch<SetStyleAction>] {
  const [initialStyle] = useState<React.CSSProperties>(initialValue);

  const frozenStyleRef = useRef<React.CSSProperties>(initialStyle);
  const [immutableStyle] = useState<ReactStyle>(() => new ReactStyle(initialStyle, frozenStyleRef));

  const setCurrentStyle = useStableCallback((style: React.CSSProperties) => {
    Object.entries(style).forEach(([key, value]) => {
      if (value == null) {
        delete immutableStyle[key];
      } else {
        immutableStyle[key] = value;
      }
    });
    frozenStyleRef.current = { ...immutableStyle };
  });

  const setStyle = useStableCallback((action: SetStyleAction) => {
    const style = typeof action === 'function' ? action(immutableStyle.freeze()) : action;
    setCurrentStyle(style);

    const domStyle = parseReactStyle(style);
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
  });

  return [immutableStyle, setStyle];
}
