import useUIRecord from '@/hooks/useUIRecord';
import React from 'react';
import { UIRecord } from '../UIRecord/UIRecord.model';
import { withUIRecordProps } from './types';

type DefaultComponentProps = { data: UIRecord };

export function withUIRecord<R, P extends DefaultComponentProps>(
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>,
) {
  const MemoizedComponent = React.memo(
    Component as React.ForwardRefExoticComponent<React.PropsWithoutRef<DefaultComponentProps> & React.RefAttributes<R>>,
  );

  const UIRecordHOC = React.forwardRef<R, withUIRecordProps>((props, ref) => {
    const { dataKey: recordKey, ...restProps } = props;

    const record = useUIRecord(recordKey);

    if (record == null) {
      return null;
    }

    const dataValues: AnyObject | undefined = record;
    /** @see UIRecordIdentifiers */
    const dataProps = {
      'data-ui-record-key': dataValues?.key,
      'data-ui-record-type': dataValues?.type,
      'data-ui-record-layer-type': dataValues?.layerType,
    };

    return <MemoizedComponent {...restProps} {...dataProps} data={record as UIRecord} ref={ref} />;
  });
  UIRecordHOC.displayName = 'withUIRecord';

  return UIRecordHOC;
}
export default withUIRecord;
