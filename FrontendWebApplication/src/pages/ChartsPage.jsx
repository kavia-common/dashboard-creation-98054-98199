import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  LineElement, BarElement, ArcElement,
  CategoryScale, LinearScale, PointElement,
  Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { ResponsiveContainer, LineChart, Line as RLine, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend as RLegend, BarChart, Bar as RBar, PieChart, Pie as RPie, Cell } from 'recharts';
import '../App.css';

ChartJS.register(LineElement, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

/**
 * PUBLIC_INTERFACE
 * ChartsPage fetches chart data and renders Line, Bar, and Pie charts.
 */
export default function ChartsPage() {
  const [data, setData] = useState(null);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/charts/data', { range: filter });
      setData(resp);
    } catch (e) {
      setNotif({ type: 'error', message: e.message || 'Failed to load chart data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [filter]);

  const lineCfg = useMemo(() => {
    const labels = data?.line?.labels || [];
    const series = data?.line?.series || [];
    return {
      labels,
      datasets: [
        {
          label: 'Line Metric',
          data: series,
          borderColor: 'rgba(79, 140, 255, 1)',
          backgroundColor: 'rgba(79, 140, 255, 0.2)',
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };
  }, [data]);

  const barCfg = useMemo(() => {
    const labels = data?.bar?.labels || [];
    const series = data?.bar?.series || [];
    return {
      labels,
      datasets: [
        {
          label: 'Bar Metric',
          data: series,
          backgroundColor: 'rgba(49, 196, 141, 0.6)',
          borderColor: 'rgba(49, 196, 141, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [data]);

  const pieCfg = useMemo(() => {
    const labels = data?.pie?.labels || [];
    const series = data?.pie?.series || [];
    return {
      labels,
      datasets: [
        {
          label: 'Distribution',
          data: series,
          backgroundColor: ['#4f8cff', '#31c48d', '#f59e0b', '#ff6b6b', '#9aa4b2'].slice(0, series.length)
        }
      ]
    };
  }, [data]);

  const rechartsData = useMemo(() => {
    const labels = data?.line?.labels || [];
    const series = data?.line?.series || [];
    return labels.map((l, i) => ({ name: l, value: series[i] || 0 }));
  }, [data]);

  const colors = ['#4f8cff', '#31c48d', '#f59e0b', '#ff6b6b', '#9aa4b2'];

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="toolbar">
        <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button className="btn ghost" onClick={fetchData}>{loading ? <span className="loader" /> : 'Refresh'}</button>
      </div>

      {notif && <div className={`alert ${notif.type === 'error' ? 'error' : 'success'}`}>{notif.message}</div>}

      <div className="grid cols-3">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Line (Chart.js)</h3>
          <Line data={lineCfg} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Bar (Chart.js)</h3>
          <Bar data={barCfg} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Pie (Chart.js)</h3>
          <Pie data={pieCfg} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card" style={{ height: 320 }}>
          <h3 style={{ marginTop: 0 }}>Line (Recharts)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={rechartsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <RTooltip />
              <RLegend />
              <RLine type="monotone" dataKey="value" stroke="#4f8cff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ height: 320 }}>
          <h3 style={{ marginTop: 0 }}>Pie (Recharts)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <RPie data={rechartsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {rechartsData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
              </RPie>
              <RTooltip />
              <RLegend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
