import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("⏳ Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
  }
})();
