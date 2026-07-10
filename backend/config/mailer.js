// config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (toEmail, otp) => {
    console.log('Sending OTP email to:', toEmail, 'using account:', process.env.EMAIL_USER);

    await transporter.sendMail({
        from: `"HostelHub" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your HostelHub OTP Code',
        html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    console.log('✅ Email sent successfully to', toEmail);
};

module.exports = { sendOtpEmail };