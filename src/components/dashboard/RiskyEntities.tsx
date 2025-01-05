import { Alert } from "./types";
import EntityHeader from "./EntityHeader";
import EntitySearchInput from "./EntitySearchInput";
import EntityList from "./EntityList";
import { useEntitySearch } from "./hooks/useEntitySearch";
import { useEntityData } from "./hooks/useEntityData";
import { getUniqueEntities } from "./utils/entityUtils";

interface RiskyEntitiesProps {
  alerts: Alert[];
  type: "users" | "computers";
  onEntitySelect: (entityId: string) => void;
}

const RiskyEntities = ({ alerts, type, onEntitySelect }: RiskyEntitiesProps) => {
  const {
    originUsers,
    impactedUsers,
    impactedComputers,
    isLoadingOrigin,
    isLoadingImpacted,
    isLoadingComputers
  } = useEntityData(type);

  const entities = getUniqueEntities(
    type,
    impactedUsers,
    originUsers,
    impactedComputers
  ).sort((a, b) => b.uniqueTitles - a.uniqueTitles);

  const { searchQuery, setSearchQuery, filteredEntities } = useEntitySearch(entities);

  if (type === "users" && (isLoadingOrigin || isLoadingImpacted)) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-blue-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (type === "computers" && isLoadingComputers) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-blue-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EntityHeader 
        totalEntities={entities.length} 
        isLoading={isLoadingOrigin || isLoadingImpacted || isLoadingComputers}
        type={type}
      />
      
      <EntitySearchInput
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <EntityList
        entities={filteredEntities}
        onEntitySelect={onEntitySelect}
      />
    </div>
  );
};

export default RiskyEntities;