import React from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { PointerEventsPreventer } from '../PointerEventsPreventer/PointerEventsPreventer';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { TransformOverlay } from '../TransformOverlay/TransformOverlay';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';

export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  return (
    <div className={styles.root}>
      <AxisGrid />
      <SelectionOverlay />
      <TransformOverlay />
      <PointerEventsPreventer />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
