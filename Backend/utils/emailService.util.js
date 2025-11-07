import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  getApplicationApprovedTemplate,
  getApplicationRejectedTemplate,
  getApplicationSubmittedTemplate,
} from "./emailTemplates.js";

dotenv.config();


const hasSMTP =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;


let transporter = null;

if (hasSMTP) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("✅ Email transporter configured successfully");
} else {
  console.warn(
    "⚠️ No SMTP credentials found. Email sending is disabled for now."
  );
}


export const sendEmail = async (to, subject, html) => {
  if (!hasSMTP) {
    console.warn("⚠️ Skipping email send — no SMTP credentials set.");
    return false;
  }

  try {
    const mailOptions = {
      from: `"Pragma Health LLC" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};


export const sendApplicationSubmittedEmail = async (labName, ownerEmail) => {
  const subject = "Lab Application Received - Pragma Health LLC";
  const html = getApplicationSubmittedTemplate(labName);
  return sendEmail(ownerEmail, subject, html);
};

export const sendApplicationApprovedEmail = async (
  labName,
  ownerEmail,
  password
) => {
  const subject = "Lab Application Approved - Pragma Health LLC";
  const html = getApplicationApprovedTemplate(labName, ownerEmail, password);
  return sendEmail(ownerEmail, subject, html);
};

export const sendApplicationRejectedEmail = async (
  labName,
  ownerEmail,
  reason
) => {
  const subject = "Lab Application Status Update - Pragma Health LLC";
  const html = getApplicationRejectedTemplate(labName, reason);
  return sendEmail(ownerEmail, subject, html);
};
