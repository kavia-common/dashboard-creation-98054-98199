import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// PUBLIC_INTERFACE
export default function BarChartWidget({ data, title = 'Bar Chart' }) {
  /** Renders a responsive bar chart. */
  return (
    <div className="card">
      <div className="space-between">
        <strong>{title}</strong>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#E87A41" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
