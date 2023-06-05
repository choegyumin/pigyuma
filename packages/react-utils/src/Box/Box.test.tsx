import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import Box from './Box';

describe('<Box />', () => {
  test('should render box to div element', () => {
    const { container } = render(<Box />);
    const box = container.firstElementChild;

    expect(box).toBeInstanceOf(HTMLDivElement);
  });

  test('should render box to span element', () => {
    const { container } = render(<Box as="button" />);
    const box = container.firstElementChild;

    expect(box).toBeInstanceOf(HTMLButtonElement);
  });

  test('should render box to MyComponent element', () => {
    const MyComponent = () => <input />;
    const { container } = render(<Box as={MyComponent} />);
    const box = container.firstElementChild;

    expect(box).toBeInstanceOf(HTMLInputElement);
  });

  test('should ref is correct element', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<Box ref={ref} />);
    const box = container.firstElementChild;

    expect(ref.current).toBe(box);
  });

  test('should pass props to element', async () => {
    const user = userEvent.setup();

    const onClick = vi.fn();
    const { container } = render(<Box className="class" data-attribute="data" onClick={onClick} />);
    const box = container.firstElementChild;

    if (box) {
      await user.click(box);
    }

    expect(box?.className).toBe('class');
    expect(box?.getAttribute('data-attribute')).toBe('data');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
