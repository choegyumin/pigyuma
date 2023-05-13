import { ExtendedGetters, UIDesignTool as _UIDesignTool, UIDesignToolConstructor as _UIDesignToolConstructor } from './RawUIDesignTool';

export type { UIDesignToolConfig } from './RawUIDesignTool';

export interface UIDesignToolConstructor {
  new (...args: ConstructorParameters<_UIDesignToolConstructor>): UIDesignTool;
}

// Getter 변수들의 타입(Generic, Overload, ...)을 유지하기 위함
export const UIDesignTool: UIDesignToolConstructor = _UIDesignTool as unknown as UIDesignToolConstructor;
export interface UIDesignTool extends Omit<_UIDesignTool, keyof ExtendedGetters>, ExtendedGetters {}
