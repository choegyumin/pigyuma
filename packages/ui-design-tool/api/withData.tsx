import { useUIRecord } from '@/hooks';
import { UIRecordElementDataAttributeName, UIRecordKey } from '@/types/Identifier';
import React from 'react';
import { UIRecord } from './UIRecord/model';

export type withDataProps = { dataKey: UIRecordKey };

type DefaultComponentProps = { data: UIRecord };

export default function withData<R, P extends DefaultComponentProps>(
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>,
) {
  const MemoizedComponent = React.memo(
    Component as React.ForwardRefExoticComponent<React.PropsWithoutRef<DefaultComponentProps> & React.RefAttributes<R>>,
  );

  const DataHOC = React.forwardRef<R, withDataProps>((props, ref) => {
    const { dataKey: recordKey, ...restProps } = props;

    const record = useUIRecord(recordKey);

    if (record == null) {
      return null;
    }

    const dataValues: AnyObject | undefined = record;
    const dataProps = {
      [UIRecordElementDataAttributeName.key]: dataValues?.key,
      [UIRecordElementDataAttributeName.type]: dataValues?.type,
      [UIRecordElementDataAttributeName.layerType]: dataValues?.layerType,
    };

    return <MemoizedComponent {...restProps} {...dataProps} data={record as UIRecord} ref={ref} />;
  });
  DataHOC.displayName = 'withData';

  return DataHOC;
}
