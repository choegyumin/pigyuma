import { UIRecordKey } from '@/types/Identifier';
import ReactTypes from '@pigyuma/react-utility-types';

export type AxisGridProps = ReactTypes.UnknownProps;

export type AxisGridRef = {
  select: (recordKey: UIRecordKey) => void;
  deselect: () => void;
};
