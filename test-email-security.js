/**
 * Email Security Test Script
 * Tests the email security alert functionality
 */

const { emailSecurityService } = require('./lib/email-security');

async function testEmailSecurity() {
  console.log('🧪 Testing Email Security Service...');
  console.log('=' .repeat(50));

  // Create test security event data
  const testAlertData = {
    event: {
      type: 'failed_login',
      severity: 'high',
      timestamp: new Date().toISOString(),
      clientIP: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      username: 'test_attacker@example.com',
      details: {
        reason: 'failed_login',
        attempts: 3,
        referer: 'http://localhost:3000/hasnaat/login',
        origin: 'http://localhost:3000',
        acceptLanguage: 'en-US,en;q=0.9',
        blockDuration: '30 minutes',
        environment: 'development'
      }
    },
    recentEvents: [],
    summary: {
      totalEvents: 3,
      timeWindow: '30 minutes',
      severity: 'high',
      clientIP: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    }
  };

  try {
    console.log('📧 Sending test security alert email...');
    console.log('Test data:', JSON.stringify(testAlertData, null, 2));
    
    const result = await emailSecurityService.sendSecurityAlert(testAlertData);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('📬 Check your inbox at nexious.dev@gmail.com');
    } else {
      console.log('❌ Test email failed to send');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Test email error:', error);
    return false;
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testEmailSecurity()
    .then(success => {
      if (success) {
        console.log('\n🎉 Email security test completed successfully!');
        console.log('📧 Check nexious.dev@gmail.com for the test security alert');
      } else {
        console.log('\n⚠️ Email security test failed');
        console.log('Please check the email configuration and credentials');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test script error:', error);
      process.exit(1);
    });
}

module.exports = { testEmailSecurity };
