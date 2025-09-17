import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChartsPage from '../pages/ChartsPage';
import { api } from '../services/api';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn(async () => ({
      line: { labels: ['D1','D2','D3'], series: [10, 20, 30] },
      bar: { labels: ['D1','D2','D3'], series: [5, 10, 15] },
      pie: { labels: ['A','B','C'], series: [40,30,30] },
    })),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

function renderCharts() {
  localStorage.setItem('token', 'test');
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/charts']}>
        <Routes>
          <Route path="/charts" element={<ChartsPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('ChartsPage rendering', () => {
  it('renders charts and updates on filter change', async () => {
    renderCharts();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(screen.getByText(/line \(chart\.js\)/i)).toBeInTheDocument();
    expect(screen.getByText(/bar \(chart\.js\)/i)).toBeInTheDocument();
    expect(screen.getByText(/pie \(chart\.js\)/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '30d' } });
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });

  it('shows error notification when API throws', async () => {
    api.get.mockRejectedValueOnce(new Error('Network down'));
    renderCharts();
    await waitFor(() => {
      expect(screen.getByText(/failed to load chart data|network down/i)).toBeInTheDocument();
    });
  });
});
