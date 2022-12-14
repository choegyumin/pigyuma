import { clone } from '@pigyuma/utils';
import React, { useContext, useEffect, useState } from 'react';
import { UIRecord } from '../UIRecord/UIRecord.model';
import { WorkspaceContext } from '../Workspace/Workspace.context';
import { withUIRecordProps } from './types';

type DefaultComponentProps = { data: UIRecord };

export function withUIRecord<R, P extends DefaultComponentProps>(
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>,
) {
  const MemoizedComponent = React.memo(
    Component as React.ForwardRefExoticComponent<React.PropsWithoutRef<DefaultComponentProps> & React.RefAttributes<R>>,
  );

  const WorkspaceHOC = React.forwardRef<R, withUIRecordProps>((props, ref) => {
    const { dataKey: recordKey, ...restProps } = props;
    const { records, subscribe, unsubscribe } = useContext(WorkspaceContext);

    const [record, setRecord] = useState<UIRecord | undefined>(() => clone(records.get(recordKey)));

    useEffect(() => {
      subscribe(recordKey, (newUIRecord) => {
        setRecord(clone(newUIRecord));
      });
      return () => {
        unsubscribe(recordKey);
      };
    }, [recordKey, subscribe, unsubscribe, setRecord]);

    if (record == null) {
      return null;
    }

    return <MemoizedComponent {...restProps} ref={ref} data={record} />;
  });
  WorkspaceHOC.displayName = 'withUIRecord';

  return WorkspaceHOC;
}
export default withUIRecord;
