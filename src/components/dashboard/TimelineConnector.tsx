
import { cn } from "@/lib/utils";

interface TimelineConnectorProps {
  color: string;
  isLast?: boolean;
}

const TimelineConnector = ({ color, isLast }: TimelineConnectorProps) => {
  return (
    <>
      <div className={cn(
        "absolute left-0 top-8 -ml-[5px] h-3 w-3 rounded-full border-2",
        color,
        "bg-background"
      )} />
      {!isLast && (
        <div className={cn(
          "absolute left-0 top-8 -ml-[1px] h-full w-[2px]",
          "bg-gradient-to-b from-current to-transparent",
          color
        )} />
      )}
    </>
  );
};

export default TimelineConnector;
