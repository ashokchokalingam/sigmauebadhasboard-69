import { UserData, ComputerData, EntityData } from "../types/entity";
import { sanitizeEntityName } from "../utils";

export const normalizeComputerName = (name: string): string => {
  return name.replace(/\s+/g, '');
};

export const aggregateComputerData = (computers: ComputerData[]): ComputerData[] => {
  const computerMap = new Map<string, ComputerData>();
  
  computers?.forEach((computer) => {
    const normalizedName = normalizeComputerName(computer.computer_name);
    
    if (computerMap.has(normalizedName)) {
      const existing = computerMap.get(normalizedName)!;
      computerMap.set(normalizedName, {
        computer_name: normalizedName,
        unique_titles: Math.max(existing.unique_titles, computer.unique_titles)
      });
    } else {
      computerMap.set(normalizedName, {
        computer_name: normalizedName,
        unique_titles: computer.unique_titles
      });
    }
  });

  return Array.from(computerMap.values());
};

export const getUniqueEntities = (
  type: "users" | "computers",
  impactedUsers?: any[],
  originUsers?: any[],
  impactedComputers?: any[]
): EntityData[] => {
  if (type === "users") {
    const combinedUsers = new Map<string, EntityData>();
    
    if (impactedUsers?.length) {
      impactedUsers.forEach((user) => {
        if (!user.user_impacted || user.user_impacted.trim() === '') return;
        const entityId = sanitizeEntityName(user.user_impacted);
        
        combinedUsers.set(entityId, {
          id: entityId,
          eventCount: 0,
          uniqueTitles: user.unique_titles || 0
        });
      });
    }

    if (originUsers?.length) {
      originUsers.forEach((user) => {
        if (!user.user_origin || user.user_origin.trim() === '') return;
        const entityId = sanitizeEntityName(user.user_origin);
        
        if (combinedUsers.has(entityId)) {
          const existing = combinedUsers.get(entityId)!;
          combinedUsers.set(entityId, {
            ...existing,
            uniqueTitles: Math.max(existing.uniqueTitles, user.unique_titles || 0)
          });
        } else {
          combinedUsers.set(entityId, {
            id: entityId,
            eventCount: 0,
            uniqueTitles: user.unique_titles || 0
          });
        }
      });
    }

    return Array.from(combinedUsers.values());
  } else {
    if (impactedComputers) {
      return impactedComputers.map(computer => ({
        id: computer.computer_name,
        eventCount: 0,
        uniqueTitles: computer.unique_titles || 0
      }));
    }
    return [];
  }
};