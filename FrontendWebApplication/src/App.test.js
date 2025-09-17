import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login heading', () => {
  render(<App />);
  const loginHeading = screen.getByText(/Welcome back/i);
  expect(loginHeading).toBeInTheDocument();
});
