/**
 * Test script for Knowledge Base API
 * Run this to verify the knowledge management system is working
 */

const API_BASE = 'http://localhost:3000/api/admin/knowledge-base';
const AUTH_TOKEN = 'nex-devs.org889123';

// Test data
const testEntry = {
  category: 'Test',
  title: 'API Test Entry',
  content: 'This is a test entry to verify the knowledge base API is working correctly. It includes various features like categories, tags, and content management.',
  tags: ['test', 'api', 'verification'],
  isActive: true
};

async function testKnowledgeAPI() {
  console.log('🧪 Testing Knowledge Base API...\n');

  try {
    // Test 1: Get all entries
    console.log('1️⃣ Testing GET all entries...');
    const getResponse = await fetch(API_BASE, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log(`✅ GET successful - Found ${data.data.length} entries`);
    } else {
      console.log(`❌ GET failed - Status: ${getResponse.status}`);
    }

    // Test 2: Add new entry
    console.log('\n2️⃣ Testing POST new entry...');
    const postResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(testEntry)
    });

    let testEntryId = null;
    if (postResponse.ok) {
      const data = await postResponse.json();
      testEntryId = data.entryId;
      console.log(`✅ POST successful - Entry ID: ${testEntryId}`);
    } else {
      const error = await postResponse.json();
      console.log(`❌ POST failed - Error: ${error.error}`);
    }

    // Test 3: Get stats
    console.log('\n3️⃣ Testing GET stats...');
    const statsResponse = await fetch(`${API_BASE}?action=stats`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (statsResponse.ok) {
      const data = await statsResponse.json();
      console.log(`✅ Stats successful - Total: ${data.data.total}, Active: ${data.data.active}`);
    } else {
      console.log(`❌ Stats failed - Status: ${statsResponse.status}`);
    }

    // Test 4: Search entries
    console.log('\n4️⃣ Testing search functionality...');
    const searchResponse = await fetch(`${API_BASE}?action=search&query=test`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (searchResponse.ok) {
      const data = await searchResponse.json();
      console.log(`✅ Search successful - Found ${data.data.length} matching entries`);
    } else {
      console.log(`❌ Search failed - Status: ${searchResponse.status}`);
    }

    // Test 5: Delete test entry (cleanup)
    if (testEntryId) {
      console.log('\n5️⃣ Testing DELETE entry (cleanup)...');
      const deleteResponse = await fetch(`${API_BASE}?id=${testEntryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      
      if (deleteResponse.ok) {
        console.log(`✅ DELETE successful - Test entry cleaned up`);
      } else {
        console.log(`❌ DELETE failed - Status: ${deleteResponse.status}`);
      }
    }

    console.log('\n🎉 Knowledge Base API tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testKnowledgeAPI();
} else {
  // Browser environment
  console.log('Run testKnowledgeAPI() in the browser console to test the API');
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.testKnowledgeAPI = testKnowledgeAPI;
}
