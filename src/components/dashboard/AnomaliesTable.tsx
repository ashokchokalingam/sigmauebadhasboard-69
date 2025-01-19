import { Card } from "@/components/ui/card";
import { Alert } from "./types";
import ChronoGrid from "./ChronoGrid";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  return (
    <Card className="border-blue-500/10">
      <ChronoGrid 
        alerts={alerts}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
      />
    </Card>
  );
};

export default AnomaliesTable;