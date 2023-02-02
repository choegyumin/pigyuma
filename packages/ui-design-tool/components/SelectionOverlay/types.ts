import { UIRecord } from '../UIRecord/UIRecord.model';

export type SelectionOverlayChangeEvent = { target: HTMLElement | null; record: UIRecord | undefined };

export type SelectionOverlayProps = {
  onChange?: (event: SelectionOverlayChangeEvent) => void;
};

export type SelectionOverlayRef = {
  on: () => void;
  off: () => void;
};
