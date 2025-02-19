import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SeverityChartProps {
  data: { severity: string; count: number }[];
}

const SeverityChart = ({ data }: SeverityChartProps) => {
  const getBarColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return '#ea384c';
      case 'medium':
        return '#F97316';
      case 'low':
        return '#28c76f';
      default:
        return '#0FA0CE';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="severity" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar dataKey="count" fill="#8884d8"
          label={{ position: 'top', fill: '#fff' }}
          formatter={(value) => new Intl.NumberFormat().format(value)}
        >
          {
            data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="count" fill={getBarColor(entry.severity)} />
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SeverityChart;
