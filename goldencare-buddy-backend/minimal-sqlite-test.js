// Minimal SQLite test
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database in memory for testing
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database in memory');
});

// Create a simple table
db.serialize(() => {
  db.run(`CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    patientId TEXT UNIQUE NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }
    console.log('✅ Patients table created');
  });

  // Insert a test record
  const stmt = db.prepare('INSERT INTO patients (name, patientId) VALUES (?, ?)');
  stmt.run(['John Doe', 'PAT001'], function(err) {
    if (err) {
      console.error('Error inserting record:', err.message);
      return;
    }
    console.log(`✅ Record inserted with ID: ${this.lastID}`);
  });
  stmt.finalize();

  // Query the record
  db.each('SELECT id, name, patientId FROM patients', (err, row) => {
    if (err) {
      console.error('Error querying records:', err.message);
      return;
    }
    console.log('✅ Retrieved record:', row);
  });
});

// Close database
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
    return;
  }
  console.log('✅ Database connection closed');
});