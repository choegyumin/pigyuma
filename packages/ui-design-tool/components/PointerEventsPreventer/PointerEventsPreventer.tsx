import { UIDesignToolStatus } from '@/api/UIDesignTool';
import useCursor from '@/hooks/useCursor';
import useStatus from '@/hooks/useStatus';
import React from 'react';
import ReactDOM from 'react-dom';
import * as styles from './PointerEventsPreventer.css';
import { PointerEventsPreventerProps } from './types';

export const PointerEventsPreventer: React.FC<PointerEventsPreventerProps> = React.memo(() => {
  const cursor = useCursor();
  const status = useStatus();

  const shouldVisible = status === UIDesignToolStatus.resizing || status === UIDesignToolStatus.rotating;

  const style: React.CSSProperties = {
    [styles.varNames.cursor]: shouldVisible ? cursor : 'default',
    [styles.varNames.visibility]: shouldVisible ? 'visibility' : 'hidden',
  };

  return ReactDOM.createPortal(<div className={styles.root} style={style} />, document.body);
});
PointerEventsPreventer.displayName = 'PointerEventsPreventer';
