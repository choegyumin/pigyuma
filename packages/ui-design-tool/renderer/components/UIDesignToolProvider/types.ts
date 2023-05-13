import { UIDesignTool } from '@/api/UIDesignTool';

export interface UIDesignToolProviderProps
  extends React.PropsWithChildren<{
    api: UIDesignTool;
  }> {}

export type UIDesignToolProviderRef = unknown;
