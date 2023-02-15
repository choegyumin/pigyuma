import { UIDesignToolStatus } from '@/api/UIDesignTool';
import React from 'react';
import ReactDOM from 'react-dom';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import * as styles from './PointerEventsPreventer.css';
import { PointerEventsPreventerProps } from './types';

export const PointerEventsPreventer: React.FC<PointerEventsPreventerProps> = React.memo(() => {
  const context = useContextForInteraction();

  const shouldVisible = context.status === UIDesignToolStatus.resizing || context.status === UIDesignToolStatus.rotating;

  const style: React.CSSProperties = {
    [styles.varNames.cursor]: shouldVisible ? context.cursor : 'default',
    [styles.varNames.visibility]: shouldVisible ? 'visibility' : 'hidden',
  };

  return ReactDOM.createPortal(<div className={styles.root} style={style} />, document.body);
});
PointerEventsPreventer.displayName = 'PointerEventsPreventer';
