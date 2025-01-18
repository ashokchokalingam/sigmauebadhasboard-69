import { ScrollArea } from "@/components/ui/scroll-area";
import EntityCard from "./EntityCard";

interface EntityListProps {
  entities: Array<{
    id: string;
    eventCount: number;
    uniqueTitles: number;
    total_unique_risk_score?: string;
  }>;
  onEntitySelect: (entityId: string) => void;
}

const EntityList = ({ entities, onEntitySelect }: EntityListProps) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="flex flex-col space-y-2">
        {entities?.map((entity) => (
          <EntityCard
            key={entity.id}
            id={entity.id}
            eventCount={entity.eventCount}
            uniqueTitles={entity.uniqueTitles}
            riskScore={entity.total_unique_risk_score}
            onClick={() => onEntitySelect(entity.id)}
          />
        ))}
        {(!entities || entities.length === 0) && (
          <div className="text-center text-blue-400/60 py-6 text-sm">
            No entities found
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default EntityList;