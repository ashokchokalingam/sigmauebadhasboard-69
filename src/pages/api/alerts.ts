import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 100;
  const offset = (page - 1) * per_page;

  try {
    const query = `
      SELECT *
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      ORDER BY system_time DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
    `;

    const [rows] = await db.query(query, [per_page, offset]);
    const [countResult] = await db.query(countQuery);
    const total = (countResult as any)[0].total;

    res.status(200).json({
      alerts: rows,
      pagination: {
        current_page: page,
        per_page,
        total_pages: Math.ceil(total / per_page),
        total_records: total
      },
      total_count: total
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}