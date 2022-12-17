import ReactTypes from '@pigyuma/react-utility-types';
import React from 'react';
import * as styles from './InteractionController.css';

export type InteractionControllerProps = ReactTypes.UnknownProps;

export type InteractionControllerRef = HTMLDivElement;

/**
 * @todo 마우스 인터랙션 기능 구현
 */
export const InteractionController = React.memo(
  React.forwardRef<InteractionControllerRef, InteractionControllerProps>((props, ref) => {
    return (
      <div ref={ref} className={styles.root}>
        {null}
      </div>
    );
  }),
);
InteractionController.displayName = 'InteractionController';
