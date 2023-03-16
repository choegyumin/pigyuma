import { render } from '@testing-library/react';
import React from 'react';
import FieldTrigger from './FieldTrigger';
import { FieldTriggerRef } from './types';

describe('<FieldTrigger />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<FieldTrigger />);
    const fieldTrigger = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(fieldTrigger).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<FieldTriggerRef>();
    const { container } = render(<FieldTrigger ref={ref} />);
    const fieldTrigger = container.firstElementChild;

    expect(ref.current).toEqual(fieldTrigger);
  });
});
