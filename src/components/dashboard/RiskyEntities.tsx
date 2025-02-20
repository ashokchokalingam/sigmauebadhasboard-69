
import { Alert } from "./types";
import EntityHeader from "./EntityHeader";
import EntitySearchInput from "./EntitySearchInput";
import EntityList from "./EntityList";
import { useEntitySearch } from "./hooks/useEntitySearch";
import { useEntityData } from "./hooks/useEntityData";
import { getUniqueEntities } from "./utils/entityUtils";
import TimelineView from "./TimelineView";
import { useState } from "react";

interface RiskyEntitiesProps {
  alerts: Alert[];
  type: "users-origin" | "users-impacted" | "computers";
  onEntitySelect: (entityId: string) => void;
}

const RiskyEntities = ({ alerts, type, onEntitySelect }: RiskyEntitiesProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

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

  const handleEntityClick = (entityId: string) => {
    if (type === "users-impacted" || type === "users-origin") {
      console.log('Selected user:', entityId);
      setSelectedUser(entityId);
    }
    onEntitySelect(entityId);
  };

  const isLoading = type === "users-origin" ? isLoadingOrigin : 
                   type === "users-impacted" ? isLoadingImpacted : 
                   isLoadingComputers;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-blue-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (selectedUser) {
    const entityType = type === "users-origin" ? "userorigin" :
                      type === "users-impacted" ? "userimpacted" :
                      "computersimpacted";
                      
    return (
      <TimelineView
        entityType={entityType}
        entityId={selectedUser}
        onClose={() => setSelectedUser(null)}
        inSidebar={true}
      />
    );
  }

  return (
    <div className="space-y-4">
      <EntityHeader 
        totalEntities={entities.length} 
        isLoading={isLoading}
        type={type}
      />
      
      <EntitySearchInput
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <EntityList
        entities={filteredEntities}
        onEntitySelect={handleEntityClick}
      />
    </div>
  );
};

export default RiskyEntities;
