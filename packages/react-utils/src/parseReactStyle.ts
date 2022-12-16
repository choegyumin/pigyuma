import React from 'react';
import parseReactStyleValue from './parseReactStyleValue';

export default function parseReactStyle(reactStyle: React.CSSProperties): Partial<CSSStyleDeclaration> {
  const domStyle: Partial<CSSStyleDeclaration> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = Object.entries<React.CSSProperties[keyof React.CSSProperties]>(reactStyle as any);

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (entry == null) {
      continue;
    }
    const [key, value] = entry;
    domStyle[key] = parseReactStyleValue(key, value);
  }
  return domStyle;
}
