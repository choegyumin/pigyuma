import { render } from '@testing-library/react';
import React from 'react';
import TextArea from './TextArea';
import { TextAreaRef } from './types';

describe('<TextArea />', () => {
  test('should render correctly', () => {
    const { asFragment, container } = render(<TextArea />);
    const textArea = container.firstElementChild;

    expect(asFragment).toMatchSnapshot();
    expect(textArea).toBeInstanceOf(HTMLSpanElement);
  });

  test('should ref is correctly', () => {
    const ref = React.createRef<TextAreaRef>();
    const { container } = render(<TextArea ref={ref} />);
    const textArea = container.firstElementChild;

    expect(ref.current).toEqual(textArea);
  });
});
