import { render, screen } from '@testing-library/react';
import AppProvider from 'components/AppProvider';
import Home from './index.page';

describe('<Home />', () => {
  it('should render a heading', () => {
    render(
      <AppProvider>
        <Home />
      </AppProvider>,
    );
    const heading = screen.getByRole('heading', {
      name: 'choegyumin',
    });

    expect(heading).toBeInTheDocument();
  });
});
