import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import createHttpError from "http-errors";
import { loadConfig } from "../helper/config.hepler";

loadConfig();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP configuration error:", error);
  } else {
    console.log("Email server is ready to send messages.");
  }
});

export const sendEmail = async (mailOptions: Mail.Options): Promise<any> => {
  try {
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw createHttpError(500, { message: "Failed to send email", detail: error.message });
  }
};

export const resetPasswordEmailTemplate = (
  token = "",
  path: string,
): string => {
  const baseUrl = process.env.FE_BASE_URL;
  const resetLink =
    path === "reset-password"
      ? `${baseUrl}/${path}/${token}`
      : `${baseUrl}/${path}?token=${token}`;

  return `
<html>
  <body>
    <p><strong>Hi</strong></p>
    <p>Welcome to <strong>Spotlight!</strong> We're excited to have you on board.</p>
    <p>We've registered you as a company. Click the link below to access your dashboard and update your password:</p>
    <p><a href="${resetLink}" style="color: #0000FF; text-decoration: underline;">Click here to access your dashboard and update your password</a></p>
    <p>If you have any questions or need any assistance, feel free to reach out to our support team.</p>
    <p>Best regards,</p>
    <p>The Spotlight team</p>
  </body>
</html>`;
};

export const verifyEmailTemplate = (
  path: string
): string => {
  const baseUrl = process.env.FE_BASE_URL;
  const verifyLink = `${baseUrl}/${path}`;

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #6B46C1;">Welcome to Spotlight!</h2>

        <p>Hi there,</p>
        <p>Thank you for signing up. Please verify your email address to activate your account and start using Spotlight.</p>

        <div style="margin: 24px 0; text-align: center;">
          <a href="${verifyLink}" style="background-color: #6B46C1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Verify My Email
          </a>
        </div>

        <p>If you did not sign up for a Spotlight account, please ignore this email.</p>

        <p>Need help? Feel free to contact our support team anytime.</p>

        <p>Cheers,<br>The Spotlight Team</p>
      </div>
    </body>
  </html>
  `;
};

