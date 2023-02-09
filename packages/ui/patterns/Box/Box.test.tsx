import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import Box from './Box';

describe('<Box />', () => {
  test('should render correctly', () => {
    const { asFragment } = render(<Box />);
    expect(asFragment).toMatchSnapshot();
  });

  test('should render box to div element', () => {
    const { container } = render(<Box />);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('DIV');
    expect(box).toBeInstanceOf(HTMLDivElement);
  });

  test('should render box to span element', () => {
    const { container } = render(<Box as="span" />);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('SPAN');
    expect(box).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correct element', () => {
    const ref = React.createRef();
    const { container } = render(<Box ref={ref} />);
    const box = container.firstElementChild;

    expect(ref.current).toBe(box);
  });

  test('should pass props to element', async () => {
    const user = userEvent.setup();

    const onClick = vi.fn();
    const { container } = render(<Box className="class" data-test="data" onClick={onClick} />);
    const box = container.firstElementChild;

    if (box) {
      await user.click(box);
    }

    expect(box?.className).toBe('class');
    expect(box?.getAttribute('data-test')).toBe('data');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
