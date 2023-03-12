import { ComponentPropsWithoutRefByBox } from '@pigyuma/design-system/primitives';
import Panel from '../Panel';

export type ControlPanelProps = Omit<ComponentPropsWithoutRefByBox<typeof Panel>, 'role' | 'placement'>;
export type ControlPanelRef = HTMLDivElement;
