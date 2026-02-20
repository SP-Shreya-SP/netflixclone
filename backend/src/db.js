import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST = "localhost",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "netflix_clone",
  DB_PORT = 3306,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  // We intentionally avoid logging secrets
  // eslint-disable-next-line no-console
  console.error(
    "Database configuration is missing. Please set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and optionally DB_PORT in your environment."
  );
}

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const connection = await pool.getConnection();
  try {
    await connection.query(createTableSQL);
  } finally {
    connection.release();
  }
}

