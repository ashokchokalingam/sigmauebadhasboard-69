import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, page = 1, timeframe = '24h' } = req.query;
  const perPage = 5000;
  const offset = (Number(page) - 1) * perPage;

  try {
    let timeCondition = '';
    switch (timeframe) {
      case '24h':
        timeCondition = 'AND system_time >= NOW() - INTERVAL 24 HOUR';
        break;
      case '7d':
        timeCondition = 'AND system_time >= NOW() - INTERVAL 7 DAY';
        break;
      case '30d':
        timeCondition = 'AND system_time >= NOW() - INTERVAL 30 DAY';
        break;
      default:
        timeCondition = 'AND system_time >= NOW() - INTERVAL 24 HOUR';
    }

    const query = `
      SELECT *
      FROM sigma_alerts
      WHERE user_id = ?
      ${timeCondition}
      ORDER BY system_time DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(query, [user_id, perPage, offset]);
    
    console.log('User origin timeline query result:', {
      user_id,
      timeframe,
      page,
      resultCount: Array.isArray(rows) ? rows.length : 0
    });

    res.status(200).json({
      user_origin_timeline_logs: rows,
      pagination: {
        current_page: Number(page),
        per_page: perPage,
        has_more: Array.isArray(rows) && rows.length === perPage
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}