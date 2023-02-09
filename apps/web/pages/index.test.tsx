import { render, screen, waitFor } from '@testing-library/react';
import AppProvider from '~/components/AppProvider';
import Home from './index.page';

describe('<Home />', () => {
  test('should render heading', async () => {
    await waitFor(() =>
      render(
        <AppProvider>
          <Home />
        </AppProvider>,
      ),
    );

    const heading = await waitFor(() =>
      screen.getByRole('heading', {
        name: 'Pigyuma',
      }),
    );

    expect(heading).toBeInTheDocument();
  });
});
