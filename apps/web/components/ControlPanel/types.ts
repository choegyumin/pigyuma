import { ComponentPropsByBox } from '@pigyuma/design-system/patterns';
import Panel from '../Panel';

export type ControlPanelProps = Omit<ComponentPropsByBox<typeof Panel>, 'role' | 'placement'>;
export type ControlPanelRef = HTMLDivElement;
