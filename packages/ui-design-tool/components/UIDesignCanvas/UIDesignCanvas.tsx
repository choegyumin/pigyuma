import { CanvasComponent } from '@/api/Canvas/component';
import { Canvas } from '@/api/Canvas/model';
import useInstanceID from '@/hooks/useInstanceID';
import useUIController from '@/hooks/useUIController';
import { UIDesignToolElementDataAttributeName } from '@/types/Identifier';
import { useMount } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import { InteractionController } from '../InteractionController/InteractionController';
import { UIDesignCanvasProps, UIDesignCanvasRef } from './types';
import * as styles from './UIDesignCanvas.css';

export const UIDesignCanvas = React.memo(
  React.forwardRef<UIDesignCanvasRef, UIDesignCanvasProps>((props, ref) => {
    const id = useInstanceID();
    const uiController = useUIController();
    const { initialData, ...attrs } = props;

    useMount(() => {
      uiController.reset(cloneDeep(initialData));
    });

    return (
      <div {...attrs} ref={ref} className={clsx(styles.root, attrs.className)} {...{ [UIDesignToolElementDataAttributeName.id]: id }}>
        <CanvasComponent dataKey={Canvas.key} aria-hidden={true} />
        <InteractionController />
      </div>
    );
  }),
);
UIDesignCanvas.displayName = 'UIDesignCanvas';
