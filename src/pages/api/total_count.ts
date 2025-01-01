import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT
        'Total' AS rule_level,
        COUNT(*) AS event_count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      UNION ALL
      SELECT
        'Critical' AS rule_level,
        0 AS event_count
      UNION ALL
      SELECT
        'High' AS rule_level,
        SUM(CASE WHEN rule_level = 'high' THEN 1 ELSE 0 END) AS event_count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      UNION ALL
      SELECT
        'Medium' AS rule_level,
        SUM(CASE WHEN rule_level = 'medium' THEN 1 ELSE 0 END) AS event_count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      UNION ALL
      SELECT
        'Low' AS rule_level,
        SUM(CASE WHEN rule_level = 'low' THEN 1 ELSE 0 END) AS event_count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR
      UNION ALL
      SELECT
        'Informational' AS rule_level,
        SUM(CASE WHEN rule_level = 'informational' THEN 1 ELSE 0 END) AS event_count
      FROM sigma_alerts
      WHERE system_time >= NOW() - INTERVAL 24 HOUR;
    `;

    const [rows] = await db.query(query);
    
    // Format the response
    const response = {
      total: (rows as any[]).find(r => r.rule_level === 'Total')?.event_count || 0,
      breakdown: rows,
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}