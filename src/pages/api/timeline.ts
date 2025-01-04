import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { entityType, entityId, page = 1 } = req.query;
  
  if (!entityType || !entityId) {
    return res.status(400).json({ error: "entityType and entityId are required" });
  }

  try {
    let endpoint = '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://172.16.0.75:5000';
    
    switch (entityType) {
      case 'user':
        // Try both user origin and impacted timelines
        const [originResponse, impactedResponse] = await Promise.all([
          fetch(`${baseUrl}/api/user_origin_timeline?user_id=${entityId}&page=${page}`),
          fetch(`${baseUrl}/api/user_impacted_timeline?target_user_name=${entityId}&page=${page}`)
        ]);

        const originData = await originResponse.json();
        const impactedData = await impactedResponse.json();

        // Combine and sort the results
        const combinedLogs = [
          ...(originData.user_origin_timeline_logs || []),
          ...(impactedData.user_impacted_timeline_logs || [])
        ].sort((a, b) => new Date(b.system_time).getTime() - new Date(a.system_time).getTime());

        return res.status(200).json({
          logs: combinedLogs,
          pagination: {
            current_page: Number(page),
            per_page: 5000,
            has_more: combinedLogs.length === 5000
          }
        });

      case 'computer':
        const computerResponse = await fetch(
          `${baseUrl}/api/computer_impacted_timeline?computer_name=${entityId}&page=${page}`
        );
        const computerData = await computerResponse.json();

        return res.status(200).json({
          logs: computerData.computer_impacted_timeline_logs || [],
          pagination: {
            current_page: Number(page),
            per_page: 5000,
            has_more: (computerData.computer_impacted_timeline_logs || []).length === 5000
          }
        });

      default:
        return res.status(400).json({ error: "Invalid entity type" });
    }
  } catch (error) {
    console.error('Timeline fetch error:', error);
    return res.status(500).json({ error: "Failed to fetch timeline data" });
  }
}