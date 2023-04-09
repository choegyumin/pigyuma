import { CanvasComponent } from '@/api/Canvas/component';
import { Canvas } from '@/api/Canvas/model';
import useInstanceID from '@/hooks/useInstanceID';
import useMode from '@/hooks/useMode';
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
    const { initialData, className, ...restProps } = props;

    const id = useInstanceID();
    const mode = useMode();
    const uiController = useUIController();

    useMount(() => {
      uiController.reset(cloneDeep(initialData));
    });

    return (
      <div
        {...restProps}
        ref={ref}
        className={clsx(styles.root, styles.root_mode[mode], className)}
        {...{ [UIDesignToolElementDataAttributeName.id]: id }}
      >
        <div className={styles.ui}>
          <CanvasComponent dataKey={Canvas.key} aria-hidden={true} />
        </div>
        <InteractionController />
      </div>
    );
  }),
);
UIDesignCanvas.displayName = 'UIDesignCanvas';
