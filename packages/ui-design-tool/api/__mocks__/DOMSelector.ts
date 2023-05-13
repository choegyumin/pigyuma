import { KeyboardStatus, MouseStatus } from '@/types/Browser';

interface DummyMouseStatusData extends Partial<MouseStatus> {
  x?: number;
  y?: number;
}

export function makeDummyMouseStatus(data: DummyMouseStatusData = {}): MouseStatus {
  const { x = 0, y = 0, ...rest } = data;
  return Object.assign(
    {
      clientX: x,
      clientY: y,
      offsetX: x,
      offsetY: y,
      down: false,
    },
    {
      ...rest,
    },
  );
}

export function makeDummyKeyboardStatus(data: Partial<KeyboardStatus> = {}): KeyboardStatus {
  return Object.assign(
    {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    },
    data,
  );
}
