import { InteractionHandleType, UIInteractionElementDataAttributeName, UIRecordElementDataAttributeName } from '@/types/Identifier';
import clsx from 'clsx';
import React from 'react';
import { LayerComponent } from '../Layer/component';
import withModel from '../withModel';
import { Artboard } from './model';
import * as styles from './styles.css';

export interface ArtboardProps {
  data: Artboard;
}

export type ArtboardRef = HTMLDivElement;

export const RawArtboardComponent = React.forwardRef<ArtboardRef, ArtboardProps>((props, ref) => {
  const { data: artboard, ...restProps } = props;

  const selected = !!restProps[UIRecordElementDataAttributeName.selected];
  const draft = !!restProps[UIRecordElementDataAttributeName.draft];
  const handleProps = { [UIInteractionElementDataAttributeName.handleType]: InteractionHandleType.select };

  return (
    <div {...restProps} ref={ref} className={styles.root} style={artboard.style} {...(selected ? handleProps : {})}>
      <div className={clsx(styles.name, { [styles.name_state.draft]: draft })} {...(selected ? {} : handleProps)}>
        {artboard.values.name}
      </div>
      <div className={styles.frame}>
        {artboard.children.map((it) => (
          <LayerComponent key={it.key} dataKey={it.key} />
        ))}
      </div>
    </div>
  );
});
RawArtboardComponent.displayName = 'RawArtboard';

export const ArtboardComponent = withModel(RawArtboardComponent);
ArtboardComponent.displayName = 'Artboard';
