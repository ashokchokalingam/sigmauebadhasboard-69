import React from 'react';
import { Alert } from "./types";
import AlertDetailsHeader from "./AlertDetails/AlertDetailsHeader";
import AlertDetailsContent from "./AlertDetails/AlertDetailsContent";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const browserTime = new Date(alert.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="h-full bg-[#1E1E2F] border-l border-[#7B68EE]/20">
      <AlertDetailsHeader onClose={onClose} />
      <div className="h-[calc(100%-4rem)] overflow-y-auto">
        <AlertDetailsContent alert={alert} browserTime={browserTime} />
      </div>
    </div>
  );
};

export default AlertDetailsView;