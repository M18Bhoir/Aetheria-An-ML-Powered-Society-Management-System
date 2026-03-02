import nodemailer from "nodemailer";

// Create transporter for sending emails
// For production, use environment variables for credentials
const createTransporter = () => {
  // You can configure with Gmail, Outlook, or any SMTP service
  // For now, we'll create a transporter that can be configured via environment variables
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
};

// HTML template for payment receipt
const generatePaymentReceiptEmail = (
  userName,
  amount,
  paymentId,
  orderId,
  paidAt,
) => {
  const formattedDate = new Date(paidAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - Aetheria Society</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Aetheria Society</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Payment Receipt</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <p style="color: #333333; font-size: 16px;">Dear <strong>${userName}</strong>,</p>
          
          <p style="color: #666666; font-size: 14px;">Thank you for your payment. Your transaction has been successfully processed.</p>
          
          <!-- Receipt Details -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0; font-size: 18px;">Receipt Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">Amount Paid</td>
                <td style="padding: 8px 0; color: #059669; font-size: 14px; text-align: right; font-weight: bold;">₹${Number(amount).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">Payment ID</td>
                <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">${paymentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">Order ID</td>
                <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666666; font-size: 14px;">Date</td>
                <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">${formattedDate}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 12px 0 8px 0; color: #333333; font-size: 16px; font-weight: bold;">Status</td>
                <td style="padding: 12px 0 8px 0; color: #059669; font-size: 16px; text-align: right; font-weight: bold;">✓ PAID</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666666; font-size: 14px;">
            Please keep this receipt for your records. You can also download a PDF copy from your dashboard.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This is an automated email from Aetheria Society Management System.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
            © ${new Date().getFullYear()} Aetheria Society. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send payment receipt email
export const sendPaymentReceiptEmail = async (
  email,
  userName,
  amount,
  paymentId,
  orderId,
  paidAt,
  pdfBuffer,
) => {
  try {
    const transporter = createTransporter();

    const htmlContent = generatePaymentReceiptEmail(
      userName,
      amount,
      paymentId,
      orderId,
      paidAt,
    );

    const mailOptions = {
      from:
        process.env.SMTP_FROM || '"Aetheria Society" <noreply@aetheria.com>',
      to: email,
      subject: "Payment Receipt - Aetheria Society Maintenance Dues",
      html: htmlContent,
      attachments: pdfBuffer
        ? [
            {
              filename: `Receipt_${orderId}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export default { sendPaymentReceiptEmail };
