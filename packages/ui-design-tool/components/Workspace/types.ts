import { ShapeDrawingElement, TextDrawingElement } from '@/models';
import React from 'react';

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  data: Array<ShapeDrawingElement | TextDrawingElement>;
};
