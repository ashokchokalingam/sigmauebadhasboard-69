export const isWithinLastHour = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  return date >= hourAgo && date <= now;
};