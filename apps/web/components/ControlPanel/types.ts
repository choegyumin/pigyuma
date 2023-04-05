import { ComponentPropsWithoutRefByBox } from '@pigyuma/design-system/primitives/Box';
import Panel from '../Panel';

export interface ControlPanelProps extends Omit<ComponentPropsWithoutRefByBox<typeof Panel>, 'role' | 'placement'> {}
export type ControlPanelRef = HTMLDivElement;
