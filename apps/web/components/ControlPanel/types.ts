import { ComponentPropsByBox } from '@pigyuma/ui';
import Panel from '../Panel';

export type ControlPanelProps = Omit<ComponentPropsByBox<typeof Panel>, 'role' | 'placement'>;
export type ControlPanelRef = HTMLDivElement;
