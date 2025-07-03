// This script tests the Neon PostgreSQL database connection and CRUD operations
// Run with: node scripts/test-neon-connection.js

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env.local' });

// Initialize Neon SQL connection with environment variable
const NEON_CONNECTION_STRING = process.env.DATABASE_URL;

if (!NEON_CONNECTION_STRING) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please create a .env.local file with DATABASE_URL=your_neon_connection_string');
  process.exit(1);
}

console.log('Testing Neon PostgreSQL connection...');
console.log(`Connection string: ${NEON_CONNECTION_STRING.replace(/:[^:]*@/, ':****@')}`);

const sql = neon(NEON_CONNECTION_STRING);

async function runTests() {
  try {
    // Test 1: Basic connection
    console.log('\n🧪 Test 1: Testing basic connection...');
    const connectionTest = await sql`SELECT 1 as test`;
    console.log('✅ Connection successful:', connectionTest);

    // Test 2: Create test table if it doesn't exist
    console.log('\n🧪 Test 2: Creating test table...');
    await sql`
      CREATE TABLE IF NOT EXISTS test_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Test table created or already exists');

    // Test 3: Insert a test record
    console.log('\n🧪 Test 3: Inserting test record...');
    const testTitle = `Test Project ${new Date().toISOString()}`;
    const insertResult = await sql`
      INSERT INTO test_projects (title, description)
      VALUES (${testTitle}, 'This is a test project created by the test script')
      RETURNING id, title
    `;
    
    if (!insertResult || insertResult.length === 0) {
      throw new Error('Insert operation failed - no rows returned');
    }
    
    const newId = insertResult[0].id;
    console.log(`✅ Test record inserted with ID: ${newId}`);

    // Test 4: Read the test record
    console.log('\n🧪 Test 4: Reading test record...');
    const readResult = await sql`
      SELECT * FROM test_projects WHERE id = ${newId}
    `;
    
    if (!readResult || readResult.length === 0) {
      throw new Error(`Read operation failed - could not find record with ID ${newId}`);
    }
    
    console.log('✅ Test record read successfully:', readResult[0]);

    // Test 5: Update the test record
    console.log('\n🧪 Test 5: Updating test record...');
    const updatedTitle = `${testTitle} (Updated)`;
    const updateResult = await sql`
      UPDATE test_projects
      SET title = ${updatedTitle}, description = 'This record was updated by the test script'
      WHERE id = ${newId}
      RETURNING id, title
    `;
    
    if (!updateResult || updateResult.length === 0) {
      throw new Error(`Update operation failed - could not update record with ID ${newId}`);
    }
    
    console.log('✅ Test record updated successfully:', updateResult[0]);

    // Test 6: Delete the test record
    console.log('\n🧪 Test 6: Deleting test record...');
    const deleteResult = await sql`
      DELETE FROM test_projects
      WHERE id = ${newId}
      RETURNING id
    `;
    
    if (!deleteResult || deleteResult.length === 0) {
      throw new Error(`Delete operation failed - could not delete record with ID ${newId}`);
    }
    
    console.log(`✅ Test record deleted successfully`);

    // Test 7: Check projects table
    console.log('\n🧪 Test 7: Checking projects table...');
    try {
      const projectsResult = await sql`SELECT COUNT(*) as count FROM projects`;
      console.log(`✅ Projects table exists with ${projectsResult[0].count} records`);
    } catch (error) {
      console.log('⚠️ Projects table does not exist yet, will be created when needed');
    }

    console.log('\n✅✅✅ All tests passed! Neon PostgreSQL database is working properly! ✅✅✅');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runTests().catch(console.error); 