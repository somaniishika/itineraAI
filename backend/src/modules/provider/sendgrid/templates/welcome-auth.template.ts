export function welcomeEmailAuthTemplate(fullname: string) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const wayventuresUrl = process.env.WAYVENTURES_URL
    const subject = 'Welcome to WayVentures! Your Journey Begins Here';
    const text = `Welcome to WayVentures! We're excited to help you create amazing travel experiences.`
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
            .welcome-highlight {
                background-color: #f2f7ff;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                margin: 25px 0;
                border-left: 4px solid #3498db;
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
            .credits-info {
                background-color: #e8f5e8;
                border-radius: 6px;
                padding: 20px;
                margin: 25px 0;
                border-left: 4px solid #27ae60;
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
                    <p>Welcome aboard! We're thrilled to have you join the WayVentures community. Your account is now ready, and we can't wait to help you discover amazing travel experiences tailored just for you.</p>
                </div>
                
                <div class="welcome-highlight">
                    <h3 style="margin-top: 0; color: #3498db;">🎉 You're All Set!</h3>
                    <p>Your Google account has been successfully connected, and you can start exploring right away.</p>
                </div>

                <div class="credits-info">
                    <h3 style="margin-top: 0; color: #27ae60;">🎁 Welcome Gift</h3>
                    <p><strong>Great news!</strong> We've added free credits to your account to get you started:</p>
                    <ul style="text-align: left; margin: 15px 0;">
                        <li><strong>Free Itinerary Credits</strong> - Create your first personalized travel plans</li>
                        <li><strong>Emergency Contact Credits</strong> - Stay safe with our emergency features</li>
                    </ul>
                </div>
                
                <p>Here's what you can do with WayVentures:</p>
                
                <div class="feature-highlights">
                    <div class="feature-item">
                        <div class="feature-icon">🤖</div>
                        <div><strong>AI-Powered Personalized Itineraries</strong> - Get travel plans that match your interests and budget</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <div><strong>Budget-Based Travel Planning</strong> - Plan amazing trips within your budget</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎒</div>
                        <div><strong>Smart Packing Lists</strong> - Never forget essential items again</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🆘</div>
                        <div><strong>Emergency Contact Management</strong> - Stay connected and safe during your travels</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${wayventuresUrl}" class="button">Start Planning Your Next Adventure</a>
                </div>
                
                <p style="margin-top: 30px;">Need help getting started? Check out our <a href="${wayventuresUrl}/help" style="color: #3498db;">Help Center</a> or contact our support team. We're here to make your travel planning experience amazing.</p>
                
                <p>Ready to explore the world with AI as your guide?</p>
                
                <p>Happy Travels!<br>
                <strong>The WayVentures Team</strong></p>
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