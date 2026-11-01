import { toTitleCase } from 'src/common/utils/title-case.utils';

export function tripLengthGuideTemplate(
  userName: string,
  guideId:string,
  location: string,
 
) {
  const logoUrl = process.env.WAYVENTURES_LOGO_URL;
  const full_name = toTitleCase(userName);
  const guidePageUrl = `${process.env.WAYVENTURES_GUIDE_PAGE_URL}`;
  const subject = `Your ${location} Trip Guide is Ready`;
  const text = `Hello ${full_name}, your personalized trip length guide for ${location} is ready.`;
  const currentYear = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Trip Length Guide is Ready</title>
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
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .logo {
            max-width: 160px;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
            border-radius: 20px;
        }
        .header-title {
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            position: relative;
            z-index: 2;
        }
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin: 10px 0 0 0;
            position: relative;
            z-index: 2;
        }
        .content {
            padding: 40px 30px;
        }
        .ready-badge {
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .destination-info {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        .destination-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .destination-subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: #f8f9ff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #667eea;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .feature-title {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        .feature-desc {
            font-size: 13px;
            color: #666;
        }
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            color: white;
        }
        .cta-button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #fff;
            color: #667eea;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            font-size: 16px;
            margin-top: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        .highlights {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .highlight-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .highlight-item:last-child {
            margin-bottom: 0;
        }
        .highlight-icon {
            background: #28a745;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
        }
        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #667eea;
            border-radius: 50%;
            margin: 0 8px;
            line-height: 40px;
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: transform 0.3s;
        }
        .social-icon:hover {
            transform: scale(1.1);
        }
        .footer-links {
            margin-top: 20px;
            font-size: 12px;
        }
        .footer-links a {
            color: #bbb;
            text-decoration: none;
            margin: 0 10px;
        }
        @media (max-width: 600px) {
            .features-grid {
                grid-template-columns: 1fr;
            }
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" alt="WayVentures Logo" class="logo">` : ''}
            <h1 class="header-title">🗺️ Your Trip Guide is Ready!</h1>
            <p class="header-subtitle">AI-crafted insights for perfect trip planning</p>
        </div>
        
        <div class="content">
            <div class="ready-badge">
                ✨ TRIP GUIDE READY
            </div>
            
            <h2>Hello ${full_name}!</h2>
            
            <p>Exciting news! Our AI travel expert has finished creating your personalized trip length guide. Get ready to plan the perfect duration for your adventure!</p>
            
            <div class="destination-info">
                <div class="destination-name">🌍 ${location}</div>
                <div class="destination-subtitle">🕒 Smart Duration Planning Made Easy</div>
            </div>
            
            <div class="highlights">
                <h3 style="margin-top: 0; color: #2c3e50;">What's Inside Your Trip Guide:</h3>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Minimum, optimal, and extended stay recommendations</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Top attractions with suggested time allocations</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Smart travel tips and logistics guidance</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Budget-adjusted duration suggestions</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Group-specific planning advice</div>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">⏰</div>
                    <div class="feature-title">Optimal Duration</div>
                    <div class="feature-desc">AI-calculated perfect trip length for your destination</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📍</div>
                    <div class="feature-title">Attraction Timing</div>
                    <div class="feature-desc">Time allocations for must-visit places and experiences</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💡</div>
                    <div class="feature-title">Smart Tips</div>
                    <div class="feature-desc">Expert insights for efficient travel planning</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <div class="feature-title">Budget Planning</div>
                    <div class="feature-desc">Duration recommendations based on your budget</div>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin-top: 0;">Ready to Plan Your Perfect Trip?</h3>
                <p style="margin-bottom: 0;">Your personalized trip length guide is waiting for you. Click below to discover the ideal duration for your ${location} adventure!</p>
                <a href="${guidePageUrl}" class="cta-button">
                    🔍 View My Trip Guide
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Pro Tip:</strong> Use our recommendations as a starting point and adjust based on your personal travel style and interests!
            </p>
            
            <p style="margin-top: 25px;">
                We hope this guide helps you plan the most amazing trip to ${location}. Whether you're planning a quick getaway or an extended adventure, we've got you covered! 🌍
            </p>
            
            <p>Safe travels and happy planning!<br>
            <strong>The WayVentures AI Team</strong> 🤖✈️</p>
        </div>
        
        <div class="footer">
            <h4>Stay Connected</h4>
            <p style="margin: 0; opacity: 0.8;">© ${currentYear} WayVentures. Creating unforgettable journeys with AI.</p>
            <div class="footer-links">
                <a href="#">Help Center</a> |
                <a href="#">Privacy Policy</a> |
                <a href="#">Unsubscribe</a> |
                <a href="#">Contact Support</a>
            </div>
        </div>
    </div>
</body>
</html>`;

  return { subject, text, html };
}