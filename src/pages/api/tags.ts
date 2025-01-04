import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `
      SELECT 
        tags,
        COUNT(*) as count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      GROUP BY tags
      ORDER BY count DESC
    `;

    const [rows] = await db.query(query);
    res.status(200).json({ tags: rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}