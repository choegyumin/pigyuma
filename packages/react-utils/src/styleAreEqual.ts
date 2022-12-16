import React from 'react';

export default function styleAreEqual(prevStyle: React.CSSProperties, nextStyle: React.CSSProperties): boolean {
  if (prevStyle === nextStyle) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prevEntries = Object.entries<React.CSSProperties[keyof React.CSSProperties]>(prevStyle as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextEntries = Object.entries<React.CSSProperties[keyof React.CSSProperties]>(nextStyle as any);

  if (prevEntries.length !== nextEntries.length) {
    return false;
  }

  for (let index = 0; index < prevEntries.length; index += 1) {
    const [prevKey, prevValue] = prevEntries[index];
    const [nextKey, nextValue] = nextEntries[index];
    if (prevKey !== nextKey) {
      return false;
    }
    if (prevValue !== nextValue) {
      return false;
    }
  }

  return true;
}
