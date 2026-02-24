import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getDb, COLLECTIONS } from "../firebase";

export const ADMIN_EMAIL = "ethiocof@greenacrescoffee.com";

export interface MailEntry {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  message: {
    subject: string;
    text?: string;
    html?: string;
  };
  template?: {
    name: string;
    data: Record<string, unknown>;
  };
}

/**
 * Sends an email directly via Mailtrap API, bypassing the Firebase Extension.
 */
export async function sendEmail(mail: MailEntry): Promise<void> {
  const MAILTRAP_API_TOKEN =
    process.env.MAILTRAP_API_TOKEN ||
    process.env.NEXT_PUBLIC_MAILTRAP_API_TOKEN;
  const MAILTRAP_INBOX_ID =
    process.env.MAILTRAP_INBOX_ID || process.env.NEXT_PUBLIC_MAILTRAP_INBOX_ID;

  // We try to use the API directly to avoid circular dependencies between packages/db and apps/web
  try {
    if (!MAILTRAP_API_TOKEN) {
      console.error("sendEmail failed: missing MAILTRAP_API_TOKEN");
      return;
    }

    const isProduction = process.env.NODE_ENV === "production";
    let endpoint = "https://send.api.mailtrap.io/api/send";
    let headers: Record<string, string> = {
      Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
      "Content-Type": "application/json",
    };
    let body: any = {
      to: Array.isArray(mail.to)
        ? mail.to.map((email) => ({ email }))
        : [{ email: mail.to }],
      from: {
        email: "no-reply@greenacrescoffee.com",
        name: "Greenacres System",
      },
      subject: mail.message.subject,
      html: mail.message.html,
      text:
        mail.message.text || mail.message.html?.replace(/<[^>]*>?/gm, "") || "",
    };

    // If not in production, use the Sandbox API instead
    if (!isProduction && MAILTRAP_INBOX_ID) {
      endpoint = `https://sandbox.api.mailtrap.io/api/send/${MAILTRAP_INBOX_ID}`;
      headers["Api-Token"] = MAILTRAP_API_TOKEN;
      delete headers["Authorization"];
      body.from = { email: "mailtrap@example.com", name: "Greenacres Sandbox" }; // Sandbox requires arbitrary/verified domains
      body.subject = `[SANDBOX] ${body.subject}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mailtrap API Error:", response.status, errorText);
    }
  } catch (error: unknown) {
    console.error("Failed to send email:", error);
  }
}

import { createFormattedEmail } from "../templates/email-theme";

/**
 * Notify admin about a new registration
 */
import {
  User,
  InquirySubmission,
  InquiryItem,
  BagSizeLabels,
  BagTypeLabels,
} from "@greenacres/types";

/**
 * Notify admin about a new registration
 */
export async function notifyAdminRegistration(userData: User): Promise<void> {
  const content = `
        <h1>New Buyer Registration</h1>
        <p>A new buyer has requested access to the platform.</p>
        <h2>Company Details</h2>
        <p><strong>Company:</strong> ${userData.companyName}</p>
        <p><strong>Contact:</strong> ${userData.contactPerson}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Country:</strong> ${userData.country}</p>
        <p><strong>Type:</strong> ${userData.companyType}</p>
        <br>
        <center>
            <a href="https://greenacrescoffee.com/admin/users" class="btn">Review Request</a>
        </center>
    `;

  await sendEmail({
    to: ADMIN_EMAIL,
    message: {
      subject: `New Buyer Registration: ${userData.companyName}`,
      html: createFormattedEmail(content, "New Registration"),
    },
  });
}

/**
 * Notify buyer about their registration being received
 */
export async function notifyBuyerRegistrationReceived(
  email: string,
  companyName: string,
): Promise<void> {
  const content = `
        <h1>Registration Received</h1>
        <p>Dear ${companyName},</p>
        <p>Thank you for registering with Greenacres Coffee.</p>
        <p>Your account is currently <strong>pending approval</strong>. Our team reviews all trade applications to ensure compliance. You will receive a notification once your account status is updated (typically within 24 hours).</p>
        <br>
        <p>Best regards,<br>The Greenacres Team</p>
    `;

  await sendEmail({
    to: email,
    message: {
      subject: "Registration Received - Greenacres Coffee",
      html: createFormattedEmail(content, "Registration Received"),
    },
  });
}

/**
 * Notify buyer about approval/rejection
 */
export async function notifyUserStatusUpdate(userData: User): Promise<void> {
  const isApproved = userData.status === "approved";
  const subject = isApproved
    ? "Account Approved - Greenacres Coffee"
    : "Registration Update - Greenacres Coffee";

  let content = "";
  if (isApproved) {
    content = `
            <h1>Account Approved</h1>
            <p>Congratulations <strong>${userData.companyName}</strong>,</p>
            <p>Your buyer account on the Greenacres platform has been fully approved. You now have exclusive access to our live inventory and pricing.</p>
            <h2>Next Steps</h2>
            <p>Log in to browse our current harvest and submit inquiries directly to our logistics team.</p>
            <center>
                <a href="https://greenacrescoffee.com/login" class="btn">Access Portal</a>
            </center>
            <br>
            <p>Best regards,<br>The Greenacres Team</p>
        `;
  } else {
    content = `
            <h1>Registration Update</h1>
            <p>Dear ${userData.companyName},</p>
            <p>Thank you for your interest in Greenacres Coffee.</p>
            <p>At this time, we are unable to approve your registration request based on the provided information.</p>
            <p>If you believe this is an error, please reply deeply to this email or contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
            <br>
            <p>Best regards,<br>The Greenacres Team</p>
        `;
  }

  await sendEmail({
    to: userData.email,
    message: { subject, html: createFormattedEmail(content, subject) },
  });
}

/**
 * Notify admin about a new inquiry
 */
export async function notifyAdminInquiry(
  userData: User,
  inquiryData: InquirySubmission,
): Promise<void> {
  const coffeeItemsHtml = inquiryData.coffeeItems
    .map(
      (item: InquiryItem) =>
        `<li>${item.coffeeName} - ${item.quantity} bags (${BagSizeLabels[item.bagSize] || item.bagSize}, ${BagTypeLabels[item.bagType] || item.bagType}) — Location: ${item.preferredLocation}</li>`,
    )
    .join("");

  const content = `
        <h3>New Coffee Inquiry</h3>
        <p><strong>Company:</strong> ${userData.companyName}</p>
        <p><strong>Buyer:</strong> ${userData.contactPerson} (${userData.email})</p>
        <br>
        <h4>Requested Items:</h4>
        <ul>${coffeeItemsHtml}</ul>
        <br>
        <p><strong>Message:</strong> ${inquiryData.message || "N/A"}</p>
        <p><strong>Target Shipment:</strong> ${inquiryData.targetShipmentDate ? new Date(inquiryData.targetShipmentDate).toLocaleDateString() : "N/A"}</p>
        <br>
        <p>Please log in to the admin dashboard to view full details.</p>
    `;

  await sendEmail({
    to: ADMIN_EMAIL,
    message: {
      subject: `New Inquiry from ${userData.companyName}`,
      html: createFormattedEmail(content, "New Inquiry"),
    },
  });
}

/**
 * Send inquiry confirmation to buyer
 */
export async function notifyBuyerInquiryConfirmation(
  userData: User,
  inquiryData: InquirySubmission,
): Promise<void> {
  const coffeeItemsHtml = inquiryData.coffeeItems
    .map(
      (item: InquiryItem) =>
        `<li>${item.coffeeName} - ${item.quantity} bags (${BagSizeLabels[item.bagSize] || item.bagSize}, ${BagTypeLabels[item.bagType] || item.bagType})</li>`,
    )
    .join("");

  const content = `
        <h3>Hello ${userData.companyName},</h3>
        <p>We have received your inquiry for the following coffees:</p>
        <ul>${coffeeItemsHtml}</ul>
        <p>Our team will review your request and get back to you shortly with pricing and availability details.</p>
        <br>
        <p>Best regards,</p>
        <p>The Greenacres Team</p>
    `;

  await sendEmail({
    to: userData.email,
    message: {
      subject: "Inquiry Confirmation - Greenacres Coffee",
      html: createFormattedEmail(content, "Inquiry Confirmation"),
    },
  });
}
