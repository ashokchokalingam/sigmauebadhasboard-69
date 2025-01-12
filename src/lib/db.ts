import mysql from 'mysql2/promise';

// Create a connection pool
export const db = mysql.createPool({
  host: process.env.DB_HOST || '172.16.0.75',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'sigma',
  database: process.env.DB_NAME || 'sigma_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};