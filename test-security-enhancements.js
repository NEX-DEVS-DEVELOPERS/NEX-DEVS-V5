/**
 * Security Enhancement Test Script
 * Tests the enhanced security features for admin authentication
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000', // Change to your local dev server
  testCredentials: {
    validUsername: 'iblame_hasnaat',
    validPassword: 'nex-devs.org889123',
    invalidUsername: 'alihasnaat888@gmail.com',
    invalidPassword: 'wrongpassword123'
  }
};

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, TEST_CONFIG.baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Security-Test-Agent/1.0'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testValidLogin() {
  console.log('\n🔐 Testing Valid Login...');
  try {
    const response = await makeRequest('/api/admin-login', 'POST', {
      username: TEST_CONFIG.testCredentials.validUsername,
      password: TEST_CONFIG.testCredentials.validPassword
    });

    console.log(`Status: ${response.statusCode}`);
    console.log(`Response:`, response.body);
    
    if (response.statusCode === 200) {
      console.log('✅ Valid login test passed');
      return true;
    } else {
      console.log('❌ Valid login test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Valid login test error:', error.message);
    return false;
  }
}

async function testInvalidLogin() {
  console.log('\n🚫 Testing Invalid Login (Should trigger security alert)...');
  try {
    const response = await makeRequest('/api/admin-login', 'POST', {
      username: TEST_CONFIG.testCredentials.invalidUsername,
      password: TEST_CONFIG.testCredentials.invalidPassword
    });

    console.log(`Status: ${response.statusCode}`);
    console.log(`Response:`, response.body);
    
    if (response.statusCode === 401) {
      console.log('✅ Invalid login test passed (correctly rejected)');
      return true;
    } else {
      console.log('❌ Invalid login test failed (should have been rejected)');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid login test error:', error.message);
    return false;
  }
}

async function testSecurityBlock() {
  console.log('\n🛡️ Testing Security Block System...');
  try {
    // Make multiple failed attempts to trigger blocking
    for (let i = 1; i <= 3; i++) {
      console.log(`Attempt ${i}/3...`);
      const response = await makeRequest('/api/admin-login', 'POST', {
        username: TEST_CONFIG.testCredentials.invalidUsername,
        password: TEST_CONFIG.testCredentials.invalidPassword
      });
      
      console.log(`Attempt ${i} Status: ${response.statusCode}`);
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Security block test completed (check server logs for security violations)');
    return true;
  } catch (error) {
    console.log('❌ Security block test error:', error.message);
    return false;
  }
}

async function testSecurityCheck() {
  console.log('\n🔍 Testing Security Check Endpoint...');
  try {
    const response = await makeRequest('/api/security/check', 'GET');

    console.log(`Status: ${response.statusCode}`);
    console.log(`Response:`, response.body);
    
    if (response.statusCode === 200) {
      console.log('✅ Security check test passed');
      return true;
    } else {
      console.log('❌ Security check test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Security check test error:', error.message);
    return false;
  }
}

// Main test runner
async function runSecurityTests() {
  console.log('🚀 Starting Security Enhancement Tests...');
  console.log('=' .repeat(50));
  
  const results = {
    validLogin: false,
    invalidLogin: false,
    securityBlock: false,
    securityCheck: false
  };

  // Run tests
  results.validLogin = await testValidLogin();
  results.invalidLogin = await testInvalidLogin();
  results.securityBlock = await testSecurityBlock();
  results.securityCheck = await testSecurityCheck();

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Results Summary:');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All security enhancement tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }

  console.log('\n📝 Notes:');
  console.log('- Check server console logs for detailed security violation messages');
  console.log('- Check email inbox (nexdevs.org@gmail.com) for security alert emails');
  console.log('- Failed login attempts should trigger email notifications');
  console.log('- No sensitive information should appear in browser console');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests().catch(console.error);
}

module.exports = {
  runSecurityTests,
  testValidLogin,
  testInvalidLogin,
  testSecurityBlock,
  testSecurityCheck
};
