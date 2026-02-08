import { MailtrapClient } from 'mailtrap';
import nodemailer from 'nodemailer';

// Initialize Clients (Lazy)
let apiParams: { token: string; accountId?: number } | null = null;
let smtpParams: { user: string; pass: string } | null = null;
let apiClient: MailtrapClient | null = null;
let smtpTransport: nodemailer.Transporter | null = null;

function getClient() {
    // Check for SMTP (Sandbox) first
    if (process.env.MAILTRAP_SMTP_USER && process.env.MAILTRAP_SMTP_PASS) {
        if (!smtpTransport) {
            smtpParams = {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS
            };
            smtpTransport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: smtpParams.user,
                    pass: smtpParams.pass
                }
            });
            console.log('✅ Mailtrap: Using SMTP (Sandbox)');
        }
        return { type: 'smtp', client: smtpTransport };
    }

    // Fallback to API (Production)
    if (process.env.MAILTRAP_API_TOKEN) {
        if (!apiClient) {
            const token = process.env.MAILTRAP_API_TOKEN;
            const accountId = process.env.MAILTRAP_ACCOUNT_ID ? parseInt(process.env.MAILTRAP_ACCOUNT_ID) : undefined;
            apiClient = new MailtrapClient({ token, accountId });
            console.log('✅ Mailtrap: Using API (Production)');
        }
        return { type: 'api', client: apiClient };
    }

    console.warn('⚠️ Mailtrap not configured');
    return null;
}

const SENDER = {
    email: 'hello@demomailtrap.com', // Default verified sender for Mailtrap
    name: 'Greenacres Coffee',
};

const SANDBOX_SENDER = '"Greenacres Sandbox" <no-reply@greenacres.test>';

const ADMIN_EMAIL = 'ethiocof@greenacrescoffee.com';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
    const config = getClient();
    if (!config) return { success: false, error: 'Missing configuration' };

    try {
        if (config.type === 'smtp') {
            const transport = config.client as nodemailer.Transporter;
            await transport.sendMail({
                from: SANDBOX_SENDER,
                to,
                subject: `[SANDBOX] ${subject}`,
                html,
                text: text || html.replace(/<[^>]*>?/gm, ''),
            });
        } else {
            const client = config.client as MailtrapClient;
            await client.send({
                from: SENDER,
                to: [{ email: to }],
                subject,
                html,
                text: text || html.replace(/<[^>]*>?/gm, ''),
                category: 'Inquiry Notification',
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

export async function sendAdminNotification(subject: string, html: string) {
    return sendEmail({
        to: ADMIN_EMAIL,
        subject,
        html,
    });
}
