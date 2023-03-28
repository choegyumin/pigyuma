import { UIRecordKey } from '@/types/Identifier';
import { UIDesignToolStatus } from '@/types/Status';
import ReactTypes from '@pigyuma/react-utility-types';

export type InteractionControllerProps = ReactTypes.UnknownProps;

export type InteractionTask = {
  event: MouseEvent;
  target?: UIRecordKey;
  status: UIDesignToolStatus;
  enter?: () => void;
  leave?: () => void;
  clear?: () => void;
  calibrate?: number;
};
