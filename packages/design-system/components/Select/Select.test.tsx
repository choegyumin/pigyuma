import { render } from '@testing-library/react';
import React from 'react';
import Select from './Select';
import { SelectRef } from './types';

describe('<Select />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<Select />);
    const select = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(select).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<SelectRef>();
    const { container } = render(<Select ref={ref} />);
    const select = container.firstElementChild;

    expect(ref.current).toEqual(select);
  });
});
