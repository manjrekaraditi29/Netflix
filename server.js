// ======================================================
// NETFIX OTP SERVER
// Express + Nodemailer
// Sends real email OTPs for login and password reset.
// ======================================================

require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);
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
app.use(express.static(path.join(__dirname)));

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

function rateLimitKey(email, purpose) {
    return `${purpose}:${email}`;
}

function canSend(email, purpose) {
    const key = rateLimitKey(email, purpose);
    const now = Date.now();
    const last = rateStore.get(key) || 0;
    if (now - last < 30 * 1000) {
        return { allowed: false, seconds: Math.ceil((30 * 1000 - (now - last)) / 1000) };
    }
    rateStore.set(key, now);
    return { allowed: true };
}

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        otpEmailConfigured: smtpConfigured(),
        message: smtpConfigured()
            ? "NETFIX OTP server is ready."
            : "OTP server is running, but SMTP credentials are not configured."
    });
});

app.post("/api/send-otp", async (req, res) => {
    const email = cleanEmail(req.body.email);
    const name = String(req.body.name || "NETFIX User").trim().slice(0, 80);
    const requestedPurpose = String(req.body.purpose || "login");
    const purpose = ["login", "reset", "signup"].includes(requestedPurpose) ? requestedPurpose : "login";

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const rate = canSend(email, purpose);
    if (!rate.allowed) {
        return res.status(429).json({ message: `Please wait ${rate.seconds} seconds before requesting another OTP.` });
    }

    const otp = generateOTP();
    const key = rateLimitKey(email, purpose);
    otpStore.set(key, {
        hash: crypto.createHash("sha256").update(otp).digest("hex"),
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0
    });

    const subject = purpose === "signup"
        ? "Verify Your NETFIX Account"
        : purpose === "login"
            ? "Your NETFIX Login OTP"
            : "Your NETFIX Password Reset OTP";

    const mailHtml = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;background:#111;color:#fff;border-radius:12px">
            <h1 style="color:#e50914;margin-bottom:8px">NETFLIX</h1>
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your ${purpose === "signup" ? "account verification" : purpose === "login" ? "login" : "password reset"} code is:</p>
            <div style="font-size:34px;font-weight:700;letter-spacing:8px;background:#222;padding:18px;text-align:center;border-radius:8px">${otp}</div>
            <p style="color:#aaa">This OTP expires in 5 minutes. Never share this code with anyone.</p>
            <p style="color:#777;font-size:12px">NETFIX Student Project</p>
        </div>`;

    try {
        if (smtpConfigured()) {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject,
                text: `Your NETFIX ${purpose === "signup" ? "account verification" : purpose} OTP is ${otp}. It expires in 5 minutes.`,
                html: mailHtml
            });
            return res.json({ message: `OTP sent successfully to ${maskEmail(email)}.` });
        }

        // Offline college-demo mode: keeps the full OTP flow working even
        // before Gmail SMTP is configured. Configure .env later for real email.
        return res.json({
            demoMode: true,
            demoOtp: otp,
            message: `Demo OTP generated for ${maskEmail(email)}. Use the 6-digit code shown here.`
        });
    } catch (error) {
        otpStore.delete(key);
        console.error("SMTP error:", error.message);
        return res.status(500).json({ message: "The email could not be sent. Check your SMTP settings and Gmail App Password." });
    }
});

app.post("/api/verify-otp", (req, res) => {
    const email = cleanEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const requestedPurpose = String(req.body.purpose || "login");
    const purpose = ["login", "reset", "signup"].includes(requestedPurpose) ? requestedPurpose : "login";
    const key = rateLimitKey(email, purpose);
    const record = otpStore.get(key);

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ message: "Enter a valid 6-digit OTP." });
    }

    if (!record) {
        return res.status(400).json({ message: "OTP not found or already used. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(key);
        return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
        otpStore.delete(key);
        return res.status(429).json({ message: "Too many incorrect attempts. Please request a new OTP." });
    }

    const hash = crypto.createHash("sha256").update(otp).digest("hex");
    if (hash !== record.hash) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    otpStore.delete(key);
    return res.json({ verified: true, message: "OTP verified successfully." });
});

function maskEmail(email) {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visible = name.length <= 2 ? name.charAt(0) : name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(1, name.length - visible.length))}@${domain}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`NETFIX running at http://localhost:${PORT}`);
    console.log(`OTP email configured: ${smtpConfigured() ? "YES" : "NO"}`);
});
