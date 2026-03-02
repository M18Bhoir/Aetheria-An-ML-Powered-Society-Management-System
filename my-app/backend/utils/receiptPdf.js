import PDFDocument from "pdfkit";

export const generatePaymentReceiptPdf = async ({
  residentName,
  userId,
  amount,
  orderId,
  paymentId,
  paidAt,
}) => {
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];
    doc.on("data", (b) => buffers.push(b));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (e) => reject(e));

    doc.fontSize(20).text("Aetheria Society", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).text("Payment Receipt", { align: "center" });
    doc.moveDown(1.2);

    doc.fontSize(11);
    doc.text(`Resident: ${residentName || "-"}`);
    if (userId) doc.text(`User ID: ${userId}`);
    doc.text(`Amount: ₹${Number(amount).toLocaleString("en-IN")}`);
    doc.text(`Order ID: ${orderId}`);
    doc.text(`Payment ID: ${paymentId}`);
    doc.text(`Paid On: ${new Date(paidAt).toLocaleString()}`);
    doc.moveDown(1);
    doc.text(
      "Thank you for your payment. Keep this receipt for your records.",
    );

    doc.end();
  });
};

export default { generatePaymentReceiptPdf };
