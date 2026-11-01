export function otpEmailChangeTemplate(fullname: string, newEmail: string, otp: string) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const wayventuresUrl = process.env.WAYVENTURES_URL
    const subject = 'WayVentures - Verify Your New Email Address';
    const text = `Verify your new email address for your WayVentures account`
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email Change Request</title>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #3498db, #1e5799);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .logo {
                max-width: 180px;
                margin-bottom: 15px;
                border-radius: 25px;
            }
            .content {
                padding: 30px;
            }
            h1 {
                color: #2c3e50;
                margin-top: 0;
            }
            .message {
                margin-bottom: 25px;
            }
            .otp-container {
                background-color: #f2f7ff;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                margin: 25px 0;
            }
            .otp-code {
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #3498db;
                padding: 10px;
                background-color: white;
                border-radius: 4px;
                display: inline-block;
                margin: 10px 0;
            }
            .security-notice {
                background-color: #fff8e1;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 25px 0;
                font-size: 14px;
            }
            .important-info {
                background-color: #e8f4fc;
                border-left: 4px solid #3498db;
                padding: 15px;
                margin: 25px 0;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 15px;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #2980b9;
            }
            .footer {
                background-color: #f0f0f0;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-icon {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #3498db;
                border-radius: 50%;
                margin: 0 5px;
                line-height: 32px;
                color: white;
                text-align: center;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="${logoUrl}" alt="WayVentures Logo" class="logo">
                <h2>Email Address Verification</h2>
            </div>
            
            <div class="content">
                <h1>Verify Your New Email Address</h1>
                
                <div class="message">
                    <p>Hello ${fullname},</p>
                    <p>We received a request to change your WayVentures account email to <strong>${newEmail}</strong>. To complete this change, please enter the verification code below:</p>
                </div>
                
                <div class="otp-container">
                    <p>Your Verification Code</p>
                    <div class="otp-code">${otp}</div>
                    <p>This code will expire in 10 minutes for security reasons</p>
                </div>
                
                <p>Please enter this code on the email verification page to complete your email address change.</p>
                
                <div class="important-info">
                    <strong>Note:</strong> After verification, this email (<strong>${newEmail}</strong>) will become your primary contact for all WayVentures communications and account recovery.
                </div>
                
                <div class="security-notice">
                    <strong>Security Notice:</strong> If you didn't request this email change, please log in to your WayVentures account immediately and check your account settings, or contact our support team for assistance.
                </div>
                
                <p>Why we verify new email addresses:</p>
                <ul style="padding-left: 20px;">
                    <li>To ensure you have access to this email address</li>
                    <li>To protect your account information</li>
                    <li>To maintain secure communication channels</li>
                </ul>
                
                <p style="margin-top: 30px;">Need help? Visit our <a href="${wayventuresUrl}/help" style="color: #3498db;">Help Center</a> or contact our support team.</p>
                
                <p>Thank you for keeping your account information up to date!<br>
                The WayVentures Team</p>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="#" class="social-icon">f</a>
                    <a href="#" class="social-icon">in</a>
                    <a href="#" class="social-icon">ig</a>
                </div>
                <p>© 2025 WayVentures. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
                <p><a href="#" style="color: #777;">Privacy Policy</a> | <a href="#" style="color: #777;">Terms of Service</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    return { subject, text, html };
}