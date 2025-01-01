import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_events,
        SUM(CASE WHEN rule_level = 'critical' THEN 1 ELSE 0 END) as critical_events,
        SUM(CASE WHEN rule_level = 'high' THEN 1 ELSE 0 END) as high_events
      FROM sigma_alerts 
      WHERE system_time >= NOW() - INTERVAL 24 HOUR;
    `;

    const [rows] = await db.query(query);
    const data = {
      total_events: (rows as any[])[0]?.total_events || 0,
      critical_events: (rows as any[])[0]?.critical_events || 0,
      high_events: (rows as any[])[0]?.high_events || 0
    };

    return new Response(JSON.stringify(data), {
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