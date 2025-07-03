// Test script to verify authentication flow
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const ADMIN_PASSWORD = 'nex-devs.org889123';
const DB_PASSWORD = 'alihasnaat919';

async function testUploadAuth() {
  console.log('Testing upload API authentication...');
  
  try {
    // Test with admin password
    const formData = new FormData();
    formData.append('password', ADMIN_PASSWORD);
    formData.append('file', new Blob(['test'], { type: 'image/png' }), 'test.png');
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Admin password test:', response.status, result);
    
    // Test with database password
    const formData2 = new FormData();
    formData2.append('password', DB_PASSWORD);
    formData2.append('file', new Blob(['test'], { type: 'image/png' }), 'test.png');
    
    const response2 = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData2
    });
    
    const result2 = await response2.json();
    console.log('DB password test:', response2.status, result2);
    
  } catch (error) {
    console.error('Upload test error:', error);
  }
}

async function testProjectCreation() {
  console.log('Testing project creation...');
  
  try {
    const projectData = {
      title: 'Test Project from Script',
      description: 'Test description',
      category: 'Test',
      technologies: ['JavaScript', 'Node.js'],
      link: 'https://example.com',
      image: '/projects/test.jpg',
      password: ADMIN_PASSWORD
    };
    
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });
    
    const result = await response.json();
    console.log('Project creation test:', response.status, result);
    
  } catch (error) {
    console.error('Project creation test error:', error);
  }
}

async function runTests() {
  console.log('Starting authentication tests...');
  console.log('Admin Password:', ADMIN_PASSWORD);
  console.log('DB Password:', DB_PASSWORD);
  console.log('---');
  
  await testUploadAuth();
  console.log('---');
  await testProjectCreation();
  
  console.log('Tests completed!');
}

runTests();
