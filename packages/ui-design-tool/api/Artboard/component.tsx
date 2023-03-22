import React from 'react';
import { LayerComponent } from '../Layer/component';
import withData from '../withData';
import { Artboard } from './model';
import * as styles from './styles.css';

export type ArtboardProps = {
  data: Artboard;
};

export type ArtboardRef = HTMLDivElement;

export const RawArtboardComponent = React.forwardRef<ArtboardRef, ArtboardProps>((props, ref) => {
  const { data: artboard, ...restProps } = props;

  return (
    <div {...restProps} ref={ref} className={styles.root} style={artboard.style}>
      <div className={styles.name}>{artboard.name}</div>
      <div className={styles.frame}>
        {artboard.children.map((it) => (
          <LayerComponent key={it.key} dataKey={it.key} />
        ))}
      </div>
    </div>
  );
});
RawArtboardComponent.displayName = 'RawArtboard';

export const ArtboardComponent = withData(RawArtboardComponent);
ArtboardComponent.displayName = 'Artboard';
