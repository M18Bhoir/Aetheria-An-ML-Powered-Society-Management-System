import twilio from "twilio";

// Updated from TWILIO_SID to TWILIO_ACCOUNT_SID
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

export const sendSms = async (to, message) => {
  requireEnv(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"]);
  if (!isE164(to)) {
    throw new Error("Invalid phone format. Use E.164 (e.g., +919876543210).");
  }
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Updated from TWILIO_PHONE
      to,
    });
  } catch (err) {
    const code = err?.code ? ` (code ${err.code})` : "";
    throw new Error(`Twilio SMS failed${code}: ${err?.message || err}`);
  }
};
