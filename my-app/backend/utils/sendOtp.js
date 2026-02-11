import twilio from "twilio";

// Standardized to use TWILIO_ACCOUNT_SID
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendOtpToResident = async ({ phone, otp, channel = "sms" }) => {
  const body = `Your Aetheria ticket closure OTP is ${otp}. Valid for 10 minutes.`;

  if (channel === "whatsapp") {
    return client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body,
    });
  }

  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER, // Updated to match .env
    to: phone,
    body,
  });
};
