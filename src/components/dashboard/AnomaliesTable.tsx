import React from 'react';
import { Alert } from './types';
import { Table } from '../ui/table';

interface AnomaliesTableProps {
  alerts: Alert[];
  hasMore: boolean;
  onLoadMore: () => void;
}

const AnomaliesTable: React.FC<AnomaliesTableProps> = ({ alerts, hasMore, onLoadMore }) => {
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
        {alerts.map((alert) => (
          <tr key={alert.id}>
            <td>{alert.title}</td>
            <td>{alert.description}</td>
            <td>{alert.rule_level}</td>
            <td>{new Date(alert.system_time).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
      {hasMore && (
        <tfoot>
          <tr>
            <td colSpan={4}>
              <button 
                onClick={onLoadMore}
                className="w-full py-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Load More
              </button>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
};

export default AnomaliesTable;