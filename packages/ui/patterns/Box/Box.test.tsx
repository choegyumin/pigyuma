import { render } from '@testing-library/react';
import Box from './Box';

describe('<Box />', () => {
  test('should render a box to div', () => {
    const { container } = render(<Box>children</Box>);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('DIV');
  });

  test('should render a box to button', () => {
    const { container } = render(<Box as="button">children</Box>);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('BUTTON');
  });
});
