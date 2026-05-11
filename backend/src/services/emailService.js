import dns from "node:dns/promises";
import nodemailer from "nodemailer";

const getSmtpCandidates = async () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email SMTP environment variables are not configured");
  }

  const ipv4Addresses = await dns.resolve4(EMAIL_HOST);
  const hosts = ipv4Addresses.length ? ipv4Addresses : [EMAIL_HOST];
  const preferredPort = Number(EMAIL_PORT);
  const ports = preferredPort === 465 ? [465, 587] : [preferredPort, 465];

  return hosts.flatMap((host) =>
    ports.map((port) => ({
      host,
      port,
      secure: port === 465,
    }))
  );
};

const createEmailTransporter = ({ host, port, secure }) => {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      servername: process.env.EMAIL_HOST,
    },
  });
};

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const sendPasswordResetOtpEmail = async ({ to, name, otp }) => {
  const safeName = escapeHtml(name || "there");
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "Your NoteForge password reset OTP",
    text: [
      `Hi ${name || "there"},`,
      "",
      `Your NoteForge password reset OTP is ${otp}.`,
      "This OTP expires in 10 minutes.",
      "If you did not request this, you can safely ignore this email.",
      "",
      "Made with \u2764 by Kalp Shah.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${safeName},</p>
        <p>Your NoteForge password reset OTP is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">
          Made with <span style="color: #ef4444;">&#10084;</span> by Kalp Shah.
        </p>
      </div>
    `,
  };
  const candidates = await getSmtpCandidates();
  let lastError;

  for (const candidate of candidates) {
    try {
      const transporter = createEmailTransporter(candidate);
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      lastError = error;
      console.error(
        `SMTP send failed via ${candidate.host}:${candidate.port} - ${error.message}`
      );
    }
  }

  throw lastError;
};
