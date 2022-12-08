import ReactTypes from '@pigyuma/react-utility-types';
import React from 'react';
import * as styles from './EventController.css';

export type EventControllerProps = ReactTypes.UnknownProps;

export type EventControllerRef = HTMLDivElement;

/**
 * @todo 마우스 인터랙션 기능 구현
 */
export const EventControllerComponent = React.memo(
  React.forwardRef<EventControllerRef, EventControllerProps>((props, ref) => {
    return (
      <div data-ui-name="event-controller" ref={ref} className={styles.root}>
        {null}
      </div>
    );
  }),
);
EventControllerComponent.displayName = 'EventController';
