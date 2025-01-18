import { useState } from 'react';
import { Alert } from '../types';
import MitreAttackModal from '../MitreAttackModal';

interface TimelineVisualizerProps {
  events: Alert[];
}

const TimelineVisualizer = ({ events }: TimelineVisualizerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-black/40 rounded-lg p-6 border border-blue-500/10">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 text-base font-semibold rounded-full 
            bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-pink-500/80 text-white 
            shadow-lg hover:shadow-xl hover:from-purple-600/90 hover:via-blue-600/90 hover:to-pink-600/90
            transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm"
        >
          MITRE ATT&CK Timeline
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