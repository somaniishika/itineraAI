export function otpPasswordResetTemplate(fullname: string, otp: string) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const wayventuresUrl = process.env.WAYVENTURES_URL
    const subject = 'WayVentures - Reset Your Password';
    const text = `Reset your WayVentures password`
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your WayVentures Password</title>
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
                <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
                <h1>Reset Your Password</h1>
                
                <div class="message">
                    <p>Hello ${fullname},</p>
                    <p>We received a request to reset your password for your WayVentures account. Use the code below to complete the password reset process:</p>
                </div>
                
                <div class="otp-container">
                    <p>Your Password Reset Code</p>
                    <div class="otp-code">${otp}</div>
                    <p>This code will expire in 10 minutes for security reasons</p>
                </div>
                
                <p>Please enter this code on the password reset page to create a new password.</p>
                
                <div class="security-notice">
                    <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately. Someone may be trying to access your account.
                </div>
                
                <p>For additional security, consider these tips after resetting your password:</p>
                <ul style="padding-left: 20px;">
                    <li>Use a unique password you don't use on other websites</li>
                    <li>Include a mix of letters, numbers, and special characters</li>
                    <li>Enable two-factor authentication in your account settings</li>
                </ul>
                
                <p style="margin-top: 30px;">Need help? Visit our <a href="${wayventuresUrl}/help" style="color: #3498db;">Help Center</a> or contact our support team.</p>
                
                <p>Safe Travels!<br>
                The WayVentures Security Team</p>
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