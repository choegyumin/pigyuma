import { useUIRecordForUI } from '@/hooks';
import { UIRecordElementDataAttributes, UIRecordKey } from '@/types/Identifier';
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

    const record = useUIRecordForUI(recordKey);

    if (record == null) {
      return null;
    }

    const dataValues: AnyObject | undefined = record;
    const dataProps = {
      [UIRecordElementDataAttributes.key]: dataValues?.key,
      [UIRecordElementDataAttributes.type]: dataValues?.type,
      [UIRecordElementDataAttributes.layerType]: dataValues?.layerType,
    };

    return <MemoizedComponent {...restProps} {...dataProps} data={record as UIRecord} ref={ref} />;
  });
  DataHOC.displayName = 'withData';

  return DataHOC;
}
