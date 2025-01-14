import { db, testConnection } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 100;
    const offset = (page - 1) * per_page;

    console.log('Executing query with params:', { page, per_page, offset });

    const query = `
      SELECT 
        id, title, description, system_time, computer_name, 
        user_id, event_id, provider_name, ml_cluster, ip_address,
        task, rule_level, target_user_name, target_domain_name,
        ruleid, raw, tactics, techniques, ml_description, risk
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

    console.log('Query results:', {
      rowCount: Array.isArray(rows) ? rows.length : 0,
      total
    });

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
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}