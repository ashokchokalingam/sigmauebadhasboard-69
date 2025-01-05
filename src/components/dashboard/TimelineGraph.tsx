import { Alert } from "./types";
import TimelineChartContainer from "./TimelineComponents/TimelineChartContainer";

interface TimelineGraphProps {
  alerts: Alert[];
}

const TimelineGraph = ({ alerts }: TimelineGraphProps) => {
  return <TimelineChartContainer alerts={alerts} />;
};

export default TimelineGraph;