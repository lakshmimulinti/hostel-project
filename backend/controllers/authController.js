const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../config/mailer');

// 1. SEND OTP
// 1. SEND OTP
exports.sendOtp = async (req, res) => {
    const { email, fullName, mobileNo } = req.body;

    console.log("Step 1: Request received");
    console.log("Email:", email);

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        let userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log("Step 2: User checked");

        if (userResult.rows.length === 0) {
            if (!fullName) {
                return res.status(400).json({
                    message: "User not found. Please Sign Up first."
                });
            }

            userResult = await pool.query(
                "INSERT INTO users (full_name, email, mobile_no) VALUES ($1, $2, $3) RETURNING *",
                [fullName, email, mobileNo || null]
            );

            console.log("Step 3: New user created");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        console.log("Step 4: OTP Generated:", otp);

        await pool.query(
            "UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3",
            [otp, otpExpiry, email]
        );

        console.log("Step 5: OTP saved in database");

        console.log("Step 6: Sending email...");

        await sendOtpEmail(email, otp);

        console.log("Step 7: Email sent successfully");

        res.status(200).json({
            message: "OTP sent successfully to your email."
        });

    } catch (err) {
        console.error("===== OTP ERROR =====");
        console.error(err);
        console.error(err.message);
        console.error("=====================");

        res.status(500).json({
            error: "Server Error during sending OTP.",
            message: err.message
        });
    }
};

// 2. VERIFY OTP & LOGIN
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = userResult.rows[0];

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP entered" });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        await pool.query('UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = $1', [email]);

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, mobileNo: user.mobile_no }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error during OTP verification." });
    }
};

// 3. REGISTER WITH PASSWORD
exports.registerWithPassword = async (req, res) => {
    const { email, fullName, mobileNo, password } = req.body;

    if (!email || !fullName || !mobileNo || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (full_name, email, mobile_no, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [fullName, email, mobileNo, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: "Account Created Successfully!",
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, mobileNo: user.mobile_no }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error during signup." });
    }
};

// 4. LOGIN WITH PASSWORD
exports.loginWithPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ message: "User not found. Please Sign Up first." });
        }

        const user = userCheck.rows[0];

        if (!user.password) {
            return res.status(400).json({ message: "Password not set for this account. Please login using OTP." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password entered." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, mobileNo: user.mobile_no }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error during login." });
    }
};

// 5. PRODUCTION DIAGNOSTIC ENDPOINT
exports.diagnostic = async (req, res) => {
    const results = {
        database: { status: 'testing', message: '' },
        brevo: { status: 'testing', message: '' },
        env: {
            NODE_ENV: process.env.NODE_ENV || 'not set',
            PORT: process.env.PORT || 'not set',
            HAS_DATABASE_URL: !!process.env.DATABASE_URL,
            HAS_BREVO_API_KEY: !!process.env.BREVO_API_KEY,
            HAS_DB_USER: !!process.env.DB_USER,
            HAS_DB_HOST: !!process.env.DB_HOST,
        }
    };

    try {
        const dbRes = await pool.query('SELECT NOW()');
        results.database.status = 'success';
        results.database.message = `Connected successfully! Database time: ${dbRes.rows[0].now}`;
        
        try {
            const tableCheck = await pool.query("SELECT to_regclass('public.users') as exists");
            if (tableCheck.rows[0].exists) {
                results.database.usersTableExists = true;
            } else {
                results.database.usersTableExists = false;
                results.database.status = 'warning';
                results.database.message = "Connected to DB, but 'users' table does not exist. Did you run migrations?";
            }
        } catch (e) {
            results.database.tableCheckError = e.message;
        }
    } catch (err) {
        results.database.status = 'failed';
        results.database.message = `Database connection failed: ${err.message}`;
    }

    if (!process.env.BREVO_API_KEY) {
        results.brevo.status = 'failed';
        results.brevo.message = "BREVO_API_KEY is missing from environment variables.";
    } else {
        results.brevo.status = 'configured';
        results.brevo.message = "BREVO_API_KEY is present.";
    }

    res.status(200).json(results);
};
