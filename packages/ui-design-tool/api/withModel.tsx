import useDrafts from '@/hooks/useDrafts';
import useSelected from '@/hooks/useSelected';
import useUIRecord from '@/hooks/useUIRecord';
import { UIRecordElementDataAttributeName, UIRecordKey } from '@/types/Identifier';
import React from 'react';
import { UIRecord } from './UIRecord/model';

export interface WithModelProps {
  dataKey: UIRecordKey;
}

interface DefaultComponentProps {
  data: UIRecord;
}

export default function withModel<R, P extends DefaultComponentProps>(
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>>,
) {
  const MemoizedComponent = React.memo(
    Component as React.ForwardRefExoticComponent<React.PropsWithoutRef<DefaultComponentProps> & React.RefAttributes<R>>,
  );

  const ModelHOC = React.forwardRef<R, WithModelProps>((props, ref) => {
    const { dataKey: recordKey, ...restProps } = props;

    const record = useUIRecord(recordKey);
    const selectedRecords = useSelected();
    const draftRecords = useDrafts();

    if (record == null) {
      return null;
    }

    const dataValues: AnyObject | undefined = record;
    const dataProps = {
      [UIRecordElementDataAttributeName.key]: dataValues?.key,
      [UIRecordElementDataAttributeName.type]: dataValues?.type,
      [UIRecordElementDataAttributeName.layerType]: dataValues?.layerType,
      [UIRecordElementDataAttributeName.selected]: selectedRecords.has(record.key),
      [UIRecordElementDataAttributeName.draft]: draftRecords.has(record.key),
    };

    return <MemoizedComponent {...restProps} {...dataProps} data={record as UIRecord} ref={ref} />;
  });
  ModelHOC.displayName = 'withModel';

  return ModelHOC;
}
