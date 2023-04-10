import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';
import { UIDesignCanvasProps } from '@pigyuma/ui-design-tool';

export interface WorkspaceProps extends ComponentPropsWithoutRefByBox<'div'>, UIDesignCanvasProps {}

export type WorkspaceRef = ComponentElementRefByBox<'div'>;
