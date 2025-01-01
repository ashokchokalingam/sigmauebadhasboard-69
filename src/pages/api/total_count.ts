import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT COUNT(*) as total_events
      FROM sigma_alerts 
      WHERE system_time >= NOW() - INTERVAL 24 HOUR;
    `;

    const [rows] = await db.query(query);
    const total = (rows as any[])[0]?.total_events || 0;

    return new Response(JSON.stringify({ total_events: total }), {
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