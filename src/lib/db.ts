import mysql from 'mysql2/promise';

// Create a connection pool
export const db = mysql.createPool({
  host: '172.16.0.75',
  user: 'root',
  password: 'sigma',
  database: 'sigma_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});