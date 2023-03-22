import { StatusType } from '@/api/UIDesignTool';
import useCursor from '@/hooks/useCursor';
import useStatus from '@/hooks/useStatus';
import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './PointerEventsPreventer.css';

export const PointerEventsPreventer: React.FC = React.memo(() => {
  const cursor = useCursor();
  const status = useStatus();

  const shouldVisible = status.statusType !== StatusType.idle;

  const style: React.CSSProperties = {
    [styles.varNames.cursor]: shouldVisible ? cursor : 'default',
    [styles.varNames.visibility]: shouldVisible ? 'visibility' : 'hidden',
  };

  return ReactDOM.createPortal(<div className={styles.root} style={style} />, document.body);
});
PointerEventsPreventer.displayName = 'PointerEventsPreventer';
