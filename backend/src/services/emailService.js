import nodemailer from "nodemailer";

const getEmailTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Email SMTP environment variables are not configured");
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    // Force IPv4 to avoid IPv6 ENETUNREACH issue
    family: 4,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
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
  const transporter = getEmailTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const safeName = escapeHtml(name || "there");

  await transporter.sendMail({
    from,
    to,
    subject: "Your NoteForge password reset OTP",
    text: [
      `Hi ${name || "there"},`,
      "",
      `Your NoteForge password reset OTP is ${otp}.`,
      "This OTP expires in 10 minutes.",
      "If you did not request this, you can safely ignore this email.",
      "",
      "Made with ❤ by Kalp Shah.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${safeName},</p>
        <p>Your NoteForge password reset OTP is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p style="margin-top: 28px; color: #6b7280; font-size: 13px;">
          Made with <span style="color: #ef4444;">❤</span> by Kalp Shah.
        </p>
      </div>
    `,
  });
};
