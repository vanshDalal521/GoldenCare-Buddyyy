import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'goldencare.db');

// Initialize database
let db;

export async function initializeDatabase() {
  try {
    console.log('Database path:', dbPath);
    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    console.log('Data directory:', dataDir);
    
    // Open database
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite database');

    // Create tables if they don't exist
    await createTables();
    
    return db;
  } catch (error) {
    console.error('❌ SQLite database connection error:', error);
    throw error;
  }
}

// ... rest of the code remains the same ...