import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { entityType, entityId, timeframe = '24h' } = req.query;
  
  if (!entityType || !entityId) {
    return res.status(400).json({ error: "entityType and entityId are required" });
  }

  try {
    const timeInterval = timeframe === '7d' ? '7 DAY' : '24 HOUR';
    let query = '';
    
    if (entityType === 'user') {
      // Query for both user origin and user impacted events
      query = `
        (SELECT 
          'origin' as event_type,
          user_id,
          title,
          tags,
          description,
          rule_level,
          system_time,
          computer_name
        FROM sigma_alerts
        WHERE user_id = ?
        AND system_time >= NOW() - INTERVAL ${timeInterval})
        UNION ALL
        (SELECT 
          'impacted' as event_type,
          target_user_name as user_id,
          title,
          tags,
          description,
          rule_level,
          system_time,
          computer_name
        FROM sigma_alerts
        WHERE target_user_name = ?
        AND system_time >= NOW() - INTERVAL ${timeInterval})
        ORDER BY system_time DESC
      `;
      
      const [rows] = await db.query(query, [entityId, entityId]);
      
      return res.status(200).json({
        logs: rows,
        pagination: {
          current_page: 1,
          per_page: 1000,
          has_more: false
        }
      });
    } else if (entityType === 'computer') {
      query = `
        SELECT 
          computer_name,
          title,
          tags,
          description,
          rule_level,
          system_time,
          user_id,
          target_user_name
        FROM sigma_alerts
        WHERE computer_name = ?
        AND system_time >= NOW() - INTERVAL ${timeInterval}
        ORDER BY system_time DESC
      `;
      
      const [rows] = await db.query(query, [entityId]);
      
      return res.status(200).json({
        logs: rows,
        pagination: {
          current_page: 1,
          per_page: 1000,
          has_more: false
        }
      });
    }

    return res.status(400).json({ error: "Invalid entity type" });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    return res.status(500).json({ error: "Failed to fetch timeline data" });
  }
}