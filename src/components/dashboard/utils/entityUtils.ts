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
  type: "users-origin" | "users-impacted" | "computers",
  impactedUsers?: any[],
  originUsers?: any[],
  impactedComputers?: any[]
): EntityData[] => {
  if (type === "users-origin" && originUsers?.length) {
    return originUsers.map(user => ({
      id: sanitizeEntityName(user.user_origin),
      eventCount: 0,
      uniqueTitles: user.unique_titles || 0
    })).filter(user => user.id && user.id.trim() !== '');
  }
  
  if (type === "users-impacted" && impactedUsers?.length) {
    return impactedUsers.map(user => ({
      id: sanitizeEntityName(user.user_impacted),
      eventCount: 0,
      uniqueTitles: user.unique_titles || 0
    })).filter(user => user.id && user.id.trim() !== '');
  }
  
  if (type === "computers" && impactedComputers?.length) {
    return impactedComputers.map(computer => ({
      id: computer.computer_name,
      eventCount: 0,
      uniqueTitles: computer.unique_titles || 0
    })).filter(computer => computer.id && computer.id.trim() !== '');
  }
  
  return [];
};