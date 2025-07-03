/**
 * Test Nodemailer Import
 * Verifies that nodemailer is properly imported and working
 */

const nodemailer = require('nodemailer');

console.log('🧪 Testing Nodemailer Import...');
console.log('=' .repeat(50));

// Test 1: Check if nodemailer is imported correctly
console.log('📦 Nodemailer object:', typeof nodemailer);
console.log('🔧 createTransport method:', typeof nodemailer.createTransport);

if (typeof nodemailer.createTransport !== 'function') {
  console.error('❌ nodemailer.createTransport is not a function!');
  console.error('Available methods:', Object.keys(nodemailer));
  process.exit(1);
}

// Test 2: Try creating a transporter
try {
  console.log('🔧 Creating test transporter...');
  
  const testTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nexdevs.org@gmail.com',
      pass: 'hcgn fypy ylnm pvud'
    }
  });
  
  console.log('✅ Transporter created successfully');
  console.log('🔍 Transporter type:', typeof testTransporter);
  console.log('📧 Verify method:', typeof testTransporter.verify);
  console.log('📤 SendMail method:', typeof testTransporter.sendMail);
  
  // Test 3: Try verifying the connection
  console.log('🔍 Testing SMTP connection...');
  
  testTransporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP verification failed:', error.message);
    } else {
      console.log('✅ SMTP connection verified successfully!');
      console.log('📧 Ready to send emails to nexdevs.org@gmail.com');
    }
    
    // Test 4: Try sending a test email
    console.log('📤 Sending test email...');
    
    const mailOptions = {
      from: {
        name: 'NEX-DEVS Security Test',
        address: 'nexdevs.org@gmail.com'
      },
      to: 'nexdevs.org@gmail.com',
      subject: '🧪 Nodemailer Test - Security System Working',
      text: `
NEX-DEVS SECURITY SYSTEM TEST
============================

This is a test email to verify that the security email system is working correctly.

Test Details:
- Timestamp: ${new Date().toISOString()}
- Nodemailer Version: Working
- SMTP Connection: Verified
- Email Service: Gmail
- Recipient: nexdevs.org@gmail.com

If you receive this email, the security alert system is ready to monitor unauthorized access attempts!

🔒 Security System Status: OPERATIONAL
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937; margin: 0 0 20px 0;">🧪 NEX-DEVS Security System Test</h1>
            
            <div style="background: #10b981; color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 18px;">✅ Test Successful!</h2>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              This is a test email to verify that the security email system is working correctly.
            </p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">📊 Test Details:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                <li><strong>Nodemailer:</strong> Working</li>
                <li><strong>SMTP Connection:</strong> Verified</li>
                <li><strong>Email Service:</strong> Gmail</li>
                <li><strong>Recipient:</strong> nexdevs.org@gmail.com</li>
              </ul>
            </div>
            
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;">
                <strong>🔒 Security System Status: OPERATIONAL</strong><br>
                If you receive this email, the security alert system is ready to monitor unauthorized access attempts!
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    testTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📬 Check your inbox at nexdevs.org@gmail.com');
      }
      
      console.log('\n' + '=' .repeat(50));
      console.log('🎉 Nodemailer test completed!');
      process.exit(error ? 1 : 0);
    });
  });
  
} catch (error) {
  console.error('❌ Failed to create transporter:', error.message);
  process.exit(1);
}
