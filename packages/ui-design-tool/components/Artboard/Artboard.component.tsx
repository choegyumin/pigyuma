import React from 'react';
import { LayerComponent } from '../Layer/Layer.component';
import withUIRecord from '../withUIRecord/withUIRecord.component';
import * as styles from './Artboard.css';
import { ArtboardProps, ArtboardRef } from './types';

export const RawArtboardComponent = React.forwardRef<ArtboardRef, ArtboardProps>((props, ref) => {
  const { data: artboard } = props;

  return (
    <div data-ui-name="artboard" data-ui-key={artboard.key} ref={ref} className={styles.root} style={artboard.style}>
      {artboard.children.map((it) => (
        <LayerComponent key={it.key} dataKey={it.key} />
      ))}
    </div>
  );
});
RawArtboardComponent.displayName = 'RawArtboard';

export const ArtboardComponent = withUIRecord(RawArtboardComponent);
ArtboardComponent.displayName = 'Artboard';
