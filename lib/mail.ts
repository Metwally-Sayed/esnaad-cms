import nodemailer from "nodemailer";

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

export type FormSubmissionData = {
  formType: string;
  formTitle: string;
  fields: Record<string, string | number | boolean>;
  submittedAt: string;
};

export async function sendFormSubmissionEmail(data: FormSubmissionData) {
  const recipientEmail = process.env.FORM_RECIPIENT_EMAIL || process.env.GMAIL_USER;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail credentials not configured");
  }

  // Build HTML email content
  const fieldsHtml = Object.entries(data.fields)
    .map(([key, value]) => {
      // Format the key to be more readable
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 35%;">
            ${formattedKey}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
            ${String(value) || "-"}
          </td>
        </tr>
      `;
    })
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #1f2937; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.05em;">
                ${data.formTitle}
              </h1>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">
                New submission received
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${fieldsHtml}
              </table>

              <!-- Footer Info -->
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 13px;">
                  <strong>Form Type:</strong> ${data.formType}
                </p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">
                  <strong>Submitted:</strong> ${data.submittedAt}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
            This email was sent from your website contact form.
          </p>
        </div>
      </body>
    </html>
  `;

  // Plain text version
  const textContent = `
${data.formTitle}
New submission received

${Object.entries(data.fields)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

---
Form Type: ${data.formType}
Submitted: ${data.submittedAt}
  `.trim();

  const mailOptions = {
    from: `"Website Forms" <${process.env.GMAIL_USER}>`,
    to: recipientEmail,
    subject: `New ${data.formTitle} Submission`,
    text: textContent,
    html: htmlContent,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}

export default transporter;
