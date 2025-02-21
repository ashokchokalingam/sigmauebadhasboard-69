
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateTimeUtils";
import TimelineDetailCard from "./TimelineDetailCard";
import TimelineRawLog from "./TimelineRawLog";
import { Alert } from "./types";

interface TimelineExpandedContentProps {
  log: any;
}

const TimelineExpandedContent = ({ log }: TimelineExpandedContentProps) => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="p-0">
        <div className="py-6 px-8 expanded-row border-b border-indigo-500/10">
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-4">
              <TimelineDetailCard
                header="System Time"
                value={formatDateTime(log.system_time || '', true)}
              />
              <TimelineDetailCard
                header="Risk Score"
                value={log.risk}
              />
              <TimelineDetailCard
                header="User ID"
                value={log.user_id}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <TimelineDetailCard
                header="Target User Name"
                value={log.target_user_name}
              />
              <TimelineDetailCard
                header="Target Domain Name"
                value={log.target_domain_name}
              />
              <TimelineDetailCard
                header="Task"
                value={log.task}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TimelineDetailCard
                header="Tactics"
                value={log.tactics}
              />
              <TimelineDetailCard
                header="Techniques"
                value={log.techniques}
              />
            </div>

            <TimelineDetailCard
              header="Description"
              value={log.description}
              className="whitespace-pre-wrap"
            />

            <TimelineDetailCard
              header="ML Description"
              value={log.ml_description}
              className="whitespace-pre-wrap"
            />

            <TimelineDetailCard
              header="Tags"
              value={log.tags}
            />

            {log.raw && <TimelineRawLog alert={log as Alert} />}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TimelineExpandedContent;
