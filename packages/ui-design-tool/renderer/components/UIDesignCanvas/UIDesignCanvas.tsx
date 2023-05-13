import { CanvasComponent } from '@/models/Canvas/component';
import { Canvas } from '@/models/Canvas/model';
import { UIDesignToolElementDataAttributeName } from '@/types/Identifier';
import clsx from 'clsx';
import React from 'react';
import { InteractionController } from '../InteractionController/InteractionController';
import { UIDesignCanvasProps, UIDesignCanvasRef } from './types';
import * as styles from './UIDesignCanvas.css';
import useUIDesignCanvas from './useUIDesignCanvas';

/** @todo 오픈 소스로 전환 시: 빌드 시 적은 용량을 가지는 SolidJS 등의 기술로 마이그레이션 (UIDesignTool과 연결된 라이브러리별 API 제공) */
export const UIDesignCanvas = React.memo(
  React.forwardRef<UIDesignCanvasRef, UIDesignCanvasProps>((props, ref) => {
    const viewModel = useUIDesignCanvas(props, ref);

    const { id, mode } = viewModel;
    const { initialData, className, ...restProps } = props;

    return (
      <div
        {...restProps}
        ref={ref}
        className={clsx(styles.root, styles.root_mode[mode], className)}
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={0}
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
