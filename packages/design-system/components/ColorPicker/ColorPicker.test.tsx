import { render } from '@testing-library/react';
import React from 'react';
import ColorPicker from './ColorPicker';
import { ColorPickerRef } from './types';

describe('<ColorPicker />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<ColorPicker />);
    const colorPicker = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(colorPicker).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<ColorPickerRef>();
    const { container } = render(<ColorPicker ref={ref} />);
    const colorPicker = container.firstElementChild;

    expect(ref.current).toEqual(colorPicker);
  });
});
