console.log('Checking if sqlite3 is available...');

try {
  const sqlite3 = require('sqlite3');
  console.log('✅ sqlite3 module loaded successfully');
  
  const db = new sqlite3.Database(':memory:');
  console.log('✅ In-memory database created successfully');
  
  db.close();
  console.log('✅ Database closed successfully');
} catch (error) {
  console.error('❌ Error loading sqlite3:', error.message);
}

console.log('Checking if sqlite is available...');

try {
  const sqlite = require('sqlite');
  console.log('✅ sqlite module loaded successfully');
} catch (error) {
  console.error('❌ Error loading sqlite:', error.message);
}