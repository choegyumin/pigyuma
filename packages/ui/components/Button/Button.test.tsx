import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('<Button />', () => {
  test('should render a button', () => {
    const text = 'children';

    render(<Button>{text}</Button>);
    const button = screen.getByText(text);

    expect(button).toBeInTheDocument();
  });
});
