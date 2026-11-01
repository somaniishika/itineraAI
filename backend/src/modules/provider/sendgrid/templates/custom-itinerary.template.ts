import { toTitleCase } from "src/common/utils/title-case.utils";

export function customItineraryNotificationTemplate(
    fullname: string, 
    itineraryId: string, 
    travel_location: string, 
    trip_duration: number, 
    customizedItinerary: any
) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL;
    const full_name = toTitleCase(fullname);
    const itineraryPageUrl = `${process.env.WAYVENTURES_ITINERARY_PAGE_URL}/${itineraryId}`;
    const subject = 'Your Custom Itinerary is Ready! 🎨';
    const text = `Hello ${full_name}, your personalized custom travel itinerary has been successfully generated!`;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Custom Itinerary is Ready!</title>
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
            background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
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
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.2; }
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
        .custom-badge {
            background: linear-gradient(45deg, #e74c3c, #f39c12);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }
        .destination-info {
            background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
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
        .customization-summary {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .customization-title {
            color: #856404;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .customization-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #6c757d;
        }
        .customization-item:last-child {
            margin-bottom: 0;
        }
        .customization-icon {
            background: #ffc107;
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-size: 10px;
            font-weight: bold;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: #fff8f0;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #e74c3c;
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
            background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
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
            color: #e74c3c;
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
            background: #e74c3c;
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
            background-color: #e74c3c;
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
            <h1 class="header-title">🎨 Your Custom Itinerary is Ready!</h1>
            <p class="header-subtitle">Tailored exactly to your preferences and requests</p>
        </div>
        
        <div class="content">
            <div class="custom-badge">
                ✨ CUSTOM ITINERARY GENERATED
            </div>
            
            <h2>Hello ${full_name}!</h2>
            
            <p>Fantastic news! We've successfully customized your travel itinerary based on your specific requests. Your personalized travel plan is now ready with all the modifications you requested!</p>
            
            <div class="destination-info">
                <div class="destination-name">🌍 ${travel_location}</div>
                <div class="trip-duration">📅 ${trip_duration} Days of Customized Adventure</div>
            </div>
            
            <div class="customization-summary">
                <div class="customization-title">🎯 Your Customizations Applied:</div>
                <div class="customization-item">
                    <div class="customization-icon">✓</div>
                    <div>All your specific requests have been incorporated</div>
                </div>
                <div class="customization-item">
                    <div class="customization-icon">✓</div>
                    <div>Day-wise modifications applied as requested</div>
                </div>
                <div class="customization-item">
                    <div class="customization-icon">✓</div>
                    <div>Activities modified to match your preferences</div>
                </div>
                <div class="customization-item">
                    <div class="customization-icon">✓</div>
                    <div>Timeline and costs adjusted accordingly</div>
                </div>
            </div>
            
            <div class="highlights">
                <h3 style="margin-top: 0; color: #2c3e50;">What Makes This Itinerary Special:</h3>
                <div class="highlight-item">
                    <div class="highlight-icon">🎨</div>
                    <div>Fully customized based on your specific instructions</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">⚡</div>
                    <div>Smart modifications while maintaining travel flow</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">🎯</div>
                    <div>Perfectly tailored to your travel style and interests</div>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🛠️</div>
                    <div class="feature-title">Custom Built</div>
                    <div class="feature-desc">Modified exactly according to your requests</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎭</div>
                    <div class="feature-title">Your Vision</div>
                    <div class="feature-desc">Incorporates all your specific preferences</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⏱️</div>
                    <div class="feature-title">Optimized Flow</div>
                    <div class="feature-desc">Maintains perfect timing and logistics</div>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin-top: 0;">Your Personalized Adventure Awaits!</h3>
                <p style="margin-bottom: 0;">Your custom itinerary is ready with all your requested modifications. Click below to view your tailored travel plan!</p>
                <a href="${itineraryPageUrl}" class="cta-button">
                    🚀 View My Custom Itinerary
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Note:</strong> This itinerary has been specifically customized based on your requests. You can still make further adjustments if needed!
            </p>
            
            <p style="margin-top: 25px;">
                Love the customizations? You can always create more custom versions or share this personalized itinerary with your travel companions.
            </p>
            
            <p>Have an amazing customized journey!<br>
            <strong>The WayVentures AI Customization Team</strong> 🎨✈️</p>
        </div>
        
        <div class="footer">
            <h4>Stay Connected</h4>
            <div class="social-links">
                <a href="#" class="social-icon">f</a>
                <a href="#" class="social-icon">ig</a>
                <a href="#" class="social-icon">tw</a>
                <a href="#" class="social-icon">yt</a>
            </div>
            <p style="margin: 0; opacity: 0.8;">© 2025 WayVentures. Creating personalized journeys with AI.</p>
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