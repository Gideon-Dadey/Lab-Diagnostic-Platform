
import nodemailer from "nodemailer";



const parseBool = (val) => {
  if (val === undefined || val === null) return undefined;
  return String(val).toLowerCase() === "true" || String(val) === "1";
};

const hasSmtpCreds = () =>
  Boolean(
    (process.env.SMTP_SERVICE || process.env.SMTP_HOST) &&
      (process.env.SMTP_MAIL || process.env.SMTP_USER) &&
      (process.env.SMTP_PASSWORD || process.env.SMTP_PASS)
  );

let cachedTransporter = null;

const getTransporter = async () => {
  if (!hasSmtpCreds()) {
    console.warn("sendEmail.util: SMTP credentials not found in environment.");
    return null;
  }

  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  
  const envSecure = parseBool(process.env.SMTP_SECURE);
  const secure = typeof envSecure === "boolean" ? envSecure : port === 465;

  const authUser = process.env.SMTP_MAIL || process.env.SMTP_USER;
  const authPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  
  const common = {
    auth: {
      user: authUser,
      pass: authPass,
    },
    tls: {
      
      rejectUnauthorized:
        process.env.SMTP_REJECT_UNAUTHORIZED !== undefined
          ? parseBool(process.env.SMTP_REJECT_UNAUTHORIZED)
          : false,
    },
    
    connectionTimeout: process.env.SMTP_CONNECTION_TIMEOUT ? Number(process.env.SMTP_CONNECTION_TIMEOUT) : 10000,
    debug: parseBool(process.env.SMTP_DEBUG) || false,
    logger: parseBool(process.env.SMTP_DEBUG) || false,
  };

  const transportOptions = host
    ? {
        host,
        port: port || (secure ? 465 : 587),
        secure: Boolean(secure),
        ...common,
        pool: process.env.SMTP_POOL ? parseBool(process.env.SMTP_POOL) : true,
      }
    : {
        service: process.env.SMTP_SERVICE,
        secure: Boolean(secure),
        ...common,
        pool: process.env.SMTP_POOL ? parseBool(process.env.SMTP_POOL) : true,
      };

  const transporter = nodemailer.createTransport(transportOptions);

  try {
    
    await transporter.verify();
    cachedTransporter = transporter;
    console.log("✅ SMTP transporter verified and cached.");
    return transporter;
  } catch (err) {
    
    console.error("SMTP transporter verification failed:", err && err.message ? err.message : err);
    
    return null;
  }
};


export const sendEmail = async ({ to, subject, html }) => {
  if (!hasSmtpCreds()) {
    console.warn("sendEmail: No SMTP credentials found. Skipping send.");
    return null;
  }

  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn("sendEmail: SMTP transporter not available (verification failed). Skipping send.");
      return null;
    }

    const from = process.env.SMTP_MAIL || process.env.SMTP_USER || `no-reply@${process.env.FRONTEND_URL?.replace(/^https?:\/\//, "") || "example.com"}`;

    const mailOptions = {
      from: `"Pragma Health LLC" <${from}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} (messageId=${info.messageId})`);
    return info;
  } catch (err) {
    console.error("sendEmail: Error sending email:", err && err.message ? err.message : err);
    
    throw new Error("Email could not be sent, please try again.");
  }
};

export default sendEmail;