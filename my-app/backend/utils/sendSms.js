import twilio from "twilio";

// Updated from TWILIO_SID to TWILIO_ACCOUNT_SID
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const sendSms = async (to, message) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // Updated from TWILIO_PHONE
    to,
  });
};
