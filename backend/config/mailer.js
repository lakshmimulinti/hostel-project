// config/mailer.js
const https = require('https');
require('dotenv').config();

const sendOtpEmail = (toEmail, otp) => {
    return new Promise((resolve, reject) => {
        console.log('Sending OTP email to:', toEmail);

        if (!process.env.BREVO_API_KEY) {
            return reject(new Error("BREVO_API_KEY is missing from environment variables."));
        }

        const senderEmail = process.env.EMAIL_USER || 'mulintilakshmim@gmail.com';

        const data = JSON.stringify({
            sender: { name: 'HostelHub', email: senderEmail },
            to: [{ email: toEmail }],
            subject: 'Your HostelHub OTP Code',
            htmlContent: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Email sent successfully to', toEmail);
                    resolve();
                } else {
                    let parsedError;
                    try {
                        parsedError = JSON.parse(body);
                    } catch (e) {
                        parsedError = { message: body || `HTTP Status ${res.statusCode}` };
                    }
                    console.error('Brevo API Error:', parsedError);
                    reject(new Error(`Failed to send email: ${parsedError.message || 'Unknown error'}`));
                }
            });
        });

        req.on('error', (err) => {
            console.error('HTTPS request error:', err);
            reject(err);
        });

        req.write(data);
        req.end();
    });
};

module.exports = { sendOtpEmail };