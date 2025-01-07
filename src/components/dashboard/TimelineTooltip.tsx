import { format } from 'date-fns';

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="bg-black/90 border border-blue-500/20 rounded-lg p-3 shadow-xl min-w-[280px]">
      <h4 className="text-blue-300 font-medium mb-2 line-clamp-2">
        {payload[0]?.payload?.title || 'Event'}
      </h4>
      <div className="space-y-2 text-sm">
        <p className="text-white font-medium">
          {payload[0]?.value?.toLocaleString()} events
        </p>
        {payload[0]?.payload?.first_time_seen && (
          <p className="text-gray-400">
            First seen: {formatDate(payload[0].payload.first_time_seen)}
          </p>
        )}
        {payload[0]?.payload?.last_time_seen && (
          <p className="text-gray-400">
            Last seen: {formatDate(payload[0].payload.last_time_seen)}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineTooltip;