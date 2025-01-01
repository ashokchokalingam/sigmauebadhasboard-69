import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM sigma_alerts WHERE system_time >= NOW() - INTERVAL 24 HOUR) as total,
        (SELECT COUNT(*) FROM sigma_alerts WHERE rule_level = 'critical' AND system_time >= NOW() - INTERVAL 24 HOUR) as critical_count,
        (SELECT COUNT(*) FROM sigma_alerts WHERE rule_level = 'high' AND system_time >= NOW() - INTERVAL 24 HOUR) as high_count
      FROM dual;
    `;

    const [rows] = await db.query(query);
    const result = rows as any;
    
    const response = {
      total_counts: [
        {
          event_count: result[0].total,
          rule_level: "Total"
        },
        {
          event_count: result[0].critical_count,
          rule_level: "Critical"
        },
        {
          event_count: result[0].high_count,
          rule_level: "High"
        }
      ]
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