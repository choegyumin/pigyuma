import { CanvasData } from '@/api/Canvas/model';

export interface UIDesignCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  initialData: CanvasData['children'];
}

export type UIDesignCanvasRef = HTMLDivElement;
