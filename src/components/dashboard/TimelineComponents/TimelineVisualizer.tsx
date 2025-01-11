import { useState } from 'react';
import { Alert } from '../types';
import MitreAttackModal from '../MitreAttackModal';
import { ExternalLink } from 'lucide-react';

interface TimelineVisualizerProps {
  events: Alert[];
}

const TimelineVisualizer = ({ events }: TimelineVisualizerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-black/40 rounded-lg p-6 border border-blue-500/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-blue-100">Attack Timeline</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 text-base font-semibold rounded-full 
            bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white shadow-lg 
            hover:from-purple-600/90 hover:to-blue-600/90 
            transition-all duration-300 hover:scale-105 hover:shadow-xl
            border border-white/20 backdrop-blur-sm group"
        >
          <span>MITRE ATT&CK</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <MitreAttackModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        events={events}
      />
    </div>
  );
};

export default TimelineVisualizer;