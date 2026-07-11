const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  await transporter.verify();
  console.log("SMTP Connected");

  await transporter.sendMail({
    from: `"HostelHub" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your HostelHub OTP Code",
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  });
};

module.exports = { sendOtpEmail };