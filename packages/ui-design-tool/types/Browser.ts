export interface MouseMeta {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
}

export interface KeyboardMeta {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface BrowserMeta {
  readonly mouse: MouseMeta;
  readonly keyboard: KeyboardMeta;
}
