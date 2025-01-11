import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { computer_name, page = '1', per_page = '500' } = req.query;

  if (!computer_name) {
    return res.status(400).json({ error: 'computer_name is required' });
  }

  try {
    let query = `
      SELECT 
        *
      FROM sigma_alerts
      WHERE computer_name = ?
      ORDER BY system_time DESC
      LIMIT ? OFFSET ?
    `;

    const limit = parseInt(per_page as string);
    const offset = (parseInt(page as string) - 1) * limit;
    const queryParams = [computer_name, limit, offset];

    console.log('Executing query:', query, 'with params:', queryParams);

    const [rows] = await db.query(query, queryParams);

    // Get total count for pagination
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM sigma_alerts WHERE computer_name = ?',
      [computer_name]
    );
    const totalCount = countResult[0].total;

    res.status(200).json({
      computer_impacted_logs: rows,
      pagination: {
        current_page: parseInt(page as string),
        per_page: limit,
        total: totalCount,
        has_more: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}