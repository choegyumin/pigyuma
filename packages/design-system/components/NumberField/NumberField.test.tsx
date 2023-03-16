import { render } from '@testing-library/react';
import React from 'react';
import NumberField from './NumberField';
import { NumberFieldRef } from './types';

describe('<NumberField />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<NumberField />);
    const numberField = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(numberField).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<NumberFieldRef>();
    const { container } = render(<NumberField ref={ref} />);
    const numberField = container.firstElementChild;

    expect(ref.current).toEqual(numberField);
  });
});
