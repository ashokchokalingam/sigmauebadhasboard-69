import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { computer_name, timeframe = '24h' } = req.query;

  if (!computer_name) {
    return res.status(400).json({ error: 'computer_name is required' });
  }

  try {
    const timeInterval = timeframe === '7d' ? '7 DAY' : '24 HOUR';
    
    const query = `
      SELECT 
        computer_name,
        title,
        tags,
        description,
        MIN(system_time) AS first_time_seen,
        MAX(system_time) AS last_time_seen,
        COUNT(*) AS total_events
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL ${timeInterval}
        AND computer_name = ?
      GROUP BY
        computer_name, title, tags, description
      ORDER BY
        last_time_seen DESC
    `;

    const [rows] = await db.query(query, [computer_name]);

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