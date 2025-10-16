import nodemailer from 'nodemailer';
import { ENV_CONFIG } from './env-config';
import type { SecurityEvent } from './security-monitor';

// Email security service for sending security alerts
export class EmailSecurityService {
  private static instance: EmailSecurityService;
  private transporter: nodemailer.Transporter | null = null;

  private constructor() {
    // Initialize transporter immediately
    this.initializeTransporter().catch(error => {
      console.error('❌ Failed to initialize email transporter in constructor:', error);
    });
  }

  static getInstance(): EmailSecurityService {
    if (!EmailSecurityService.instance) {
      EmailSecurityService.instance = new EmailSecurityService();
    }
    return EmailSecurityService.instance;
  }

  // Initialize email transporter with enhanced security configuration
  private async initializeTransporter(): Promise<void> {
    try {
      // Use the new correct security email credentials
      const securityEmail = 'nexdevs.org@gmail.com';
      const securityPassword = 'hcgn fypy ylnm pvud';

      console.log('🔧 Initializing email transporter...');
      console.log(`📧 Email: ${securityEmail}`);
      console.log(`🔑 Password length: ${securityPassword.length}`);

      // Fix: Use createTransport (not createTransporter)
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail service for better compatibility
        host: 'smtp.gmail.com',
        port: 587, // Use port 587 for better compatibility
        secure: false, // Use STARTTLS instead of SSL
        auth: {
          user: securityEmail,
          pass: securityPassword,
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates for development
          ciphers: 'SSLv3'
        },
        debug: true, // Enable debug logging
        logger: true // Enable logger
      });

      // Verify SMTP connection with better error handling
      if (this.transporter) {
        console.log('🔍 Verifying SMTP connection...');
        await this.transporter.verify();
        console.log('✅ Security email service initialized successfully');
        console.log(`📧 Using security email: ${securityEmail}`);
      }
    } catch (error) {
      console.error('❌ Failed to initialize security email service:', error);
      console.error('Error details:', error.message);

      // Try alternative configuration with correct method name
      try {
        console.log('🔄 Trying alternative email configuration...');
        this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'nexdevs.org@gmail.com',
            pass: 'hcgn fypy ylnm pvud',
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await this.transporter.verify();
        console.log('✅ Alternative email configuration successful');
      } catch (altError) {
        console.error('❌ Alternative configuration also failed:', altError.message);
        this.transporter = null;
      }
    }
  }

  // Send security alert email with comprehensive device details
  async sendSecurityAlert(alertData: {
    event: SecurityEvent;
    recentEvents: SecurityEvent[];
    summary: {
      totalEvents: number;
      timeWindow: string;
      severity: string;
      clientIP: string;
      userAgent: string;
    };
  }): Promise<boolean> {
    // Initialize transporter if not already done
    if (!this.transporter) {
      console.log('🔄 Transporter not initialized, initializing now...');
      await this.initializeTransporter();
    }

    if (!this.transporter) {
      console.error('❌ Email transporter still not initialized after retry');
      return false;
    }

    try {
      const { event, recentEvents, summary } = alertData;

      console.log('📧 Preparing security alert email...');
      console.log('Event details:', {
        type: event.type,
        severity: event.severity,
        username: event.username,
        clientIP: summary.clientIP
      });

      // Generate email content with enhanced device details
      const subject = this.generateSubject(event);
      const htmlContent = this.generateHtmlContent(event, recentEvents, summary);
      const textContent = this.generateTextContent(event, recentEvents, summary);

      const mailOptions = {
        from: {
          name: 'NEX-DEVS Security Monitor',
          address: 'nexdevs.org@gmail.com'
        },
        to: 'nexdevs.org@gmail.com', // Send to your security email
        subject,
        text: textContent,
        html: htmlContent,
        priority: event.severity === 'critical' || event.severity === 'high' ? 'high' : 'normal'
      };

      console.log('📤 Sending security alert email...');
      console.log('Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Security alert email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('Response:', info.response);
      return true;

    } catch (error) {
      console.error('❌ Failed to send security alert email:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      return false;
    }
  }

  // Generate email subject based on event type and severity
  private generateSubject(event: SecurityEvent): string {
    const severityEmoji = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨'
    };

    const eventTypeMap = {
      failed_login: 'Failed Login Attempt',
      unauthorized_access: 'Unauthorized Access Attempt',
      suspicious_activity: 'Suspicious Activity Detected',
      rate_limit_exceeded: 'Rate Limit Exceeded',
      ip_blocked: 'IP Address Blocked',
      session_hijack_attempt: 'Session Hijack Attempt'
    };

    return `${severityEmoji[event.severity]} NEX-DEVS Security Alert: ${eventTypeMap[event.type]} - ${event.severity.toUpperCase()}`;
  }

  // Generate HTML email content
  private generateHtmlContent(
    event: SecurityEvent,
    recentEvents: SecurityEvent[],
    summary: any
  ): string {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>NEX-DEVS Security Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert-box { background: #fff; border-left: 4px solid #e74c3c; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
        .info-item { background: white; padding: 10px; border-radius: 4px; border: 1px solid #ddd; }
        .severity-critical { border-left-color: #e74c3c; }
        .severity-high { border-left-color: #f39c12; }
        .severity-medium { border-left-color: #f1c40f; }
        .severity-low { border-left-color: #27ae60; }
        .event-list { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .event-item { padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 NEX-DEVS Security Alert</h1>
            <p>Unauthorized access attempt detected on your admin panel</p>
        </div>
        
        <div class="content">
            <div class="alert-box severity-${event.severity}">
                <h2>🚨 Security Event: ${event.type.replace('_', ' ').toUpperCase()}</h2>
                <p><strong>Severity:</strong> ${event.severity.toUpperCase()}</p>
                <p><strong>Time:</strong> ${formatDate(event.timestamp)}</p>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <strong>🌐 IP Address:</strong><br>
                    <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${summary.clientIP}</code>
                </div>
                <div class="info-item">
                    <strong>👤 Username Attempted:</strong><br>
                    <code style="background: #fef2f2; color: #dc2626; padding: 2px 6px; border-radius: 4px;">${event.username || 'N/A'}</code>
                </div>
                <div class="info-item">
                    <strong>📊 Total Recent Events:</strong><br>
                    <span style="font-weight: bold; color: #dc2626;">${summary.totalEvents}</span> in ${summary.timeWindow}
                </div>
                <div class="info-item">
                    <strong>🚨 Event Type:</strong><br>
                    ${event.type.replace('_', ' ').toUpperCase()}
                </div>
                <div class="info-item">
                    <strong>⏰ Timestamp:</strong><br>
                    ${formatDate(event.timestamp)}
                </div>
                <div class="info-item">
                    <strong>⚠️ Severity Level:</strong><br>
                    <span style="color: ${event.severity === 'high' ? '#dc2626' : event.severity === 'medium' ? '#f59e0b' : '#10b981'}; font-weight: bold; font-size: 16px;">
                        ${event.severity.toUpperCase()}
                    </span>
                </div>
            </div>

            <!-- IP Address & Geolocation Section -->
            <div style="margin: 20px 0; padding: 15px; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #dc2626;">🌍 IP Address & Location Tracking</h3>
                <div style="font-family: monospace; font-size: 12px; line-height: 1.6;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <strong>🌐 IP Address:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0; color: #dc2626; font-weight: bold;">
                                ${summary.clientIP}
                            </div>
                        </div>
                        <div>
                            <strong>🔍 IP Lookup:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                                <a href="https://whatismyipaddress.com/ip/${summary.clientIP}" target="_blank" style="color: #3b82f6;">Track Location</a> |
                                <a href="https://www.iplocation.net/ip-lookup?query=${summary.clientIP}" target="_blank" style="color: #3b82f6;">IP Details</a>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 10px;">
                        <strong>🗺️ Geographic Information:</strong><br>
                        <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                            • Check <a href="https://ipinfo.io/${summary.clientIP}" target="_blank" style="color: #3b82f6;">IPInfo.io</a> for exact location<br>
                            • Verify with <a href="https://www.maxmind.com/en/geoip-demo?ip=${summary.clientIP}" target="_blank" style="color: #3b82f6;">MaxMind GeoIP</a><br>
                            • Cross-reference with <a href="https://db-ip.com/${summary.clientIP}" target="_blank" style="color: #3b82f6;">DB-IP</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Device & Browser Fingerprinting -->
            <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #0369a1;">🖥️ Device Fingerprinting & Browser Analysis</h3>
                <div style="font-family: monospace; font-size: 12px; line-height: 1.6;">
                    <strong>🔍 Complete User Agent String:</strong><br>
                    <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0; word-break: break-all; border: 1px solid #e5e7eb;">
                        ${summary.userAgent}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <div>
                            <strong>🖥️ Operating System:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                                ${this.extractOS(summary.userAgent)}
                            </div>
                        </div>
                        <div>
                            <strong>🌐 Browser:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                                ${this.extractBrowser(summary.userAgent)}
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <div>
                            <strong>📱 Device Type:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                                ${this.extractDeviceType(summary.userAgent)}
                            </div>
                        </div>
                        <div>
                            <strong>🏗️ Architecture:</strong><br>
                            <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                                ${this.extractArchitecture(summary.userAgent)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Network & Connection Details -->
            <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #15803d;">🌐 Network & Connection Analysis</h3>
                <div style="font-family: monospace; font-size: 12px; line-height: 1.6;">
                    ${event.details?.referer && event.details.referer !== 'unknown' ? `
                    <strong>🔗 Referer Page (Where they came from):</strong><br>
                    <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0; word-break: break-all;">
                        ${event.details.referer}
                    </div>
                    ` : ''}

                    ${event.details?.origin && event.details.origin !== 'unknown' ? `
                    <strong>🏠 Origin Domain:</strong><br>
                    <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0; word-break: break-all;">
                        ${event.details.origin}
                    </div>
                    ` : ''}

                    ${event.details?.acceptLanguage && event.details.acceptLanguage !== 'unknown' ? `
                    <strong>🌍 Language Preferences:</strong><br>
                    <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                        ${event.details.acceptLanguage}
                    </div>
                    ` : ''}

                    <strong>⏰ Attack Timeline:</strong><br>
                    <div style="background: white; padding: 8px; border-radius: 4px; margin: 5px 0;">
                        First Attempt: ${formatDate(event.timestamp)}<br>
                        Total Attempts: ${event.details?.attempts || 1}<br>
                        Time Window: ${summary.timeWindow}
                    </div>
                </div>
            </div>

            <!-- Investigation Tools -->
            <div style="margin: 20px 0; padding: 15px; background: #fefce8; border-left: 4px solid #eab308; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #a16207;">🔍 Investigation & Tracking Tools</h3>
                <div style="font-size: 12px; line-height: 1.6;">
                    <strong>🕵️ Recommended Investigation Steps:</strong><br>
                    <div style="background: white; padding: 10px; border-radius: 4px; margin: 5px 0;">
                        1. <strong>IP Geolocation:</strong> <a href="https://whatismyipaddress.com/ip/${summary.clientIP}" target="_blank" style="color: #3b82f6;">Check exact location</a><br>
                        2. <strong>ISP Information:</strong> <a href="https://whois.net/ip-address-lookup/${summary.clientIP}" target="_blank" style="color: #3b82f6;">WHOIS lookup</a><br>
                        3. <strong>Threat Intelligence:</strong> <a href="https://www.virustotal.com/gui/ip-address/${summary.clientIP}" target="_blank" style="color: #3b82f6;">VirusTotal scan</a><br>
                        4. <strong>Reputation Check:</strong> <a href="https://www.abuseipdb.com/check/${summary.clientIP}" target="_blank" style="color: #3b82f6;">AbuseIPDB report</a><br>
                        5. <strong>Network Analysis:</strong> <a href="https://mxtoolbox.com/SuperTool.aspx?action=blacklist%3a${summary.clientIP}" target="_blank" style="color: #3b82f6;">Blacklist check</a>
                    </div>

                    <strong>📊 Browser Fingerprint Analysis:</strong><br>
                    <div style="background: white; padding: 10px; border-radius: 4px; margin: 5px 0;">
                        • User Agent: ${this.extractBrowser(summary.userAgent)} on ${this.extractOS(summary.userAgent)}<br>
                        • Device: ${this.extractDeviceType(summary.userAgent)}<br>
                        • Architecture: ${this.extractArchitecture(summary.userAgent)}<br>
                        • Language: ${event.details?.acceptLanguage || 'Unknown'}
                    </div>
                </div>
            </div>



            ${event.details ? `
            <div class="info-item" style="margin: 15px 0;">
                <strong>Additional Details:</strong><br>
                <pre style="font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(event.details, null, 2)}</pre>
            </div>
            ` : ''}

            ${recentEvents.length > 1 ? `
            <div class="event-list">
                <h3>Recent Related Events (${recentEvents.length} total):</h3>
                ${recentEvents.slice(0, 5).map(evt => `
                    <div class="event-item">
                        <strong>${formatDate(evt.timestamp)}</strong> - ${evt.type} 
                        ${evt.username ? `(${evt.username})` : ''} - ${evt.severity}
                    </div>
                `).join('')}
                ${recentEvents.length > 5 ? `<div class="event-item"><em>... and ${recentEvents.length - 5} more events</em></div>` : ''}
            </div>
            ` : ''}

            <div class="alert-box">
                <h3>🛡️ Recommended Actions:</h3>
                <ul>
                    <li>Review the IP address and determine if it's legitimate</li>
                    <li>Check server logs for additional suspicious activity</li>
                    <li>Consider implementing IP blocking if attacks persist</li>
                    <li>Verify that your admin credentials are secure</li>
                    <li>Monitor for any successful unauthorized access</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated security alert from NEX-DEVS Security Monitor</p>
            <p>Generated at ${formatDate(new Date().toISOString())}</p>
        </div>
    </div>
</body>
</html>`;
  }

  // Generate plain text email content
  private generateTextContent(
    event: SecurityEvent,
    recentEvents: SecurityEvent[],
    summary: any
  ): string {
    return `
NEX-DEVS SECURITY ALERT
=======================

Security Event: ${event.type.replace('_', ' ').toUpperCase()}
Severity: ${event.severity.toUpperCase()}
Time: ${new Date(event.timestamp).toISOString()}

ATTACK DETAILS:
===============
🌐 IP Address: ${summary.clientIP}
👤 Username Attempted: ${event.username || 'N/A'}
📊 Total Recent Events: ${summary.totalEvents} in ${summary.timeWindow}
⏰ Timestamp: ${new Date(event.timestamp).toISOString()}
⚠️ Severity: ${event.severity.toUpperCase()}

IP ADDRESS & LOCATION TRACKING:
===============================
🌍 IP Address: ${summary.clientIP}
🔍 IP Lookup Tools:
   • Location: https://whatismyipaddress.com/ip/${summary.clientIP}
   • Details: https://www.iplocation.net/ip-lookup?query=${summary.clientIP}
   • GeoIP: https://ipinfo.io/${summary.clientIP}
   • WHOIS: https://whois.net/ip-address-lookup/${summary.clientIP}
   • Threat Check: https://www.virustotal.com/gui/ip-address/${summary.clientIP}
   • Reputation: https://www.abuseipdb.com/check/${summary.clientIP}

DEVICE FINGERPRINTING & ANALYSIS:
=================================
🖥️ Operating System: ${this.extractOS(summary.userAgent)}
🌐 Browser: ${this.extractBrowser(summary.userAgent)}
📱 Device Type: ${this.extractDeviceType(summary.userAgent)}
🏗️ Architecture: ${this.extractArchitecture(summary.userAgent)}

🔍 Complete User Agent String:
${summary.userAgent}

NETWORK & CONNECTION DETAILS:
=============================
${event.details?.referer && event.details.referer !== 'unknown' ? `🔗 Referer Page: ${event.details.referer}` : ''}
${event.details?.origin && event.details.origin !== 'unknown' ? `🌐 Origin Domain: ${event.details.origin}` : ''}
${event.details?.acceptLanguage && event.details.acceptLanguage !== 'unknown' ? `🌍 Language Preferences: ${event.details.acceptLanguage}` : ''}

ATTACK TIMELINE:
===============
⏰ First Attempt: ${new Date(event.timestamp).toISOString()}
🔢 Total Attempts: ${event.details?.attempts || 1}
⏱️ Time Window: ${summary.timeWindow}
🚫 Block Duration: ${event.details?.blockDuration || 'N/A'}
🏷️ Event Type: ${event.type.replace('_', ' ').toUpperCase()}
🌍 Environment: ${event.details?.environment || 'Unknown'}

${event.details ? `
Additional Details:
${JSON.stringify(event.details, null, 2)}
` : ''}

${recentEvents.length > 1 ? `
RECENT RELATED EVENTS (${recentEvents.length} total):
${recentEvents.slice(0, 5).map(evt => 
  `- ${new Date(evt.timestamp).toISOString()} - ${evt.type} ${evt.username ? `(${evt.username})` : ''} - ${evt.severity}`
).join('\n')}
${recentEvents.length > 5 ? `... and ${recentEvents.length - 5} more events` : ''}
` : ''}

RECOMMENDED ACTIONS:
-------------------
- Review the IP address and determine if it's legitimate
- Check server logs for additional suspicious activity  
- Consider implementing IP blocking if attacks persist
- Verify that your admin credentials are secure
- Monitor for any successful unauthorized access

This is an automated security alert from NEX-DEVS Security Monitor
Generated at ${new Date().toISOString()}
`;
  }

  // Helper methods for device fingerprinting
  private extractOS(userAgent: string): string {
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
    if (userAgent.includes('Windows NT')) return 'Windows (Other)';
    if (userAgent.includes('Mac OS X')) {
      const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
    }
    if (userAgent.includes('Linux')) {
      if (userAgent.includes('Android')) {
        const match = userAgent.match(/Android (\d+\.?\d*\.?\d*)/);
        return match ? `Android ${match[1]}` : 'Android';
      }
      return 'Linux';
    }
    if (userAgent.includes('iPhone OS')) {
      const match = userAgent.match(/iPhone OS (\d+[._]\d+[._]?\d*)/);
      return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
    }
    if (userAgent.includes('iPad')) return 'iPadOS';
    return 'Unknown OS';
  }

  private extractBrowser(userAgent: string): string {
    if (userAgent.includes('Edg/')) {
      const match = userAgent.match(/Edg\/(\d+\.?\d*\.?\d*\.?\d*)/);
      return match ? `Microsoft Edge ${match[1]}` : 'Microsoft Edge';
    }
    if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
      const match = userAgent.match(/Chrome\/(\d+\.?\d*\.?\d*\.?\d*)/);
      return match ? `Google Chrome ${match[1]}` : 'Google Chrome';
    }
    if (userAgent.includes('Firefox/')) {
      const match = userAgent.match(/Firefox\/(\d+\.?\d*\.?\d*)/);
      return match ? `Mozilla Firefox ${match[1]}` : 'Mozilla Firefox';
    }
    if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
      const match = userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/);
      return match ? `Safari ${match[1]}` : 'Safari';
    }
    if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) {
      const match = userAgent.match(/(?:Opera\/|OPR\/)(\d+\.?\d*\.?\d*)/);
      return match ? `Opera ${match[1]}` : 'Opera';
    }
    return 'Unknown Browser';
  }

  private extractDeviceType(userAgent: string): string {
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
      if (userAgent.includes('iPhone')) return 'iPhone';
      if (userAgent.includes('iPad')) return 'iPad';
      if (userAgent.includes('Android')) {
        if (userAgent.includes('Mobile')) return 'Android Phone';
        return 'Android Tablet';
      }
      return 'Mobile Device';
    }
    if (userAgent.includes('Tablet')) return 'Tablet';
    if (userAgent.includes('Smart TV') || userAgent.includes('TV')) return 'Smart TV';
    if (userAgent.includes('PlayStation') || userAgent.includes('Xbox')) return 'Gaming Console';
    return 'Desktop/Laptop';
  }

  private extractArchitecture(userAgent: string): string {
    if (userAgent.includes('WOW64') || userAgent.includes('Win64; x64')) return '64-bit (x64)';
    if (userAgent.includes('Win32')) return '32-bit (x86)';
    if (userAgent.includes('Intel Mac OS X')) return '64-bit (Intel)';
    if (userAgent.includes('PPC Mac OS X')) return 'PowerPC';
    if (userAgent.includes('ARM64') || userAgent.includes('arm64')) return '64-bit (ARM)';
    if (userAgent.includes('armv7') || userAgent.includes('armv6')) return '32-bit (ARM)';
    if (userAgent.includes('x86_64')) return '64-bit (x64)';
    if (userAgent.includes('i686') || userAgent.includes('i386')) return '32-bit (x86)';
    return 'Unknown Architecture';
  }
}

// Export singleton instance
export const emailSecurityService = EmailSecurityService.getInstance();
