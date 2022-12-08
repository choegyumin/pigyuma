import React from 'react';
import { LayerComponent } from '../Layer/Layer.component';
import * as styles from './Artboard.css';
import { ArtboardProps, ArtboardRef } from './types';

export const ArtboardComponent = React.memo(
  React.forwardRef<ArtboardRef, ArtboardProps>((props, ref) => {
    const { artboard } = props;

    return (
      <div data-ui-name="artboard" data-ui-key={artboard.key} ref={ref} className={styles.root} style={artboard.style}>
        {artboard.children.map((it) => (
          <LayerComponent key={it.key} layer={it} />
        ))}
      </div>
    );
  }),
);
ArtboardComponent.displayName = 'Artboard';
