import React from 'react';
import { Alert } from '../types';
import { Table } from '../ui/table';

interface AnomaliesTableProps {
  anomalies: Alert[];
  onRowClick: (anomaly: Alert) => void;
}

const AnomaliesTable: React.FC<AnomaliesTableProps> = ({ anomalies, onRowClick }) => {
  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>, anomaly: Alert) => {
    e.preventDefault();
    onRowClick(anomaly);
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Severity</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {anomalies.map((anomaly) => (
          <tr key={anomaly.id} onClick={(e) => handleRowClick(e, anomaly)}>
            <td>{anomaly.title}</td>
            <td>{anomaly.description}</td>
            <td>{anomaly.rule_level}</td>
            <td>{new Date(anomaly.system_time).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AnomaliesTable;
