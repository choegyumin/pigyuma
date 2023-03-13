import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/design-system/primitives/Box';
import { UIDesignCanvasProps } from '@pigyuma/ui-design-tool';

export type WorkspaceProps = ComponentPropsWithoutRefByBox<'div'> & UIDesignCanvasProps;

export type WorkspaceRef = ComponentElementRefByBox<'div'>;
