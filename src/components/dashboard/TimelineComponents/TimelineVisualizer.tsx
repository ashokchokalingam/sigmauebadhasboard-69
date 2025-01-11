import { useState } from 'react';
import { Alert } from '../types';

interface TimelineVisualizerProps {
  events: Alert[];
}

const TimelineVisualizer = ({ events }: TimelineVisualizerProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Group events by tactic
  const eventsByTactic = events.reduce((acc, event) => {
    const tactics = event.tags
      ?.split(',')
      .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
      .map(tag => tag.replace('attack.', ''))
      .map(tactic => tactic.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '));

    tactics?.forEach(tactic => {
      if (!acc[tactic]) {
        acc[tactic] = [];
      }
      acc[tactic].push(event);
    });

    return acc;
  }, {} as Record<string, Alert[]>);

  const tactics = [
    'Reconnaissance',
    'Resource Development',
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command And Control',
    'Exfiltration',
    'Impact',
    'Other'
  ];

  const getEventColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="bg-black/40 rounded-lg p-6 border border-blue-500/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-blue-100">Attack Timeline</h3>
        <button
          onClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)}
          className="px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
        >
          Reset Zoom
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {tactics.map(tactic => (
            <div key={tactic} className="grid grid-cols-[200px,1fr] gap-4 border-b border-blue-500/10 py-2">
              <div className="text-sm text-blue-300/70">{tactic}</div>
              <div className="relative h-8">
                {eventsByTactic[tactic]?.map((event, index) => (
                  <div
                    key={`${event.id}-${index}`}
                    className={`absolute top-1/2 -translate-y-1/2 h-6 px-3 rounded flex items-center justify-center 
                      ${getEventColor(event.severity)} text-white text-xs cursor-pointer transform hover:scale-105 
                      transition-all duration-300 whitespace-nowrap overflow-hidden`}
                    style={{
                      left: `${(new Date(event.timestamp).getHours() - 12) * 100}px`,
                      minWidth: '150px'
                    }}
                    onClick={() => window.open(event.url, '_blank')}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[200px,1fr] gap-4 mt-2">
            <div></div>
            <div className="flex justify-between text-xs text-blue-300/50">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i}>{13 + i}:00</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineVisualizer;