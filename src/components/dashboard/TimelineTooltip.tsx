import { format } from 'date-fns';

const TimelineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd, yyyy HH:mm');
  };

  const data = payload[0]?.payload;

  return (
    <div className="bg-black/95 border border-blue-500/20 rounded-lg p-4 shadow-xl min-w-[320px] max-w-[400px]">
      <h4 className="text-blue-300 font-medium mb-2 text-base">
        {data?.title || 'Event'}
      </h4>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-white font-medium text-base mb-1">
            {payload[0]?.value?.toLocaleString()} events
          </p>
          <p className="text-blue-200/90">
            {data?.description}
          </p>
        </div>
        
        <div className="pt-2 border-t border-blue-500/20">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400 text-xs">First seen:</p>
              <p className="text-white">
                {data?.first_time_seen ? formatDate(data.first_time_seen) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Last seen:</p>
              <p className="text-white">
                {data?.last_time_seen ? formatDate(data.last_time_seen) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {data?.tags && (
          <div className="pt-2 border-t border-blue-500/20">
            <p className="text-gray-400 text-xs mb-1">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {data.tags.split(',').map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineTooltip;