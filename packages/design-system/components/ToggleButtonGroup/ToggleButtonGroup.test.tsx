import { render } from '@testing-library/react';
import React from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import { ToggleButtonGroupRef } from './types';

describe('<ToggleButtonGroup />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<ToggleButtonGroup />);
    const toggleButtonGroup = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(toggleButtonGroup).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<ToggleButtonGroupRef>();
    const { container } = render(<ToggleButtonGroup ref={ref} />);
    const toggleButtonGroup = container.firstElementChild;

    expect(ref.current).toEqual(toggleButtonGroup);
  });
});
