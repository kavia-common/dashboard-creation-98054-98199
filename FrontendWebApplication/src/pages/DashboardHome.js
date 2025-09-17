import React, { useEffect, useState } from 'react';
import { getDashboardData, getChartData } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import LineChartWidget from '../components/charts/LineChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';

// PUBLIC_INTERFACE
export default function DashboardHome() {
  /** Overview page: loads metrics and renders charts. */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState({ line: [], bar: [], pie: [] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [dash, ch] = await Promise.all([getDashboardData(), getChartData()]);
        if (!mounted) return;
        setMetrics(dash?.metrics || { users: 0, reports: 0 });
        setCharts({
          line: ch?.line || [],
          bar: ch?.bar || [],
          pie: ch?.pie || [],
        });
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="space-between">
        <h2>Overview</h2>
      </div>

      {loading && <Loader text="Loading dashboard..." />}
      <ErrorMessage error={error} />

      {metrics && (
        <div className="row mt-4" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div className="card" style={{ minWidth: 220 }}>
            <strong>Total Users</strong>
            <div className="mt-2" style={{ fontSize: 28 }}>{metrics.users}</div>
          </div>
          <div className="card" style={{ minWidth: 220 }}>
            <strong>Total Reports</strong>
            <div className="mt-2" style={{ fontSize: 28 }}>{metrics.reports}</div>
          </div>
        </div>
      )}

      <div className="row mt-4" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <LineChartWidget title="Traffic (Last 30 days)" data={charts.line} />
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <BarChartWidget title="Category Breakdown" data={charts.bar} />
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <PieChartWidget title="Share by Segment" data={charts.pie} />
        </div>
      </div>
    </div>
  );
}
