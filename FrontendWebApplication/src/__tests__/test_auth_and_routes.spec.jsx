import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock api layer to control login outcome
jest.mock('../services/api', () => ({
  api: {
    post: jest.fn(async (path, body) => {
      if (path === '/login' && body.email === 'admin@example.com' && body.password === 'secret123') {
        return { access_token: 'unit.test.token' };
      }
      const e = new Error('Invalid credentials');
      e.response = { status: 401, data: { detail: 'Invalid credentials' } };
      throw e;
    }),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

describe('Auth route protection and login form', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
  });

  it('redirects to /login when accessing protected root unauthenticated', () => {
    renderWithRouter(['/']);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('validates inputs and performs successful login', async () => {
    renderWithRouter(['/login']);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      // After login, app should mount dashboard; check presence of sidebar logout button
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'unit.test.token');
  });

  it('shows server error message when login fails', async () => {
    renderWithRouter(['/login']);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/login failed|invalid credentials/i)).toBeInTheDocument();
    });
  });
});
