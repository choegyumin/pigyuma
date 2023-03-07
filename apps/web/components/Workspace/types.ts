import { UIDesignCanvasProps } from '@pigyuma/ui-design-tool';
import { ComponentPropsByBox, ComponentRefByBox } from '@pigyuma/ui/patterns';

export type WorkspaceProps = ComponentPropsByBox<'div'> & UIDesignCanvasProps;

export type WorkspaceRef = ComponentRefByBox<'div'>;
