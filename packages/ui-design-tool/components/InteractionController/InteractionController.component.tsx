import React from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid.component';
import { PointerEventsPreventer } from '../PointerEventsPreventer/PointerEventsPreventer.component';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay.component';
import { TransformOverlay } from '../TransformOverlay/TransformOverlay.component';
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
