
import { useSearchParams } from 'react-router-dom';
import AlertDetailsView from './AlertDetailsView';
import { useQuery } from '@tanstack/react-query';
import { Alert } from './types';

interface LogsResponse {
  user_origin_logs: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_records: number;
    has_more: boolean;
  };
}

const AlertDetailsWindow = () => {
  const [searchParams] = useSearchParams();
  const user_origin = searchParams.get('user_origin');
  const title = searchParams.get('title');
  const id = searchParams.get('id');

  const { data: logsData, isLoading } = useQuery<LogsResponse>({
    queryKey: [`logs-${id}`],
    queryFn: async () => {
      const params = new URLSearchParams({
        user_origin: user_origin || '',
        title: title || ''
      });
      
      const response = await fetch(`/api/user_origin_logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return response.json();
    },
    enabled: !!user_origin && !!title,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5
  });

  const handleClose = () => {
    window.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!logsData?.user_origin_logs?.[0]) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        No data found
      </div>
    );
  }

  return (
    <div className="h-screen">
      <AlertDetailsView 
        alert={logsData.user_origin_logs[0]} 
        onClose={handleClose}
      />
    </div>
  );
};

export default AlertDetailsWindow;
