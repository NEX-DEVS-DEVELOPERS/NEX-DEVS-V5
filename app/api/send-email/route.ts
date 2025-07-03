import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  console.log('Starting email sending process for project review...');
  
  try {
    // Parse the request body
    const payload = await req.json();
    
    // Extract data from payload
    const { 
      recipientEmail, 
      appPassword,
      subject,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      projectDetails,
      htmlContent
    } = payload;
    
    console.log('Email data received:', { recipientEmail, subject, clientName, clientEmail });
    
    // Validate required fields
    if (!recipientEmail || !appPassword) {
      console.error('Missing required email configuration');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required email configuration', 
        },
        { status: 400 }
      );
    }

    // Create a transporter object using SMTP transport with secure settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: recipientEmail,
        pass: appPassword,
      },
      tls: {
        // Required for security
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
      }
    });

    // Verify SMTP connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP Verification Error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email service verification failed', 
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
    // Format the email content
    const mailOptions = {
      from: {
        name: clientName || 'Project Review System',
        address: clientEmail || recipientEmail
      },
      to: recipientEmail,
      subject: subject || 'New Project Review Submission',
      html: htmlContent || `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Project Review Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .section { background: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Project Review Submission</h1>
            </div>
            
            <div class="section">
              <h2>Client Details</h2>
              <p><strong>Name:</strong> ${clientName || 'Not provided'}</p>
              <p><strong>Email:</strong> ${clientEmail || 'Not provided'}</p>
              <p><strong>Phone:</strong> ${clientPhone || 'Not provided'}</p>
              <p><strong>Address:</strong> ${clientAddress || 'Not provided'}</p>
            </div>
            
            ${projectDetails ? `
            <div class="section">
              <h2>Project Details</h2>
              <p><strong>Package:</strong> ${projectDetails.package || 'Not provided'}</p>
              <p><strong>Timeline:</strong> ${projectDetails.timeline || 'Not provided'}</p>
              <p><strong>Amount:</strong> ${projectDetails.amount || 'Not provided'}</p>
              <p><strong>Invoice Number:</strong> ${projectDetails.invoiceNumber || 'Not provided'}</p>
              <p><strong>Request ID:</strong> ${projectDetails.requestId || 'Not provided'}</p>
              <p><strong>Submission Date:</strong> ${projectDetails.submissionDate || new Date().toLocaleString()}</p>
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `
    };

    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email sent successfully',
          messageId: info.messageId
        },
        { status: 200 }
      );
    } catch (sendError) {
      console.error('Error sending email:', sendError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email', 
          error: sendError instanceof Error ? sendError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing request', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 