// config/mailer.js
require('dotenv').config();

const sendOtpEmail = async (toEmail, otp) => {
    console.log('Sending OTP email to:', toEmail);

    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing from environment variables.");
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
            // Note: On Resend's free tier without a custom domain, 
            // you must use 'onboarding@resend.dev' as the sender
            from: 'HostelHub <onboarding@resend.dev>',
            to: toEmail,
            subject: 'Your HostelHub OTP Code',
            html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API Error:', errorData);
        throw new Error(`Failed to send email: ${errorData.message || response.statusText}`);
    }

    console.log('✅ Email sent successfully to', toEmail);
};

module.exports = { sendOtpEmail };
