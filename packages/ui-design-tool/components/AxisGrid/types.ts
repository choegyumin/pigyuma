import ReactTypes from '@pigyuma/react-utility-types';

export type AxisGridChangeEvent = { target: HTMLElement | null };
export type AxisGridResizeEvent = { target: HTMLElement | null };
export type AxisGridRotateEvent = { target: HTMLElement | null; degrees: number };

export type AxisGridProps = ReactTypes.UnknownProps;

export type AxisGridRef = {
  select: (layer: HTMLElement) => void;
  deselect: () => void;
};
