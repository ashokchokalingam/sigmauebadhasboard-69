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
        computer_name,
        COUNT(DISTINCT title) as unique_titles
      FROM sigma_alerts
      WHERE computer_name LIKE ?
      GROUP BY computer_name
      ORDER BY unique_titles DESC
    `;

    const queryParams = [`%${computer_name}%`];

    console.log('Executing query:', query, 'with params:', queryParams);

    const [rows] = await db.query(query, queryParams);

    res.status(200).json({
      computer_impacted_logs: rows,
      pagination: {
        current_page: parseInt(page as string),
        per_page: parseInt(per_page as string),
        has_more: Array.isArray(rows) && rows.length === parseInt(per_page as string)
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}