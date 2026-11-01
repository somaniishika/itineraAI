import { toTitleCase } from 'src/common/utils/title-case.utils';

export function packingListNotificationTemplate(
  fullName: string,
  itineraryId: string,
  travelLocation: string,
  packingListData: any,
) {
  const name = toTitleCase(fullName);
  const logoUrl = process.env.WAYVENTURES_LOGO_URL;
  const itineraryPageUrl = `${process.env.WAYVENTURES_ITINERARY_PAGE_URL}/${itineraryId}`;
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Extract packing list details
  const packingTitle = packingListData?.title || `Your ${travelLocation} Packing List`;
  const packingList = packingListData?.packing_list || {};
  
  // Helper function to render category items
  const renderCategoryItems = (items: string[]) => {
    if (!items || items.length === 0) return '<p style="color: #6b7280; font-style: italic;">No items specified</p>';
    
    return items.map(item => {
      const cleanItem = item.replace(/^-\s*/, ''); // Remove leading dash
      return `<div style="display: flex; align-items: flex-start; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
        <div style="min-width: 8px; width: 8px; height: 8px; background: linear-gradient(135deg, #ec4899, #f472b6); border-radius: 50%; margin-right: 12px; margin-top: 6px; flex-shrink: 0;"></div>
        <span style="color: #374151; font-size: 14px; line-height: 1.5; flex: 1;">${cleanItem}</span>
      </div>`;
    }).join('');
  };

  // Define category icons and colors
  const categoryConfig = {
    'Clothing': { icon: '👕', color: '#ec4899', bg: '#fdf2f8' },
    'Toiletries and Personal Care': { icon: '🧴', color: '#8b5cf6', bg: '#f5f3ff' },
    'Electronics': { icon: '📱', color: '#3b82f6', bg: '#eff6ff' },
    'Travel Documents and Essentials': { icon: '📋', color: '#f59e0b', bg: '#fffbeb' },
    'Activity-Specific Gear': { icon: '🎒', color: '#10b981', bg: '#ecfdf5' },
    'Luggage and Organization': { icon: '🧳', color: '#6366f1', bg: '#eef2ff' },
    'Miscellaneous': { icon: '🔧', color: '#84cc16', bg: '#f7fee7' }
  };

  // Generate category sections HTML
  const categorySectionsHtml = Object.entries(packingList).map(([categoryName, items]) => {
    const config = categoryConfig[categoryName] || { icon: '📦', color: '#6b7280', bg: '#f9fafb' };
    
    return `
      <tr>
        <td style="padding: 0 0 25px 0;">
          <div style="background: ${config.bg}; border-radius: 12px; overflow: hidden; border: 1px solid ${config.color}20;">
            <!-- Category Header -->
            <div style="background: linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%); padding: 15px 20px;">
              <h3 style="margin: 0; color: white; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 10px;">${config.icon}</span>
                ${categoryName}
              </h3>
            </div>
            
            <!-- Category Items -->
            <div style="padding: 20px;">
              ${renderCategoryItems(items as string[])}
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const subject = `${packingTitle} - Complete Checklist Inside!`;
  const text = `Hi ${name}, your personalized packing list for ${travelLocation} is ready! Check your email for the complete detailed checklist. View your full itinerary at: ${itineraryPageUrl}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${packingTitle}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #fdf2f8;">
      
      <!-- Email Container -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fdf2f8; padding: 20px;">
        <tr>
          <td align="center">
            
            <!-- Main Email Content -->
            <table cellpadding="0" cellspacing="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(219, 39, 119, 0.1); overflow: hidden;">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbbf24 100%); padding: 0; position: relative;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 30px 30px 25px 30px; text-align: center; position: relative;">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Wayventures" style="max-width: 120px; height: auto; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />` : ''}
                        
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1); letter-spacing: -0.5px;">Your Complete Packing List</h1>
                        <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.95; font-weight: 400;">Everything you need for ${travelLocation}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <div style="margin-bottom: 20px;">
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Hi ${name}!</h2>
                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">Your personalized packing list is ready! We've analyzed your itinerary and created a comprehensive checklist tailored specifically for your trip to <strong style="color: #ec4899;">${travelLocation}</strong>.</p>
                  </div>
                </td>
              </tr>

              <!-- Packing List Title -->
              <tr>
                <td style="padding: 0 30px 20px 30px;">
                  <div style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 12px; padding: 20px; text-align: center; border: 2px solid #f3e8ff;">
                    <h2 style="margin: 0; color: #a21caf; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">${packingTitle}</h2>
                  </div>
                </td>
              </tr>
              
              <!-- Packing List Categories -->
              <tr>
                <td style="padding: 0 30px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${categorySectionsHtml}
                  </table>
                </td>
              </tr>
              
              <!-- Travel Tips -->
              <tr>
                <td style="padding: 20px 30px 30px 30px;">
                  <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
                    <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
                      💡 Pro Packing Tips
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px; line-height: 1.5;">
                      <li>Roll clothes instead of folding to save 30% more space</li>
                      <li>Pack essentials in your carry-on in case of delays</li>
                      <li>Use packing cubes to stay organized and find items quickly</li>
                      <li>Check airline baggage restrictions before you travel</li>
                    </ul>
                  </div>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                  <div style="background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%); padding: 25px; border-radius: 16px; border: 2px solid #f3e8ff;">
                    <a href="${itineraryPageUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3); letter-spacing: 0.3px;">
                      View Full Itinerary
                    </a>
                    <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px; font-weight: 500;">Access your complete travel planning dashboard</p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                  <div style="text-align: center; margin-bottom: 15px;">
                    <p style="margin: 0 0 5px 0; color: #1f2937; font-size: 14px; font-weight: 600;">Have an amazing journey!</p>
                    <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">Safe travels and unforgettable memories await you in ${travelLocation}</p>
                  </div>
                  
                  <!-- Signature -->
                  <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                    <p style="margin: 0 0 3px 0; color: #374151; font-size: 13px; font-weight: 600;">The Wayventures Team</p>
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 11px; font-style: italic;">Your trusted travel planning partner</p>
                  </div>
                </td>
              </tr>
              
              <!-- Email Footer -->
              <tr>
                <td style="padding: 15px 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 11px;">
                    This email was sent on ${currentDate}
                  </p>
                  <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 10px;">
                    © ${currentYear} Wayventures. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 10px;">
                    You're receiving this because you requested a packing list for your trip.
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;

  return { subject, text, html };
}