import { ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';
import Panel from '../Panel';

export interface ControlPanelProps extends Omit<ComponentPropsWithoutRefByBox<typeof Panel>, 'role' | 'placement'> {}
export type ControlPanelRef = HTMLDivElement;
