
import { Alert } from "../types";
import DetailsTable from "./DetailsTable";
import LogsTable from "./LogsTable";

interface ExpandedContentProps {
  event: Alert;
  logsData: any;
  isLoading: boolean;
  error: Error | null;
}

const ExpandedContent = ({ event, logsData, isLoading, error }: ExpandedContentProps) => {
  console.log('ExpandedContent render:', {
    eventId: event.id,
    hasLogsData: !!logsData,
    isLoading,
    error
  });

  return (
    <div className="border-t border-purple-500/20 p-4">
      <DetailsTable event={event} />

      {isLoading ? (
        <div className="text-center py-4 text-purple-400">Loading logs...</div>
      ) : error ? (
        <div className="text-red-400 mt-4 text-center">
          Error loading logs. Please try again.
        </div>
      ) : logsData ? (
        <div className="mt-4">
          <h4 className="text-purple-400 font-medium mb-2">Related Logs</h4>
          <LogsTable logs={logsData} />
        </div>
      ) : null}
    </div>
  );
};

export default ExpandedContent;
