const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Find SQLite database
const dbPath = path.join(process.cwd(), 'projects.db');
const outputPath = path.join(process.cwd(), 'sqlite-info.json');

// Store all output data
const dbInfo = {
  dbPath,
  fileSize: 0,
  tables: [],
  error: null
};

if (!fs.existsSync(dbPath)) {
  dbInfo.error = `Database file not found at: ${dbPath}`;
  fs.writeFileSync(outputPath, JSON.stringify(dbInfo, null, 2));
  console.error(dbInfo.error);
  process.exit(1);
}

dbInfo.fileSize = fs.statSync(dbPath).size;
console.log(`Found SQLite database at: ${dbPath}`);
console.log(`File size: ${dbInfo.fileSize} bytes`);
console.log(`Output will be written to: ${outputPath}`);

// Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    dbInfo.error = `Error opening database: ${err.message}`;
    fs.writeFileSync(outputPath, JSON.stringify(dbInfo, null, 2));
    console.error(dbInfo.error);
    process.exit(1);
  }
  
  console.log('Connected to SQLite database');
  
  // Get all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      dbInfo.error = `Error getting tables: ${err.message}`;
      fs.writeFileSync(outputPath, JSON.stringify(dbInfo, null, 2));
      console.error(dbInfo.error);
      db.close();
      process.exit(1);
    }
    
    const tableNames = tables.map(t => t.name);
    dbInfo.tableNames = tableNames;
    console.log('Tables in database:', tableNames.join(', '));
    
    // Keep track of pending operations
    let pendingTables = tables.length;
    
    // For each table, get schema and count
    tables.forEach(table => {
      const tableInfo = {
        name: table.name,
        columns: [],
        rowCount: 0,
        sampleRow: null
      };
      
      dbInfo.tables.push(tableInfo);
      
      db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
        if (err) {
          console.error(`Error getting schema for table ${table.name}:`, err);
          tableInfo.error = err.message;
          checkIfDone();
          return;
        }
        
        tableInfo.columns = columns.map(col => ({
          name: col.name,
          type: col.type,
          notNull: col.notnull === 1,
          defaultValue: col.dflt_value,
          primaryKey: col.pk === 1
        }));
        
        console.log(`Schema gathered for table ${table.name}`);
        
        // Count rows
        db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, result) => {
          if (err) {
            console.error(`Error counting rows in table ${table.name}:`, err);
            tableInfo.error = err.message;
            checkIfDone();
            return;
          }
          
          tableInfo.rowCount = result.count;
          console.log(`Row count for table ${table.name}: ${result.count}`);
          
          // If there are rows, show a sample
          if (result.count > 0) {
            db.all(`SELECT * FROM ${table.name} LIMIT 1`, [], (err, rows) => {
              if (err) {
                console.error(`Error getting sample from table ${table.name}:`, err);
                tableInfo.error = err.message;
              } else {
                tableInfo.sampleRow = rows[0];
                console.log(`Sample row retrieved for table ${table.name}`);
              }
              
              checkIfDone();
            });
          } else {
            checkIfDone();
          }
        });
      });
    });
    
    function checkIfDone() {
      pendingTables--;
      if (pendingTables <= 0) {
        // All tables processed, write output and close
        fs.writeFileSync(outputPath, JSON.stringify(dbInfo, null, 2));
        console.log(`Database info written to: ${outputPath}`);
        db.close();
      }
    }
  });
}); 