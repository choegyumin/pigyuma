import { UIDesignCanvasProps } from '@pigyuma/ui-design-tool';
import React from 'react';

export const WorkspaceElementType = 'div';
export type WorkspaceElementType = typeof WorkspaceElementType;

export interface WorkspaceCustomProps extends Pick<UIDesignCanvasProps, 'initialData'> {}

export interface WorkspaceProps extends React.ComponentPropsWithoutRef<WorkspaceElementType>, WorkspaceCustomProps {}
export type WorkspaceRefInstance = React.ElementRef<WorkspaceElementType>;
