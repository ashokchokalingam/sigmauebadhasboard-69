import { db } from '@/lib/db';

interface CountResponse {
  count: number;
}

export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const query = `
      SELECT COUNT(*) as count 
      FROM sigma_alerts 
      WHERE system_time >= ?
    `;

    const [result] = await db.query<CountResponse[]>(query, [last24Hours.toISOString()]);
    
    return new Response(JSON.stringify({ count: result[0].count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Error fetching alert count' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}