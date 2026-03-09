import twilio from "twilio";

// Standardized to use TWILIO_ACCOUNT_SID
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const requireEnv = (keys) => {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Twilio configuration missing: ${missing.join(
        ", ",
      )}. Set these in environment variables.`,
    );
  }
};

const isE164 = (num) => /^\+\d{7,15}$/.test(num || "");

export const sendOtpToResident = async ({ phone, otp, channel = "sms" }) => {
  const body = `Your Aetheria ticket closure OTP is ${otp}. Valid for 10 minutes.`;
  requireEnv(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"]);
  if (!isE164(phone)) {
    throw new Error(
      "Invalid phone format. Use E.164 (e.g., +919876543210). Update resident phone.",
    );
  }

  try {
    if (channel === "whatsapp") {
      requireEnv(["TWILIO_WHATSAPP_NUMBER"]);
      return await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phone}`,
        body,
      });
    }

    requireEnv(["TWILIO_PHONE_NUMBER"]);
    return await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER, // Updated to match .env
      to: phone,
      body,
    });
  } catch (err) {
    const code = err?.code ? ` (code ${err.code})` : "";
    throw new Error(`Twilio send failed${code}: ${err?.message || err}`);
  }
};
