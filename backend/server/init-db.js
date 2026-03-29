import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to prompt for password
function promptPassword() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('🔑 Enter MySQL root password (press Enter if no password): ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

async function initializeDatabase() {
  try {
    console.log('📦 Smart Agro Database Initialization\n');
    
    // Use password from command line arg or prompt
    let password = process.argv[2];
    
    if (!password) {
      password = await promptPassword();
    }

    // First, connect without specifying a database to create it
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password,
      multipleStatements: true
    });

    console.log('\n✅ Connected to MySQL...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'sql', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL script
    console.log('⏳ Creating database and tables...');
    await connection.query(sql);
    
    console.log('\n✅ Database initialized successfully!');
    console.log('✅ Tables created:');
    console.log('   - users (for login credentials)');
    console.log('   - products (for product listings)');
    console.log('   - orders (for customer orders)');
    console.log('   - order_items (for items in orders)');
    console.log('   - cart_items (for shopping cart)\n');
    
    await connection.end();
  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      console.log('\n⚠️  Incorrect MySQL password. Try again with the correct password.');
    }
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('\n⚠️  MySQL server is not running. Please start MySQL server first.');
    }
    
    process.exit(1);
  }
}

initializeDatabase();
