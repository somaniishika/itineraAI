import { toTitleCase } from "src/common/utils/title-case.utils";

export function budgetPlanningNotificationTemplate(fullname: string, budgetId: string, travel_location: string, trip_duration: number) {
    const logoUrl = process.env.WAYVENTURES_LOGO_URL
    const full_name = toTitleCase(fullname);
    const budgetPageUrl = `${process.env.WAYVENTURES_BUDGET_PAGE_URL}/${budgetId}`;
    const subject = 'Your Smart Budget Plan is Ready!';
    const text = `Hello ${full_name}, your personalized travel budget breakdown is ready!`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Smart Budget Plan is Ready!</title>
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
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
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
            background: linear-gradient(45deg, #2ecc71, #27ae60);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        }
        .budget-info {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        .budget-amount {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .budget-details {
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
            border-left: 4px solid #2ecc71;
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
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
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
            color: #2ecc71;
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
            background: #2ecc71;
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
        .budget-breakdown {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        .breakdown-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .breakdown-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .breakdown-category {
            display: flex;
            align-items: center;
        }
        .breakdown-icon {
            margin-right: 8px;
            font-size: 16px;
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
            background-color: #2ecc71;
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
            .budget-amount {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="WayVentures Logo" class="logo">
            <h1 class="header-title">💰 Your Budget Plan is Ready!</h1>
            <p class="header-subtitle">Smart spending insights for your dream trip</p>
        </div>
        
        <div class="content">
            <div class="ready-badge">
                ✨ BUDGET READY
            </div>
            
            <h2>Hello ${full_name}!</h2>
            
            <p>Fantastic news! Our AI financial advisor has analyzed your travel preferences and created a comprehensive budget breakdown for your upcoming adventure.</p>
            
            <div class="budget-info">
                <div class="budget-details">📍 ${travel_location} • ${trip_duration} Days</div>
            </div>
            
            <div class="budget-breakdown">
                <div class="breakdown-title">💡 Smart Budget Breakdown</div>
                <div class="breakdown-item">
                    <div class="breakdown-category">
                        <span class="breakdown-icon">🏨</span>
                        <span>Accommodation</span>
                    </div>
                    <span>35-40%</span>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-category">
                        <span class="breakdown-icon">🍽️</span>
                        <span>Food & Dining</span>
                    </div>
                    <span>25-30%</span>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-category">
                        <span class="breakdown-icon">🎯</span>
                        <span>Activities & Tours</span>
                    </div>
                    <span>20-25%</span>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-category">
                        <span class="breakdown-icon">🚗</span>
                        <span>Transportation</span>
                    </div>
                    <span>10-15%</span>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-category">
                        <span class="breakdown-icon">🛍️</span>
                        <span>Shopping & Misc</span>
                    </div>
                    <span>5-10%</span>
                </div>
            </div>
            
            <div class="highlights">
                <h3 style="margin-top: 0; color: #2c3e50;">What's Inside Your Budget Plan:</h3>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Detailed daily spending recommendations</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Cost-effective alternatives for every category</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Money-saving tips and local insights</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-icon">✓</div>
                    <div>Emergency fund recommendations</div>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Smart Analytics</div>
                    <div class="feature-desc">AI-powered spending analysis based on your destination</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💡</div>
                    <div class="feature-title">Money-Saving Tips</div>
                    <div class="feature-desc">Insider secrets to stretch your budget further</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-title">Personalized</div>
                    <div class="feature-desc">Tailored recommendations matching your travel style</div>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin-top: 0;">Ready to Master Your Travel Budget?</h3>
                <p style="margin-bottom: 0;">Your comprehensive budget plan is waiting. View detailed breakdowns, get money-saving tips, and track your expenses!</p>
                <a href="${budgetPageUrl}" class="cta-button">
                    💰 View My Budget Plan
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Pro Tip:</strong> Set aside 10-15% of your total budget as an emergency fund for unexpected expenses or spontaneous adventures!
            </p>
            
            <p style="margin-top: 25px;">
                Need to adjust your budget? No worries! You can customize spending categories and explore different budget scenarios to find what works best for you.
            </p>
            
            <p>Smart spending, amazing experiences!<br>
            <strong>The WayVentures AI Team</strong> 🤖💰</p>
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