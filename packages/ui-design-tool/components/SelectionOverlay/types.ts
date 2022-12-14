import { UIRecordKey } from '@/types/Identifier';
import ReactTypes from '@pigyuma/react-utility-types';
import { UIRecord } from '../UIRecord/UIRecord.model';

export type SelectionOverlayChangeEvent = {
  type: 'select' | 'rangeSelectionStart' | 'rangeSelectionChange' | 'rangeSelectionEnd';
  targets: HTMLElement[];
  records: UIRecord[];
};

export type SelectionOverlayProps = ReactTypes.UnknownProps;

export type SelectionOverlayRendererProps = {
  recordKey?: UIRecordKey;
  onDocumentMouseMove?: (event: MouseEvent) => void;
  onDocumentMouseDown?: (event: MouseEvent) => void;
  onDocumentMouseUp?: (event: MouseEvent) => void;
};
