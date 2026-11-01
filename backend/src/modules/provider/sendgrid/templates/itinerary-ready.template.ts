import { toTitleCase } from "src/common/utils/title-case.utils";

export function itineraryNotificationTemplate(fullname: string, itineraryId: string, travel_location: string, trip_duration: number) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const full_name=toTitleCase(fullname);
    const itineraryPageUrl = `${process.env.WAYVENTURES_ITINERARY_PAGE_URL}/${itineraryId}`;
    const subject= 'Your Dream Itinerary is Ready!';
    const text = `Hello ${full_name}, your personalized travel itinerary is ready!`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Dream Itinerary is Ready!</title>
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
        .trip-duration {
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
            <img src="${logoUrl}" alt="WayVentures Logo" class="logo">
            <h1 class="header-title">🎉 Your Adventure Awaits!</h1>
            <p class="header-subtitle">Your AI-crafted itinerary is ready to explore</p>
        </div>
        
        <div class="content">
            <div class="ready-badge">
                ✨ ITINERARY READY
            </div>
            
            <h2>Hello ${full_name}!</h2>
            
            <p>Great news! Our AI travel expert has finished crafting your personalized travel itinerary. Get ready to embark on an unforgettable journey!</p>
            
            <div class="destination-info">
                <div class="destination-name">🌍 ${travel_location}</div>
                <div class="trip-duration">📅 ${trip_duration} Days of Pure Adventure </div>
            </div>
            
            <div class="highlights">
                <h3 style="margin-top: 0; color: #2c3e50;">What's Inside Your Itinerary:</h3>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Personalized daily schedules tailored to your interests</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>AI-curated destinations and activities recommendations</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Optimized travel routes and timing suggestions</div>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🗓️</div>
                    <div class="feature-title">Smart Planning</div>
                    <div class="feature-desc">AI-organized daily schedule based on your preferences</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📍</div>
                    <div class="feature-title">Top Attractions</div>
                    <div class="feature-desc">Must-visit places curated for your destination</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <div class="feature-title">Personalized</div>
                    <div class="feature-desc">Customized recommendations matching your interests</div>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin-top: 0;">Ready to Start Your Adventure?</h3>
                <p style="margin-bottom: 0;">Your personalized itinerary is waiting for you. Click below to view, customize, and download your travel plan!</p>
                <a href="${itineraryPageUrl}" class="cta-button">
                    🚀 View My Itinerary
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Pro Tip:</strong> You can customize and adjust your itinerary anytime to make it perfectly suited to your travel style!
            </p>
            
            <p style="margin-top: 25px;">
                Need to make changes? No problem! You can customize every aspect of your itinerary to make it perfectly suited to your preferences.
            </p>
            
            <p>Safe travels and happy adventures!<br>
            <strong>The WayVentures AI Team</strong> 🤖✈️</p>
        </div>
        
        <div class="footer">
            <h4>Stay Connected</h4>
            <div class="social-links">
                <a href="#" class="social-icon">f</a>
                <a href="#" class="social-icon">ig</a>
                <a href="#" class="social-icon">tw</a>
                <a href="#" class="social-icon">yt</a>
            </div>
            <p style="margin: 0; opacity: 0.8;">© 2025 WayVentures. Creating unforgettable journeys with AI.</p>
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
  