const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password",
  },
});

const sendEmail = async ({ email, subject, otp, template }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || "E-Commerce"}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: template({ otp }),
    });
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };
