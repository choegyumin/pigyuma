export interface MouseStatus {
  clientX: number;
  clientY: number;
  offsetX: number;
  offsetY: number;
  down: boolean;
}

export interface KeyboardStatus {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export interface BrowserStatus {
  readonly mouse: MouseStatus;
  readonly keyboard: KeyboardStatus;
}
