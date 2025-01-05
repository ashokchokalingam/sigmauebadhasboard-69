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
  impactedUsers?: UserData[],
  originUsers?: UserData[],
  impactedComputers?: ComputerData[]
): EntityData[] => {
  if (type === "users") {
    const combinedUsers = new Map<string, EntityData>();
    
    if (impactedUsers?.length) {
      impactedUsers.forEach((user: UserData) => {
        if (!user.user_impacted || user.user_impacted.trim() === '') return;
        const entityId = sanitizeEntityName(user.user_impacted);
        
        combinedUsers.set(entityId, {
          id: entityId,
          eventCount: 0,
          uniqueTitles: user.unique_titles
        });
      });
    }

    if (originUsers?.length) {
      originUsers.forEach((user: UserData) => {
        if (!user.user_origin || user.user_origin.trim() === '') return;
        const entityId = sanitizeEntityName(user.user_origin);
        
        if (combinedUsers.has(entityId)) {
          const existing = combinedUsers.get(entityId)!;
          combinedUsers.set(entityId, {
            ...existing,
            uniqueTitles: Math.max(existing.uniqueTitles, user.unique_titles)
          });
        } else {
          combinedUsers.set(entityId, {
            id: entityId,
            eventCount: 0,
            uniqueTitles: user.unique_titles
          });
        }
      });
    }

    return Array.from(combinedUsers.values());
  } else {
    if (impactedComputers) {
      const aggregatedComputers = aggregateComputerData(impactedComputers);
      return aggregatedComputers.map(computer => ({
        id: computer.computer_name,
        eventCount: 0,
        uniqueTitles: computer.unique_titles
      }));
    }
    return [];
  }
};