import useEventListener from '@/src/useEventListener';
import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('useEventListener', () => {
  test('should bind event listener and call with event', async () => {
    const user = userEvent.setup();

    const listener = vi.fn<[MouseEvent], void>();
    renderHook(() => useEventListener(document.documentElement, 'click', listener));

    await user.click(document.documentElement);
    await user.click(document.body);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(expect.any(MouseEvent));
  });
});
