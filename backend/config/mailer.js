const https = require('https');
require('dotenv').config();

const sendOtpEmail = (toEmail, otp) => {
    return new Promise((resolve, reject) => {
        console.log('Sending OTP email to:', toEmail);

        if (!process.env.RESEND_API_KEY) {
            return reject(new Error("RESEND_API_KEY is missing from environment variables."));
        }

        const data = JSON.stringify({
            // Note: On Resend's free tier without a custom domain, 
            // you must use 'onboarding@resend.dev' as the sender
            from: 'HostelHub <onboarding@resend.dev>',
            to: toEmail,
            subject: 'Your HostelHub OTP Code',
            html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        const options = {
            hostname: 'api.resend.com',
            port: 443,
            path: '/emails',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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
                    console.error('Resend API Error:', parsedError);
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