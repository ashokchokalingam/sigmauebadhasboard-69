import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, timeframe = '24h' } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const timeInterval = timeframe === '7d' ? '7 DAY' : '24 HOUR';
    
    const query = `
      SELECT 
        user_id AS user_origin,
        title,
        tags,
        description,
        MIN(system_time) AS first_time_seen,
        MAX(system_time) AS last_time_seen,
        COUNT(*) AS total_events
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL ${timeInterval}
        AND user_id = ?
      GROUP BY
        user_id, title, tags, description
      ORDER BY
        last_time_seen DESC
    `;

    const [rows] = await db.query(query, [user_id]);
    
    console.log('User origin timeline query result:', {
      user_id,
      timeframe,
      resultCount: Array.isArray(rows) ? rows.length : 0
    });

    res.status(200).json({
      event_summary: rows,
      pagination: {
        current_page: 1,
        per_page: 1000,
        has_more: false
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}