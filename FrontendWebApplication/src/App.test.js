import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page initially (unauthenticated)', () => {
  render(<App />);
  const welcome = screen.getByText(/Welcome back/i);
  expect(welcome).toBeInTheDocument();
});
