import React from 'react';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { AxisGridRenderer } from './AxisGridRenderer';
import { AxisGridProps } from './types';
import useData from './useData';

/** @todo (설계가 일정 수준 이상 확정되면) 테스트 코드 작성 */
export const AxisGrid: React.FC<AxisGridProps> = React.memo(() => {
  const context = useContextForInteraction();

  const data = useData({ context });
  const { selectedRecordKey } = data;

  return <AxisGridRenderer recordKey={selectedRecordKey} />;
});
AxisGrid.displayName = 'AxisGrid';
