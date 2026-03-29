import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'sql', 'init.sql'), 'utf8');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  await connection.query(sql);
  console.log('Database seeded');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
