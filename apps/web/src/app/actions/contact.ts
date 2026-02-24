"use server";

import { createFormattedEmail } from "@greenacres/db";
import { sendEmail } from "@/lib/mailtrap";

export async function submitContactFormAction(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    company: (formData.get("company") as string) || "N/A",
    type: formData.get("type") as string,
    message: formData.get("message") as string,
  };

  if (!data.name || !data.email || !data.message) {
    return {
      success: false,
      error: "Name, email, and message are required fields.",
    };
  }

  const content = `
        <h3>New Contact Submission</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Inquiry Type:</strong> ${data.type}</p>
        <br>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
    `;

  try {
    await sendEmail({
      to: "ethiocof@greenacrescoffee.com",
      replyTo: data.email,
      subject: `New Contact Submission: ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nInquiry Type: ${data.type}\n\nMessage:\n${data.message}`,
      html: createFormattedEmail(content, "Contact Form"),
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return { success: false, error: "Failed to send contact email." };
  }
}
