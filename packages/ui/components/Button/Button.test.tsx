import { render } from '@testing-library/react';
import React from 'react';
import Button from './Button';

describe('<Button />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<Button />);
    const button = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  test('should ref is button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { container } = render(<Button ref={ref} />);
    const button = container.firstElementChild;

    expect(ref.current).toBe(button);
  });
});
