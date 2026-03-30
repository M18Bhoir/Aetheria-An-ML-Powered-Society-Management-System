import nodemailer from "nodemailer";

/**
 * Sends a payment receipt email with a PDF attachment.
 */
export const sendPaymentReceiptEmail = async (
  email,
  residentName,
  amount,
  paymentId,
  orderId,
  paidAt,
  pdfBuffer,
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Aetheria Society" <noreply@aetheria.com>',
    to: email,
    subject: `Payment Receipt - ₹${amount} - Aetheria`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #2c3e50;">Payment Confirmation</h2>
        <p>Dear ${residentName},</p>
        <p>Your payment of <strong>₹${Number(amount).toLocaleString("en-IN")}</strong> has been successfully received.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(paidAt).toLocaleString()}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Please find your official payment receipt attached to this email.</p>
        <p>Thank you for using Aetheria Community Management.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #7f8c8d;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Receipt_${paymentId}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Receipt email sent: %s", info.messageId);
};

export default { sendPaymentReceiptEmail };

