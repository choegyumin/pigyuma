import { render } from '@testing-library/react';
import React from 'react';
import TextField from './TextField';
import { TextFieldRef } from './types';

describe('<TextField />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<TextField />);
    const textField = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(textField).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<TextFieldRef>();
    const { container } = render(<TextField ref={ref} />);
    const textField = container.firstElementChild;

    expect(ref.current).toEqual(textField);
  });
});
