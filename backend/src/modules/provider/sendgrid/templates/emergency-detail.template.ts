import { toTitleCase } from "src/common/utils/title-case.utils";

export interface EmergencyContact {
  name: string;
  contact: string;
  type: string;
  address?: string;
  additional_info?: string;
}

export function emergencyContactTemplate(
  fullname: string, 
  location: string, 
  contacts: EmergencyContact[]
) {
  const logoUrl = process.env.WAYVENTURES_LOGO_URL;
  const full_name = toTitleCase(fullname);
  const subject = `🚨 Emergency Contacts for ${location}`;
  const text = `Hello ${full_name}, here are your emergency contacts for ${location}.`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Contacts for ${location}</title>
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
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
            animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
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
        .alert-badge {
            background: linear-gradient(45deg, #dc3545, #e74c3c);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            animation: blink 2s infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
        }
        .location-info {
            background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        .location-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .location-subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .contacts-grid {
            display: grid;
            gap: 20px;
            margin: 30px 0;
        }
        .contact-card {
            background: white;
            border: 2px solid #e9ecef;
            border-left: 6px solid #dc3545;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        .contact-card:hover {
            border-left-color: #c82333;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
        .contact-name {
            font-size: 20px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .contact-type {
            background: #f8f9fa;
            color: #6c757d;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 10px;
        }
        .contact-detail {
            display: flex;
            align-items: center;
            margin: 10px 0;
            font-size: 15px;
        }
        .contact-icon {
            width: 20px;
            margin-right: 12px;
            color: #6c757d;
        }
        .contact-phone {
            background: #e8f5e8;
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: bold;
            color: #155724;
            text-decoration: none;
            display: inline-block;
        }
        .contact-phone:hover {
            background: #d4edda;
            text-decoration: none;
        }
        .emergency-tips {
            background: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
            color: #212529;
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
        }
        .tips-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #856404;
        }
        .tip-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .tip-item:last-child {
            margin-bottom: 0;
        }
        .tip-icon {
            background: #fff;
            color: #ffc107;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .urgent-section {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        .urgent-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .urgent-number {
            font-size: 32px;
            font-weight: bold;
            margin: 15px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .footer {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .footer-info {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 15px;
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
        .save-reminder {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            text-align: center;
        }
        .save-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .contact-card {
                padding: 20px;
            }
            .contact-name {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${logoUrl}" alt="WayVentures Logo" class="logo">
            <h1 class="header-title">🚨 Emergency Information</h1>
            <p class="header-subtitle">Important contacts for your safety</p>
        </div>
        
        <div class="content">
            <div class="alert-badge">
                🚨 EMERGENCY CONTACTS
            </div>
            
            <h2>Hello ${full_name}!</h2>
            
            <p>Your safety is our priority. Here are the essential emergency contacts for your destination. Please save these contacts in your phone and keep them easily accessible during your trip.</p>
            
            <div class="location-info">
                <div class="location-name">📍 ${location}</div>
                <div class="location-subtitle">Emergency Contacts & Information</div>
            </div>
            
            <div class="save-reminder">
                <div class="save-icon">💾</div>
                <strong>Save these contacts to your phone immediately!</strong><br>
                Access to emergency services can be critical in urgent situations.
            </div>
            
            <div class="contacts-grid">
                ${contacts.map(contact => `
                    <div class="contact-card">
                        <div class="contact-name">
                            🏥 ${contact.name}
                            <span class="contact-type">${contact.type}</span>
                        </div>
                        <div class="contact-detail">
                            <span class="contact-icon">📞</span>
                            <a href="tel:${contact.contact}" class="contact-phone">${contact.contact}</a>
                        </div>
                        ${contact.address ? `
                        <div class="contact-detail">
                            <span class="contact-icon">📍</span>
                            <span>${contact.address}</span>
                        </div>
                        ` : ''}
                        ${contact.additional_info ? `
                        <div class="contact-detail">
                            <span class="contact-icon">ℹ️</span>
                            <span>${contact.additional_info}</span>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="urgent-section">
                <div class="urgent-title">⚡ IN CASE OF EMERGENCY</div>
                <div class="urgent-number">CALL IMMEDIATELY</div>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                    Don't hesitate to contact emergency services if you need immediate assistance
                </p>
            </div>
            
            <div class="emergency-tips">
                <div class="tips-title">⚠️ Emergency Safety Tips</div>
                <div class="tip-item">
                    <div class="tip-icon">1</div>
                    <div><strong>Save contacts immediately</strong> - Add these numbers to your phone's emergency contacts</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">2</div>
                    <div><strong>Know your location</strong> - Always be aware of your current address and nearby landmarks</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">3</div>
                    <div><strong>Keep documents handy</strong> - Have copies of your ID, passport, and insurance readily available</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">4</div>
                    <div><strong>Share your itinerary</strong> - Let someone know your travel plans and check-in regularly</div>
                </div>
                <div class="tip-item">
                    <div class="tip-icon">5</div>
                    <div><strong>Verify information</strong> - Contact numbers may change, verify before relying on them</div>
                </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Important:</strong> This information was generated on ${new Date().toLocaleDateString()}. Emergency contact numbers may change over time, so please verify current numbers before your trip.
            </p>
            
            <p style="margin-top: 25px;">
                Stay safe, be prepared, and enjoy your travels with peace of mind knowing you have the right contacts when you need them.
            </p>
            
            <p>Safe travels and stay vigilant!<br>
            <strong>The WayVentures Safety Team</strong> 🛡️🤖</p>
        </div>
        
        <div class="footer">
            <div class="footer-info">
                Emergency contacts generated for ${location} • ${new Date().toLocaleDateString()}
            </div>
            <p style="margin: 0; opacity: 0.8;">© 2025 WayVentures. Keeping travelers safe worldwide.</p>
            <div class="footer-links">
                <a href="#">Safety Guidelines</a> |
                <a href="#">Travel Insurance</a> |
                <a href="#">Contact Support</a> |
                <a href="#">Emergency Assistance</a>
            </div>
        </div>
    </div>
</body>
</html>`;

    return { subject, text, html };
}