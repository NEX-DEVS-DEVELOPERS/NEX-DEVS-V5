#!/usr/bin/env node

/**
 * Test Admin Authentication
 * Verifies the password fix is working
 */

const ADMIN_PASSWORD = 'password'; // Default password

async function testAuth() {
  console.log('\n🔐 Testing Admin Authentication\n');
  console.log('═'.repeat(50));

  try {
    // Test admin ROI section endpoint
    console.log('\n1️⃣ Testing GET /api/admin/roi-section');
    const response = await fetch('http://localhost:3000/api/admin/roi-section', {
      headers: {
        'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.status === 200) {
      const data = await response.json();
      console.log('   ✅ Authentication successful!');
      console.log(`   Data received: ${data.success ? 'Yes' : 'No'}`);
      
      if (data.data && data.data.length > 0) {
        console.log(`   ROI Sections: ${data.data.length}`);
        console.log(`   First section: "${data.data[0].main_heading}"`);
        console.log(`   Cards: ${data.data[0].cards?.length || 0}`);
      }
    } else if (response.status === 401) {
      console.log('   ❌ Authentication failed (401 Unauthorized)');
      console.log('   This means password validation is NOT working');
      console.log('\n   💡 Solution:');
      console.log('      1. Make sure dev server is running');
      console.log('      2. Check ADMIN_PASSWORD in .env.local');
      console.log('      3. Restart dev server');
    } else {
      console.log(`   ⚠️  Unexpected status: ${response.status}`);
    }

    // Test with wrong password
    console.log('\n2️⃣ Testing with wrong password');
    const wrongResponse = await fetch('http://localhost:3000/api/admin/roi-section', {
      headers: {
        'Authorization': 'Bearer wrongpassword',
        'Content-Type': 'application/json'
      }
    });

    if (wrongResponse.status === 401) {
      console.log('   ✅ Correctly rejected wrong password');
    } else {
      console.log(`   ⚠️  Wrong password got: ${wrongResponse.status}`);
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('\n📊 Test Summary:\n');
    
    if (response.status === 200) {
      console.log('✅ Authentication is WORKING!');
      console.log('✅ Password validation is correct');
      console.log('✅ Admin panel should work now');
      console.log('\n🎉 You can now:');
      console.log('   1. Visit: http://localhost:3000/hasnaat/login');
      console.log('   2. Password: password');
      console.log('   3. Access ROI section management\n');
    } else {
      console.log('❌ Authentication is NOT working');
      console.log('\n🔧 To fix:');
      console.log('   1. Stop dev server (Ctrl+C)');
      console.log('   2. Restart: npm run dev');
      console.log('   3. Run this test again\n');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure your dev server is running:');
    console.log('   npm run dev\n');
  }
}

testAuth();


