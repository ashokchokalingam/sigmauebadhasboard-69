import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_impacted, title, page = '1', per_page = '500' } = req.query;

  if (!user_impacted) {
    return res.status(400).json({ error: 'user_impacted is required' });
  }

  try {
    let query = `
      SELECT 
        id, title, description, system_time, computer_name, 
        user_id, event_id, provider_name, ml_cluster, ip_address,
        task, rule_level, target_user_name, target_domain_name,
        ruleid, raw, tactics, techniques, ml_description, risk
      FROM sigma_alerts
      WHERE target_user_name = ?
    `;

    const queryParams = [user_impacted];

    if (title) {
      query += ` AND title = ?`;
      queryParams.push(title);
    }

    query += ` ORDER BY system_time DESC
              LIMIT ? OFFSET ?`;

    const limit = parseInt(per_page as string);
    const offset = (parseInt(page as string) - 1) * limit;
    queryParams.push(limit.toString(), offset.toString());

    const [rows] = await db.query(query, queryParams);

    res.status(200).json({
      user_impacted_logs: rows,
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