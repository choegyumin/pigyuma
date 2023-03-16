import { render } from '@testing-library/react';
import React from 'react';
import RadioButtonGroup from './RadioButtonGroup';
import { RadioButtonGroupRef } from './types';

describe('<RadioButtonGroup />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<RadioButtonGroup />);
    const radioButtonGroup = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(radioButtonGroup).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<RadioButtonGroupRef>();
    const { container } = render(<RadioButtonGroup ref={ref} />);
    const radioButtonGroup = container.firstElementChild;

    expect(ref.current).toEqual(radioButtonGroup);
  });
});
