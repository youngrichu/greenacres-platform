/**
 * Greenacres Premium Email Template
 * Theme: Dark Forest Green, Cream, Gold
 */

const COLORS = {
  background: "#05110A", // Deepest Green/Black
  container: "#0B1C13", // Rich Forest Green
  text: "#EAEAEA", // Off-white/Silver (crisper than cream)
  muted: "#A0A0A0", // Muted text
  gold: "#D4AF37", // Pure Gold
  link: "#E5C158",
  buttonText: "#05110A",
};

export function createFormattedEmail(content: string, title?: string): string {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || "Greenacres Coffee"}</title>
    <!-- Try to load a nice font, fallback gracefully -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: ${COLORS.background}; padding: 40px 0; }
        .webkit { max-width: 600px; background-color: ${COLORS.container}; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden; }
        .header-bar { height: 4px; background: linear-gradient(90deg, #D4AF37 0%, #F5E08E 50%, #D4AF37 100%); }
        .logo-container { text-align: center; padding: 40px 0 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.1); }
        .logo { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: ${COLORS.gold}; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; text-decoration: none; }
        .content { padding: 40px; color: ${COLORS.text}; font-size: 16px; line-height: 1.7; }
        
        /* Typography */
        h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif; color: ${COLORS.gold}; margin-top: 0; font-weight: 400; letter-spacing: 0.02em; }
        h1 { font-size: 28px; margin-bottom: 20px; text-align: center; }
        h2 { font-size: 22px; margin-bottom: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 10px; }
        h3 { font-size: 18px; margin-bottom: 12px; color: ${COLORS.link}; }
        p { margin-bottom: 20px; }
        strong { color: white; font-weight: 600; }
        ul { margin-bottom: 20px; padding-left: 0; list-style: none; }
        li { margin-bottom: 10px; padding-left: 20px; position: relative; }
        li::before { content: "•"; color: ${COLORS.gold}; font-weight: bold; position: absolute; left: 0; width: 20px; }
        
        /* Elements */
        a { color: ${COLORS.link}; text-decoration: none; transition: color 0.2s; }
        a:hover { color: #FFF; }
        .btn { display: inline-block; padding: 14px 32px; background: ${COLORS.gold}; color: ${COLORS.buttonText} !important; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; margin-top: 10px; text-align: center; }
        
        /* Footer */
        .footer { background-color: rgba(0,0,0,0.2); padding: 30px; text-align: center; font-size: 13px; color: ${COLORS.muted}; border-top: 1px solid rgba(255,255,255,0.05); }
        .social-links { margin-bottom: 15px; }
        .footer p { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <div class="header-bar"></div>
            <div class="logo-container">
                <img src="https://greenacrescoffee.com/logo_golden.svg" alt="Greenacres Logo" style="height: 60px; width: auto; object-fit: contain;" />
            </div>
            
            <div class="content">
                ${content}
            </div>

            <div class="footer">
                <p>&copy; ${year} Greenacres Coffee. All rights reserved.</p>
                <p>Addis Ababa | New Jersey | Dubai</p>
                <p style="font-size: 11px; margin-top: 10px;">You are receiving this email regarding your account or inquiry.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
