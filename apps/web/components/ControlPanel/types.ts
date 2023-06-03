import Panel from '../Panel';

export const ControlPanelElementType = 'div';
export type ControlPanelElementType = typeof ControlPanelElementType;

export interface ControlPanelCustomProps {}

export interface ControlPanelProps
  extends React.ComponentPropsWithoutRef<ControlPanelElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel>, 'role' | 'placement'>,
    ControlPanelCustomProps {}
export type ControlPanelRefInstance = React.ElementRef<ControlPanelElementType>;
