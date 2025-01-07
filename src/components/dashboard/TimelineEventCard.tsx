import React, { useState } from 'react';
import { Alert } from './types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TimelineDetailedLogs from './TimelineDetailedLogs';
import EventTimeBarChart from './EventTimeBarChart';
import { format } from 'date-fns';

interface TimelineEventCardProps {
  event: Alert;
  isLast?: boolean;
}

const TimelineEventCard = ({ event, isLast = false }: TimelineEventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div 
        className={`
          relative z-10 bg-sidebar border border-sidebar-border rounded-lg 
          overflow-hidden transition-all duration-200 ease-in-out
          ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}
        `}
      >
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-sidebar-foreground">
              {event.title}
            </h3>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-sidebar-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-sidebar-foreground" />
            )}
          </div>
          
          <div className="mt-2 text-sm text-sidebar-foreground/80">
            {event.description}
          </div>

          <div className="mt-4">
            <EventTimeBarChart event={event} />
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-sidebar-foreground/60">
            <span>Event Time: {format(new Date(event.system_time), 'MMM d, yyyy HH:mm:ss')}</span>
            {event.first_time_seen && (
              <span>First Seen: {format(new Date(event.first_time_seen), 'MMM d, yyyy HH:mm:ss')}</span>
            )}
            {event.last_time_seen && (
              <span>Last Seen: {format(new Date(event.last_time_seen), 'MMM d, yyyy HH:mm:ss')}</span>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-sidebar-border">
            <TimelineDetailedLogs 
              logs={[event]}
              isLoading={false}
              totalRecords={1}
            />
          </div>
        )}
      </div>

      {!isLast && (
        <div className="absolute left-6 top-[100%] w-px h-6 bg-sidebar-border z-0" />
      )}
    </div>
  );
};

export default TimelineEventCard;