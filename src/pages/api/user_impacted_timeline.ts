import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_impacted, timeframe = '24h' } = req.query;

  if (!user_impacted) {
    return res.status(400).json({ error: 'user_impacted is required' });
  }

  try {
    const timeInterval = timeframe === '7d' ? '7 DAY' : '24 HOUR';
    
    const query = `
      SELECT 
        target_user_name AS user_impacted,
        title,
        tags,
        description,
        MIN(system_time) AS first_time_seen,
        MAX(system_time) AS last_time_seen,
        COUNT(*) AS total_events,
        rule_level
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL ${timeInterval}
        AND target_user_name = ?
      GROUP BY
        target_user_name, title, tags, description, rule_level
      ORDER BY
        last_time_seen DESC
    `;

    const [rows] = await db.query(query, [user_impacted]);

    res.status(200).json({
      user_impacted_timeline: rows,
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