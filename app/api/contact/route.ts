import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formatPrice, isBasicPackage, currencySymbols, SupportedCurrency } from '@/app/utils/pricing';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData = await req.json();
    
    // Extract form data
    const { 
      name, 
      email, 
      phone, 
      address, 
      selectedPlan, 
      timeline, 
      details,
      currency,
      exchangeRate,
      basePrice,
      finalPrice,
      rushFee,
      discount,
      internationalFee 
    } = formData;
    
    // Email password from environment variable
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    // Check if email password is configured
    if (!emailPassword) {
      console.error('EMAIL_PASSWORD environment variable is not set');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error. Please try again later or contact support.', 
          error: 'Email configuration is incomplete' 
        },
        { status: 500 }
      );
    }

    // Format prices for display
    const formattedFinalPrice = formatPrice(finalPrice, currency as SupportedCurrency);
    const formattedRushFee = rushFee ? formatPrice(rushFee, currency as SupportedCurrency) : null;
    const formattedDiscount = discount ? formatPrice(discount, currency as SupportedCurrency) : null;
    const formattedInternationalFee = formatPrice(internationalFee, currency as SupportedCurrency);
    
    // Create a transporter object using SMTP transport with secure settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: 'nexwebs.org@gmail.com',
        pass: emailPassword,
      },
      tls: {
        // Required for Vercel deployment
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
          message: 'Email service is temporarily unavailable. Please try again later.', 
          error: 'SMTP verification failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
    // Format the email content with all the form data
    const mailOptions = {
      from: {
        name: 'NEX-WEBS Contact Form',
        address: 'nexwebs.org@gmail.com'
      },
      to: 'nexwebs.org@gmail.com',
      subject: `NEX-WEBS | New Contact Form Submission - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>NEX-WEBS Contact Form Submission</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(to right, #6d28d9, #8b5cf6);
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
              margin: -20px -20px 20px;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .logo {
              color: white;
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 8px;
              letter-spacing: 1px;
            }
            .subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 15px;
              margin: 0;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              color: #6d28d9;
              font-size: 18px;
              font-weight: bold;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-top: 25px;
              margin-bottom: 15px;
            }
            .info-row {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              color: #4b5563;
            }
            .value {
              color: #1f2937;
            }
            .highlight {
              background-color: #ede9fe;
              padding: 12px 15px;
              border-radius: 6px;
              border-left: 3px solid #8b5cf6;
              margin: 15px 0;
            }
            .timestamp {
              color: #6b7280;
              font-size: 13px;
              text-align: right;
              margin-top: 30px;
              font-style: italic;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
            .price-breakdown {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              border: 1px solid #e2e8f0;
            }
            .price-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .price-row:last-child {
              border-bottom: none;
            }
            .price-label {
              color: #4b5563;
              font-weight: 500;
            }
            .price-value {
              font-weight: 600;
              color: #1f2937;
            }
            .price-value.discount {
              color: #059669;
            }
            .price-value.fee {
              color: #dc2626;
            }
            .final-price {
              font-size: 1.1em;
              color: #059669;
              font-weight: bold;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px dashed #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">NEX-WEBS</div>
              <p class="subtitle">New Contact Form Submission</p>
            </div>
            
            <div class="timestamp">
              Submitted on: ${new Date().toLocaleString()}
            </div>
            
            <div class="section">
              <h2 class="section-title">Contact Information</h2>
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${name || 'Not provided'}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${email || 'Not provided'}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">${phone || 'Not provided'}</span>
              </div>
              <div class="info-row">
                <span class="label">Address:</span>
                <span class="value">${address || 'Not provided'}</span>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Project Details</h2>
              <div class="info-row">
                <span class="label">Selected Package:</span>
                <span class="value">${selectedPlan || 'Not selected'}</span>
              </div>
              <div class="info-row">
                <span class="label">Project Timeline:</span>
                <span class="value">${timeline || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Selected Currency:</span>
                <span class="value">${currency}</span>
              </div>
              
              <div class="price-breakdown">
                <h3 style="margin-top: 0; color: #1f2937;">Price Breakdown</h3>
                <div class="price-row">
                  <span class="price-label">Base Price:</span>
                  <span class="price-value">${formatPrice(basePrice * exchangeRate, currency)}</span>
                </div>
                
                ${rushFee ? `
                <div class="price-row">
                  <span class="price-label">Rush Fee (20%):</span>
                  <span class="price-value fee">+${formatPrice(rushFee, currency)}</span>
                </div>
                ` : ''}
                ${discount ? `
                <div class="price-row">
                  <span class="price-label">Discount (20%):</span>
                  <span class="price-value discount">-${formatPrice(discount, currency)}</span>
                </div>
                ` : ''}
                ${currency !== 'PKR' && internationalFee ? `
                <div class="price-row">
                  <span class="price-label">International Fee (30%):</span>
                  <span class="price-value fee">+${formatPrice(internationalFee, currency)}</span>
                </div>
                ` : ''}
                <div class="final-price">
                  <span class="price-label">Final Price:</span>
                  <span class="price-value">${formatPrice(finalPrice, currency)}</span>
                </div>
              </div>
              
              <div class="highlight">
                <span class="label">Project Description:</span><br>
                <span class="value">${details || 'No details provided'}</span>
              </div>
            </div>
            
            <div class="footer">
              &copy; ${new Date().getFullYear()} NEX-WEBS | This is an automated email from your website contact form
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('Attempting to send email...');
    
    try {
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      });
      
      // Return success response
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully' 
      });
    } catch (sendError) {
      console.error('Error sending email:', sendError);
      throw sendError; // Re-throw to be caught by outer try-catch
    }
    
  } catch (error) {
    console.error('Detailed error sending email:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error
    });
    
    // Return error response with more details
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send email. Please try again later.', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 