import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders a button', () => {
    const text = 'DUMMY';

    render(<Button>{text}</Button>);

    const button = screen.getByText(text);

    expect(button).toBeInTheDocument();
  });
});
