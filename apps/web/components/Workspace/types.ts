import { ComponentPropsByBox, ComponentRefByBox } from '@pigyuma/design-system/patterns';
import { UIDesignCanvasProps } from '@pigyuma/ui-design-tool';

export type WorkspaceProps = ComponentPropsByBox<'div'> & UIDesignCanvasProps;

export type WorkspaceRef = ComponentRefByBox<'div'>;
