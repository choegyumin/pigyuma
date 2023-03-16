import { render } from '@testing-library/react';
import React from 'react';
import { Square as Icon } from './Icon';
import { IconRef } from './types';

describe('<Icon />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<Icon />);
    const icon = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(icon).toBeInstanceOf(SVGElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<IconRef>();
    const { container } = render(<Icon ref={ref} />);
    const icon = container.firstElementChild;

    expect(ref.current).toEqual(icon);
  });
});
