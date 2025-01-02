import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import EntityHeader from "./EntityHeader";
import EntityCard from "./EntityCard";
import { Alert } from "./types";
import { sanitizeEntityName } from "./utils";

interface UserData {
  user_impacted: string;
  total_events: number;
  unique_anomalies: number;
}

interface RiskyEntitiesProps {
  alerts: Alert[];
  type: "users" | "computers";
  onEntitySelect: (entityId: string) => void;
}

const RiskyEntities = ({ alerts, type, onEntitySelect }: RiskyEntitiesProps) => {
  const { data: originUsers, isLoading: isLoadingOrigin } = useQuery({
    queryKey: ['userOrigin'],
    queryFn: async () => {
      const response = await fetch('/api/user_origin');
      if (!response.ok) {
        throw new Error('Failed to fetch origin users');
      }
      const data = await response.json();
      console.log('Origin users:', data);
      return data.user_origin_logs || [];
    },
    enabled: type === "users"
  });

  const { data: impactedUsers, isLoading: isLoadingImpacted } = useQuery({
    queryKey: ['userImpacted'],
    queryFn: async () => {
      const response = await fetch('/api/user_impacted');
      if (!response.ok) {
        throw new Error('Failed to fetch impacted users');
      }
      const data = await response.json();
      console.log('Impacted users:', data);
      return data.user_impacted_logs || [];
    },
    enabled: type === "users"
  });

  const getUniqueEntities = () => {
    if (type === "users") {
      const combinedUsers = new Map<string, { id: string; eventCount: number; uniqueTitles: number }>();
      
      // Process impacted users if available
      if (impactedUsers?.length) {
        impactedUsers.forEach((user: UserData) => {
          if (!user.user_impacted || user.user_impacted.trim() === '') return;
          const entityId = sanitizeEntityName(user.user_impacted);
          
          combinedUsers.set(entityId, {
            id: entityId,
            eventCount: user.total_events,
            uniqueTitles: user.unique_anomalies
          });
        });
      }

      // Process origin users if available and merge with existing data
      if (originUsers?.length) {
        originUsers.forEach((user: UserData) => {
          if (!user.user_impacted || user.user_impacted.trim() === '') return;
          const entityId = sanitizeEntityName(user.user_impacted);
          
          if (combinedUsers.has(entityId)) {
            const existing = combinedUsers.get(entityId)!;
            combinedUsers.set(entityId, {
              ...existing,
              eventCount: existing.eventCount + user.total_events,
              uniqueTitles: Math.max(existing.uniqueTitles, user.unique_anomalies)
            });
          } else {
            combinedUsers.set(entityId, {
              id: entityId,
              eventCount: user.total_events,
              uniqueTitles: user.unique_anomalies
            });
          }
        });
      }

      return Array.from(combinedUsers.values());
    } else {
      // Handle computers case
      const entities = new Map<string, { id: string; eventCount: number; uniqueTitles: Set<string> }>();

      alerts.forEach((alert) => {
        const rawEntityId = alert.computer_name;
        if (!rawEntityId || rawEntityId.trim() === '') return;
        
        const entityId = sanitizeEntityName(rawEntityId);
        
        if (!entities.has(entityId)) {
          entities.set(entityId, {
            id: entityId,
            eventCount: 1,
            uniqueTitles: new Set([alert.title])
          });
        } else {
          const entity = entities.get(entityId)!;
          entity.eventCount++;
          if (alert.title) {
            entity.uniqueTitles.add(alert.title);
          }
        }
      });

      return Array.from(entities.values()).map(entity => ({
        ...entity,
        uniqueTitles: entity.uniqueTitles.size
      }));
    }
  };

  const entities = getUniqueEntities()
    .sort((a, b) => b.uniqueTitles - a.uniqueTitles);

  if (type === "users" && (isLoadingOrigin || isLoadingImpacted)) {
    return (
      <div className="space-y-4">
        <EntityHeader totalEntities={0} isLoading={true} type={type} />
        <div className="text-center text-purple-400/60 py-6 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EntityHeader 
        totalEntities={entities.length} 
        isLoading={isLoadingOrigin || isLoadingImpacted}
        type={type}
      />
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {entities?.map((entity) => (
            <EntityCard
              key={entity.id}
              id={entity.id}
              eventCount={entity.eventCount}
              uniqueTitles={entity.uniqueTitles}
              onClick={() => onEntitySelect(entity.id)}
            />
          ))}
          {(!entities || entities.length === 0) && (
            <div className="text-center text-blue-400/60 py-6 text-sm">
              No {type === "computers" ? "active computers" : "active users"} detected
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RiskyEntities;