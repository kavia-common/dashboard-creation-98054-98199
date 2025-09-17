import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#E87A41', '#16a34a', '#9333ea', '#f59e0b'];

// PUBLIC_INTERFACE
export default function PieChartWidget({ data, title = 'Pie Chart' }) {
  /** Renders a responsive pie chart. */
  const items = (data || []).map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));
  return (
    <div className="card">
      <div className="space-between">
        <strong>{title}</strong>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={items} dataKey="value" nameKey="label" outerRadius={90} label>
              {items.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
