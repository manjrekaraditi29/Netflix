const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const otpStore = new Map();
const rateStore = new Map();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});
app.use(express.json());

function cleanEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

function smtpConfigured() {
    return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || "true") === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 5;
    const record = rateStore.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
        rateStore.set(ip, record);
        return true;
    }

    if (record.count >= maxRequests) return false;

    record.count += 1;
    rateStore.set(ip, record);
    return true;
}

app.post("/api/send-otp", async (req, res) => {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ success: false, message: "Too many requests. Please wait a minute." });
    }

    const email = cleanEmail(req.body.email);
    const purpose = String(req.body.purpose || "login").toLowerCase();

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(`${email}:${purpose}`, { otp, expiresAt, attempts: 0 });

    if (!smtpConfigured()) {
        console.log(`[DEV MODE] OTP for ${email} (${purpose}): ${otp}`);
        return res.json({
            success: true,
            devMode: true,
            message: `SMTP credentials missing in environment. Demo OTP generated: ${otp}`,
            otp
        });
    }

    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.SMTP_FROM || `"NETFIX Security" <${process.env.SMTP_USER}>`,
            to: email,
            subject: purpose === "reset" ? "NETFIX - Password Reset Verification Code" : "NETFIX - Login Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; background:#141414; color:#ffffff; padding:24px; border-radius:8px; max-width:480px; margin:auto;">
                    <h2 style="color:#e50914; margin-top:0;">NETFIX</h2>
                    <p style="font-size:16px;">Use the following One-Time Password (OTP) to complete your ${purpose === "reset" ? "password reset" : "login"}:</p>
                    <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#ffffff; background:#222222; padding:12px; text-align:center; border-radius:6px; margin:18px 0;">
                        ${otp}
                    </div>
                    <p style="font-size:13px; color:#aaaaaa;">This code expires in 5 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: `OTP sent successfully to ${email}.` });
    } catch (err) {
        console.error("Failed to send OTP email:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to send email OTP. Please verify server SMTP configuration.",
            error: err.message
        });
    }
});

app.post("/api/verify-otp", (req, res) => {
    const email = cleanEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const purpose = String(req.body.purpose || "login").toLowerCase();

    const key = `${email}:${purpose}`;
    const record = otpStore.get(key);

    if (!record) {
        return res.status(400).json({ success: false, message: "No active OTP found. Please request a new code." });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(key);
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new code." });
    }

    if (record.attempts >= 5) {
        otpStore.delete(key);
        return res.status(400).json({ success: false, message: "Too many incorrect attempts. Please request a new code." });
    }

    if (record.otp !== otp) {
        record.attempts += 1;
        return res.status(400).json({ success: false, message: `Invalid OTP. ${5 - record.attempts} attempts remaining.` });
    }

    otpStore.delete(key);
    return res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = app;
