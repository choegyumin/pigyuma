import useCursor from '@/hooks/useCursor';
import useStatusMetadata from '@/hooks/useStatusMetadata';
import { UIDesignToolInteractionType } from '@/types/Status';
import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './PointerEventsController.css';

export const PointerEventsController: React.FC = React.memo(() => {
  const cursor = useCursor();
  const statusMetadata = useStatusMetadata();

  const shouldVisible = statusMetadata.interactionType !== UIDesignToolInteractionType.idle;

  const style: React.CSSProperties = {
    [styles.varNames.cursor]: shouldVisible ? cursor : 'default',
    [styles.varNames.visibility]: shouldVisible ? 'visibility' : 'hidden',
  };

  return ReactDOM.createPortal(<div className={styles.root} style={style} />, document.body);
});
PointerEventsController.displayName = 'PointerEventsController';
