import { render } from '@testing-library/react';
import Box from './Box';

describe('<Box />', () => {
  it('should render a box to div', () => {
    const { container } = render(<Box>children</Box>);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('DIV');
  });

  it('should render a box to button', () => {
    const { container } = render(<Box as="button">children</Box>);
    const box = container.firstElementChild;

    expect(box?.tagName).toBe('BUTTON');
  });
});
