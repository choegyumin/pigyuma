import { UIDesignToolInteractionType } from '@/api/UIDesignTool';
import useCursor from '@/hooks/useCursor';
import useStatusMeta from '@/hooks/useStatusMeta';
import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './PointerEventsController.css';

export const PointerEventsController: React.FC = React.memo(() => {
  const cursor = useCursor();
  const statusMeta = useStatusMeta();

  const shouldVisible = statusMeta.interactionType !== UIDesignToolInteractionType.idle;

  const style: React.CSSProperties = {
    [styles.varNames.cursor]: shouldVisible ? cursor : 'default',
    [styles.varNames.visibility]: shouldVisible ? 'visibility' : 'hidden',
  };

  return ReactDOM.createPortal(<div className={styles.root} style={style} />, document.body);
});
PointerEventsController.displayName = 'PointerEventsController';
