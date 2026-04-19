import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, 'data', 'test.db');

console.log('Database path:', dbPath);

async function testSQLite() {
  try {
    // Open database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite database');

    // Create a test table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    console.log('✅ Test table created');

    // Insert a test record
    await db.run('INSERT INTO test (name) VALUES (?)', ['Test Record']);

    console.log('✅ Test record inserted');

    // Query the test record
    const row = await db.get('SELECT * FROM test WHERE name = ?', ['Test Record']);
    console.log('✅ Test record retrieved:', row);

    // Close database
    await db.close();
    console.log('✅ Database closed');
  } catch (error) {
    console.error('❌ SQLite test failed:', error);
  }
}

testSQLite();