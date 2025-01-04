import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `
      SELECT 
        target_user_name,
        COUNT(DISTINCT id) as anomaly_count
      FROM sigma_alerts
      WHERE 
        system_time >= NOW() - INTERVAL 24 HOUR
        AND target_user_name IS NOT NULL
      GROUP BY target_user_name
      ORDER BY anomaly_count DESC
      LIMIT 50
    `;

    const [rows] = await db.query(query);
    res.status(200).json({ users: rows });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}