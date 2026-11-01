export function otpEmailVerificationTemplate(fullname: string, otp: string) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const wayventuresUrl = process.env.WAYVENTURES_URL
    const subject= 'Welcome to WayVentures! Verify Your Email Address';
    const text = `Thank you for joining WayVentures!`
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WayVentures</title>
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
            .welcome-message {
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
            .feature-highlights {
                margin: 30px 0;
            }
            .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            .feature-icon {
                background-color: #e8f4fc;
                color: #3498db;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 18px;
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
                <h2>Your AI-Powered Travel Companion</h2>
            </div>
            
            <div class="content">
                <h1>Welcome to WayVentures!</h1>
                
                <div class="welcome-message">
                    <p>Hello ${fullname},</p>
                    <p>Thank you for joining WayVentures! We're excited to help you create personalized travel experiences that match your unique interests and preferences.</p>
                    <p>To get started, please verify your email address by entering the verification code below:</p>
                </div>
                
                <div class="otp-container">
                    <p>Your Verification Code</p>
                    <div class="otp-code">${otp}</div>
                    <p>This code will expire in 10 minutes</p>
                </div>
                
                <p>Once verified, you'll be able to explore all the smart features we offer:</p>
                
                <div class="feature-highlights">
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <div>AI-Powered Personalized Itineraries</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <div>Budget-Based Travel Planning</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <div>Smart Packing Lists</div>
                    </div>
                </div>
                
                <p style="margin-top: 30px;">If you have any questions, check out our <a href="${wayventuresUrl}/help" style="color: #3498db;">Help Center</a> or contact our support team.</p>
                
                <p>Happy Travels!<br>
                The WayVentures Team</p>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="#" class="social-icon">f</a>
                    <a href="#" class="social-icon">in</a>
                    <a href="#" class="social-icon">ig</a>
                </div>
                <p>© 2025 WayVentures. All rights reserved.</p>
                <p>You received this email because you signed up for WayVentures.</p>
                <p><a href="#" style="color: #777;">Privacy Policy</a> | <a href="#" style="color: #777;">Unsubscribe</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    return { subject, text, html };
  }
  