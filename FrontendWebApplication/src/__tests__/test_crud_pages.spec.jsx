import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import UsersPage from '../pages/UsersPage';
import ReportsPage from '../pages/ReportsPage';
import { api } from '../services/api';

jest.mock('../services/api', () => {
  const items = {
    users: [{ id: 1, name: 'User 1', email: 'user1@example.com' }],
    reports: [{ id: 1, title: 'Report 1', status: 'open' }],
  };
  return {
    api: {
      get: jest.fn(async (path) => {
        if (path === '/users') return { items: items.users, total: 1 };
        if (path === '/reports') return { items: items.reports, total: 1 };
        return {};
      }),
      post: jest.fn(async (path, body) => ({ id: 2, ...body })),
      put: jest.fn(async (path, body) => ({ id: 1, ...body })),
      delete: jest.fn(async () => ({})),
    },
  };
});

function renderInAuth(children, initialEntries = ['/users']) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('UsersPage CRUD behavior', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test'); // simulate authenticated
  });

  it('renders list and allows creating a user with valid inputs', async () => {
    renderInAuth(<UsersPage />, ['/users']);
    await waitFor(() => expect(api.get).toHaveBeenCalled());

    // Try invalid submit
    fireEvent.click(screen.getByText(/save/i));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    // Fill and submit
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Jane' } }); // name
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/users', { name: 'Jane', email: 'jane@example.com' }));
    expect(screen.getByText(/user created/i)).toBeInTheDocument();
  });

  it('edits and deletes a user', async () => {
    renderInAuth(<UsersPage />, ['/users']);
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    const table = screen.getByRole('table');
    const firstRow = within(table).getAllByRole('row')[1];
    within(firstRow).getByText(/edit/i).click();

    // Update email
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), { target: { value: 'changed@example.com' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => expect(api.put).toHaveBeenCalled());
    expect(screen.getByText(/user updated/i)).toBeInTheDocument();

    // Delete
    // Mock confirm
    window.confirm = jest.fn(() => true);
    within(firstRow).getByText(/delete/i).click();
    await waitFor(() => expect(api.delete).toHaveBeenCalled());
    expect(screen.getByText(/user deleted/i)).toBeInTheDocument();
  });
});

describe('ReportsPage CRUD behavior', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test');
  });

  it('creates and edits a report with feedback', async () => {
    renderInAuth(<ReportsPage />, ['/reports']);
    await waitFor(() => expect(api.get).toHaveBeenCalled());

    fireEvent.click(screen.getByText(/save/i));
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/status is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Q4 Summary' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'closed' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/reports', { title: 'Q4 Summary', status: 'closed' }));
    expect(screen.getByText(/report created/i)).toBeInTheDocument();

    const table = screen.getByRole('table');
    const firstRow = within(table).getAllByRole('row')[1];
    within(firstRow).getByText(/edit/i).click();
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Q4 Updated' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => expect(api.put).toHaveBeenCalled());
    expect(screen.getByText(/report updated/i)).toBeInTheDocument();
  });
});
