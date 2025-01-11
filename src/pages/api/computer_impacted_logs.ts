import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { computer_name, title, page = '1', per_page = '500' } = req.query;

  if (!computer_name) {
    return res.status(400).json({ error: 'computer_name is required' });
  }

  try {
    let query = `
      SELECT 
        *
      FROM sigma_alerts
      WHERE computer_name = ?
    `;

    const queryParams = [computer_name];

    if (title) {
      query += ` AND title = ?`;
      queryParams.push(title);
    }

    query += ` ORDER BY system_time DESC
              LIMIT ? OFFSET ?`;

    const limit = parseInt(per_page as string);
    const offset = (parseInt(page as string) - 1) * limit;
    queryParams.push(limit.toString(), offset.toString());

    console.log('Executing query:', query, 'with params:', queryParams);

    const [rows] = await db.query(query, queryParams);

    res.status(200).json({
      computer_impacted_logs: rows,
      pagination: {
        current_page: parseInt(page as string),
        per_page: limit,
        has_more: Array.isArray(rows) && rows.length === limit
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}