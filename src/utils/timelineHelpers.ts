
import { Alert, EventSummary } from "@/components/dashboard/types";

export const getTimelineEntityType = (entityType: string) => {
  switch (entityType) {
    case 'computer':
      return 'computersimpacted';
    case 'userOrigin':
      return 'userorigin';
    case 'userImpacted':
      return 'userimpacted';
    default:
      return entityType;
  }
};

export const formatTimelineData = (data: any) => {
  return {
    computer_impacted_timeline: data.computer_impacted_timeline || [],
    user_impacted_timeline: data.user_impacted_timeline || [],
    user_origin_timeline: data.user_origin_timeline || [],
    pagination: {
      current_page: data.pagination?.current_page || 1,
      per_page: data.pagination?.per_page || 100,
      has_more: data.pagination?.has_more || false
    }
  };
};

export const getTimelineEndpoint = (entityType: string) => {
  switch (entityType) {
    case 'userorigin':
      return '/api/user_origin_timeline';
    case 'userimpacted':
      return '/api/user_impacted_timeline';
    case 'computersimpacted':
      return '/api/computer_impacted_timeline';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
};
