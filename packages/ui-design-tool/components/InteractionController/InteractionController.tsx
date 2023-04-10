import { useEventListener } from '@pigyuma/react-utils';
import React from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { HoveringOverlay } from '../HoveringOverlay/HoveringOverlay';
import { PointerEventsController } from '../PointerEventsController/PointerEventsController';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';
import useInteractionController from './useInteractionController';

export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  const viewModel = useInteractionController();

  useEventListener(document, 'mousedown', viewModel?.onDocumentMouseDown);
  useEventListener(document, 'mouseup', viewModel?.onDocumentMouseUp);
  useEventListener(document, 'mousemove', viewModel?.onDocumentMouseMove);

  if (viewModel == null) {
    return null;
  }

  return (
    <div className={styles.root}>
      <AxisGrid />
      <HoveringOverlay />
      <SelectionOverlay />
      <PointerEventsController />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
