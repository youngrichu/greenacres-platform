/**
 * Greenacres Premium Email Template
 * Theme: Dark Forest Green, Cream, Gold
 */

const COLORS = {
  background: "#05110A", // Deepest Green/Black
  container: "#0B1C13", // Rich Forest Green
  text: "#EAEAEA", // Off-white/Silver
  muted: "#A0A0A0", // Muted text
  gold: "#D4AF37", // Pure Gold
  link: "#E5C158",
  buttonText: "#05110A",
  borderLight: "#162017", // Replacing rgba(255,255,255,0.05)
  borderGold: "#1d1b0f", // Replacing rgba(212, 175, 55, 0.1)
  footerBg: "#060e09", // Replacing rgba(0,0,0,0.2)
};

export function createFormattedEmail(content: string, title?: string): string {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || "Greenacres Coffee"}</title>
    <!--[if mso]>
      <style type="text/css">
        body, table, td, p, h1, h2, h3, a { font-family: Arial, Helvetica, sans-serif !important; }
      </style>
    <![endif]-->
    <style type="text/css">
        body { margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .content { color: ${COLORS.text}; font-size: 16px; line-height: 1.7; }
        .content h1, .content h2, .content h3 { font-family: 'Playfair Display', Georgia, serif; color: ${COLORS.gold}; margin-top: 0; font-weight: 400; letter-spacing: 0.02em; }
        .content h1 { font-size: 28px; margin-bottom: 20px; text-align: center; }
        .content h2 { font-size: 22px; margin-bottom: 16px; border-bottom: 1px solid ${COLORS.borderGold}; padding-bottom: 10px; }
        .content h3 { font-size: 18px; margin-bottom: 12px; color: ${COLORS.link}; }
        .content p { margin-top: 0; margin-bottom: 20px; }
        .content strong { color: #FFFFFF; font-weight: 600; }
        .content ul { margin-top: 0; margin-bottom: 20px; padding-left: 20px; list-style-type: disc; }
        .content li { margin-bottom: 10px; }
        .content a { color: ${COLORS.link}; text-decoration: none; transition: color 0.2s; }
        .content a:hover { color: #FFFFFF !important; }
        .content .btn { display: inline-block; padding: 14px 32px; background-color: ${COLORS.gold}; color: ${COLORS.buttonText} !important; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; margin-top: 10px; text-align: center; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background};">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${COLORS.background}; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Wrapper Table -->
                <!--[if mso]>
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                <tr>
                <td align="center" valign="top">
                <![endif]-->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${COLORS.container}; border-radius: 8px; overflow: hidden; max-width: 600px; width: 100%; margin: 0 auto; border-collapse: collapse;">
                    <!-- Top Gradient Bar -->
                    <tr>
                        <td height="4" style="background-color: ${COLORS.gold}; background: linear-gradient(90deg, #D4AF37 0%, #F5E08E 50%, #D4AF37 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
                    </tr>
                    
                    <!-- Logo Container -->
                    <tr>
                        <td align="center" style="padding: 40px 0 20px 0; border-bottom: 1px solid ${COLORS.borderGold};">
                            <!-- Using PNG instead of SVG for maximum email client compatibility -->
                            <img src="https://greenacrescoffee.com/logo_golden.png" alt="Greenacres Logo" width="180" style="display: block; border: 0; max-width: 100%;" />
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td class="content" style="padding: 40px; color: ${COLORS.text}; font-size: 16px; line-height: 1.7; font-family: 'Inter', Helvetica, Arial, sans-serif;">
                            ${content}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: ${COLORS.footerBg}; padding: 30px; text-align: center; border-top: 1px solid ${COLORS.borderLight}; font-family: 'Inter', Helvetica, Arial, sans-serif;">
                            <p style="margin: 0 0 8px 0; color: ${COLORS.muted}; font-size: 13px;">&copy; ${year} Greenacres Coffee. All rights reserved.</p>
                            <p style="margin: 0 0 8px 0; color: ${COLORS.muted}; font-size: 13px;">Addis Ababa | New Jersey | Dubai</p>
                            <p style="margin: 10px 0 0 0; color: ${COLORS.muted}; font-size: 11px;">You are receiving this email regarding your account or inquiry.</p>
                        </td>
                    </tr>
                </table>
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}
