export interface UserData {
  user_origin?: string;
  user_impacted?: string;
  unique_titles: number;
}

export interface ComputerData {
  computer_name: string;
  unique_titles: number;
}

export interface EntityData {
  id: string;
  eventCount: number;
  uniqueTitles: number;
}