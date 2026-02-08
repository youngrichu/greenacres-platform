'use server';

import { createInquiry, createFormattedEmail } from '@greenacres/db';
import { sendEmail, sendAdminNotification } from '@/lib/mailtrap';
import { User, InquirySubmission, ApiResponse, Inquiry } from '@greenacres/types';
import { LocationLabels } from '@greenacres/types';

export async function submitInquiryAction(
    user: User,
    data: InquirySubmission
): Promise<ApiResponse<Inquiry>> {
    try {
        // 1. Create Inquiry in Firestore
        // Note: The createInquiry function in @greenacres/db is safe to call from server environment
        const result = await createInquiry(user, data);

        if (!result.success || !result.data) {
            return { success: false, error: result.error || 'Failed to create inquiry record' };
        }

        const inquiry = result.data;

        // 2. Prepare Email Content
        const itemList = inquiry.coffeeItems
            .map(
                (item) =>
                    `<li><strong>${item.coffeeName}</strong><br>Quantity: ${item.quantity} bags<br>Location: ${LocationLabels[item.preferredLocation]}</li>`
            )
            .join('');

        const targetDate = inquiry.targetShipmentDate
            ? new Date(inquiry.targetShipmentDate).toLocaleDateString()
            : 'N/A';

        // 3. Send Admin Notification
        const adminContent = `
            <h1>New Business Inquiry</h1>
            <p><strong>Buyer:</strong> ${user.companyName} (${user.contactPerson})</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
            
            <h2>Requested Items</h2>
            <ul>${itemList}</ul>
            <p><strong>Target Date:</strong> ${targetDate}</p>
            <p><strong>Message:</strong><br>${inquiry.message || 'No message provided.'}</p>
            <br>
            <center>
                <a href="https://greenacrescoffee.com/admin/inquiries/${inquiry.id}" class="btn">View in Dashboard</a>
            </center>
        `;

        await sendAdminNotification(
            `New Inquiry: ${user.companyName}`,
            createFormattedEmail(adminContent, 'New Inquiry')
        );

        // 4. Send Buyer Confirmation
        const buyerContent = `
            <h1>Inquiry Received</h1>
            <p>Dear ${user.companyName},</p>
            <p>Thank you for your inquiry. We have recorded your interest in the following lots:</p>
            <ul>${itemList}</ul>
            <p>Our team will calculate current logistics rates and provide a formal pro-forma invoice shortly.</p>
            <br>
            <p>Best regards,<br>The Greenacres Coffee Team</p>
        `;

        await sendEmail({
            to: user.email,
            subject: 'We received your Greenacres inquiry',
            html: createFormattedEmail(buyerContent, 'Inquiry Confirmation'),
        });

        // 5. Return success
        // We re-serialize the data to ensure it's simple JSON (dates as strings if needed, but Next.js handles Dates usually)
        return { success: true, data: inquiry };
    } catch (error) {
        console.error('Server Action Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
}
