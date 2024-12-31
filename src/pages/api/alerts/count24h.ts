import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const query = `
      SELECT COUNT(*) as count 
      FROM sigma_alerts 
      WHERE system_time >= ?
    `;

    const [result] = await db.query(query, [last24Hours.toISOString()]);
    
    res.status(200).json({ count: result[0].count });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching alert count' });
  }
}