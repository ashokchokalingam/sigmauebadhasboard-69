import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { target_user_name, page = '1', timeframe = '24h' } = req.query;
  const per_page = 100;
  const offset = (parseInt(page as string) - 1) * per_page;

  if (!target_user_name) {
    return res.status(400).json({ error: 'target_user_name is required' });
  }

  try {
    const timeInterval = timeframe === '7d' ? '7 DAY' : '24 HOUR';
    
    const query = `
      SELECT *
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL ${timeInterval}
        AND target_user_name = ?
      ORDER BY system_time DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL ${timeInterval}
        AND target_user_name = ?
    `;

    const [rows] = await db.query(query, [target_user_name, per_page, offset]);
    const [countResult] = await db.query(countQuery, [target_user_name]);
    const total = (countResult as any)[0].total;

    res.status(200).json({
      user_impacted_timeline_logs: rows,
      pagination: {
        current_page: parseInt(page as string),
        per_page,
        total_pages: Math.ceil(total / per_page),
        total_records: total
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}