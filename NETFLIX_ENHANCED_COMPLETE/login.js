// ======================================================
// NETFIX LOGIN.JS
// Email OTP Login + Forgot Password OTP + Signup + Demo
// ======================================================

// Auto-detect API base: if page is served by Node (port 3000) use same origin, else localhost:3000
const API_BASE = (window.location.port === "3000" || window.location.protocol === "file:")
    ? ""
    : "http://localhost:3000";

let generatedOTP = null; // fallback only when API is unavailable
let otpExpiryTime = null;
let resetOTP = null;
let resetExpiryTime = null;
let currentResetEmail = "";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSavedUser() {
    const raw = localStorage.getItem("netfixUser");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
}

async function apiRequest(path, body) {
    try {
        const response = await fetch(API_BASE + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        let data = {};
        try { data = await response.json(); } catch (e) {}

        if (!response.ok) {
            throw new Error(data.message || "Unable to contact OTP server.");
        }
        return data;
    } catch (err) {
        // Clearer message when backend is not running
        if (err.name === "TypeError" || (err.message && err.message.includes("fetch"))) {
            throw new Error("OTP could not be sent.\n\nBackend is not running.\nOpen terminal in project folder and run:\n\nnpm install\nnpm start\n\nThen open http://localhost:3000 (NOT Live Server)");
        }
        throw err;
    }
}

async function sendLoginOTP(email, name) {
    // Real email OTP through the Node/Nodemailer backend.
    return apiRequest("/api/send-otp", { email, name, purpose: "login" });
}

async function sendResetOTP(email, name) {
    return apiRequest("/api/send-otp", { email, name, purpose: "reset" });
}

async function verifyServerOTP(email, otp, purpose) {
    return apiRequest("/api/verify-otp", { email, otp, purpose });
}

function showMessage(elementId, message, success = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message;
    element.style.color = success ? "#46d369" : "";
}

// ================= SIGN UP + EMAIL OTP =================
let pendingSignupEmail = "";

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const plan = document.getElementById("signupPlan").value;
        const btn = document.getElementById("createAccountBtn");

        if (name.length < 2) return alert("Please enter your name.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email.");
        if (password.length < 6) return alert("Password must contain at least 6 characters.");
        if (!plan) return alert("Please choose a plan.");

        const user = {
            name, email, password, plan,
            activeProfileId: "profile_1",
            profiles: [{ id:"profile_1", name, avatar:name.charAt(0).toUpperCase() }]
        };

        localStorage.setItem("netfixUser", JSON.stringify(user));
        localStorage.setItem("netfixLoggedIn", "false");
        pendingSignupEmail = email;

        btn.disabled = true;
        btn.textContent = "Sending OTP...";
        try {
            const result = await apiRequest("/api/send-otp", {email, name, purpose:"signup"});
            signupForm.style.display = "none";
            document.getElementById("signupOtpSection").style.display = "block";
            document.getElementById("signupOtpEmail").textContent = email;
            showMessage("signupOtpMessage", result.demoMode ? (result.message + " Demo OTP: " + result.demoOtp) : (result.message || "OTP sent successfully."), true);
        } catch (error) {
            btn.disabled = false;
            btn.textContent = "Create Account";
            alert("OTP could not be sent.\n\n" + (error.message || "Start the NETFIX server and configure Gmail App Password in .env."));
        }
    });
}

async function sendSignupOTP() {
    const user = getSavedUser();
    if (!user) return alert("Please create your account again.");
    const btn = document.getElementById("resendSignupOtp");
    btn.disabled = true; btn.textContent = "Sending...";
    try {
        const result = await apiRequest("/api/send-otp", {email:user.email,name:user.name,purpose:"signup"});
        showMessage("signupOtpMessage", result.demoMode ? (result.message + " Demo OTP: " + result.demoOtp) : (result.message || "New OTP sent."), true);
        document.getElementById("signupOtpInput").value = "";
    } catch(error) {
        showMessage("signupOtpMessage", error.message || "Unable to send OTP.");
    } finally {
        btn.disabled = false; btn.textContent = "Resend OTP";
    }
}

const verifySignupOtp = document.getElementById("verifySignupOtp");
if (verifySignupOtp) {
    verifySignupOtp.addEventListener("click", async function() {
        const otp = document.getElementById("signupOtpInput").value.trim();
        const user = getSavedUser();
        if (!user || !pendingSignupEmail) return alert("Please create your account first.");
        if (!/^\d{6}$/.test(otp)) return alert("Please enter the 6-digit OTP.");

        verifySignupOtp.disabled = true;
        verifySignupOtp.textContent = "Verifying...";
        try {
            await verifyServerOTP(pendingSignupEmail, otp, "signup");
            user.emailVerified = true;
            localStorage.setItem("netfixUser", JSON.stringify(user));
            localStorage.setItem("netfixLoggedIn", "true");
            localStorage.setItem("netfixLastLogin", new Date().toISOString());
            alert("Email verified successfully! Your NETFIX account is ready.");
            window.location.href = "home.html";
        } catch(error) {
            alert(error.message || "Invalid OTP.");
        } finally {
            verifySignupOtp.disabled = false;
            verifySignupOtp.textContent = "Verify & Continue";
        }
    });
}
const resendSignupOtp = document.getElementById("resendSignupOtp");
if (resendSignupOtp) resendSignupOtp.addEventListener("click", sendSignupOTP);

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const savedUser = getSavedUser();

        if (!savedUser) {
            alert("No account found. Please sign up first.");
            return;
        }

        if (email !== savedUser.email.toLowerCase() || password !== savedUser.password) {
            alert("Invalid email or password.");
            return;
        }

        const otpSection = document.getElementById("otpSection");
        const submitButton = loginForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Sending OTP...";

        try {
            const result = await sendLoginOTP(email, savedUser.name);
            loginForm.style.display = "none";
            otpSection.style.display = "block";
            showMessage("otpMessage", result.demoMode ? (result.message + " Demo OTP: " + result.demoOtp) : (result.message || ("OTP sent to " + email)), true);
        } catch (error) {
            console.error(error);
            submitButton.disabled = false;
            submitButton.textContent = "Sign In";
            alert("Email OTP could not be sent. Make sure the NETFIX OTP server is running and SMTP settings are configured.\n\n" + error.message);
        }
    });
}

// ================= VERIFY LOGIN OTP =================
const verifyOtp = document.getElementById("verifyOtp");
if (verifyOtp) {
    verifyOtp.addEventListener("click", async function() {
        const entered = document.getElementById("otpInput").value.trim();
        const user = getSavedUser();
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();

        if (!/^\d{6}$/.test(entered)) {
            alert("Please enter the 6-digit OTP.");
            return;
        }

        verifyOtp.disabled = true;
        verifyOtp.textContent = "Verifying...";

        try {
            await verifyServerOTP(email, entered, "login");
            localStorage.setItem("netfixLoggedIn", "true");
            localStorage.setItem("netfixLastLogin", new Date().toISOString());
            alert("Email verified successfully! Welcome to NETFIX.");
            window.location.href = "home.html";
        } catch (error) {
            alert(error.message || "Invalid OTP.");
        } finally {
            verifyOtp.disabled = false;
            verifyOtp.textContent = "Verify OTP";
        }
    });
}

// ================= RESEND LOGIN OTP =================
const resendOtp = document.getElementById("resendOtp");
if (resendOtp) {
    resendOtp.addEventListener("click", async function() {
        const user = getSavedUser();
        if (!user) return alert("User account not found.");

        resendOtp.disabled = true;
        resendOtp.textContent = "Sending...";

        try {
            const result = await sendLoginOTP(user.email, user.name);
            document.getElementById("otpInput").value = "";
            showMessage("otpMessage", result.demoMode ? (result.message + " Demo OTP: " + result.demoOtp) : (result.message || ("New OTP sent to " + user.email)), true);
        } catch (error) {
            alert(error.message || "Unable to resend OTP.");
        } finally {
            resendOtp.disabled = false;
            resendOtp.textContent = "Resend OTP";
        }
    });
}

// ================= DEMO LOGIN =================
const quickLogin = document.getElementById("quickLogin");
if (quickLogin) {
    quickLogin.addEventListener("click", function() {
        const demoUser = {
            name: "NETFIX User",
            email: "demo@netfix.com",
            password: "netfix123",
            plan: "Premium",
            activeProfileId: "profile_1",
            profiles: [{ id: "profile_1", name: "NETFIX User", avatar: "N" }]
        };
        localStorage.setItem("netfixUser", JSON.stringify(demoUser));
        localStorage.setItem("netfixLoggedIn", "true");
        alert("Demo account activated! Demo login intentionally skips OTP so your project can be demonstrated offline.");
        window.location.href = "home.html";
    });
}

// ================= FORGOT PASSWORD =================
const forgotPassword = document.getElementById("forgotPassword");
const forgotModal = document.getElementById("forgotModal");
if (forgotPassword && forgotModal) {
    forgotPassword.addEventListener("click", function(event) {
        event.preventDefault();
        forgotModal.style.display = "flex";
    });
}

const closeForgot = document.getElementById("closeForgot");
if (closeForgot) {
    closeForgot.addEventListener("click", () => forgotModal.style.display = "none");
}

if (forgotModal) {
    forgotModal.addEventListener("click", function(event) {
        if (event.target === forgotModal) forgotModal.style.display = "none";
    });
}

const sendResetOtp = document.getElementById("sendResetOtp");
if (sendResetOtp) {
    sendResetOtp.addEventListener("click", async function() {
        const email = document.getElementById("resetEmail").value.trim().toLowerCase();
        const user = getSavedUser();

        if (!user || email !== user.email.toLowerCase()) {
            showMessage("resetMessage", "Email does not match any registered account.");
            return;
        }

        sendResetOtp.disabled = true;
        sendResetOtp.textContent = "Sending...";

        try {
            const result = await sendResetOTP(email, user.name);
            currentResetEmail = email;
            document.getElementById("resetOtpArea").style.display = "block";
            showMessage("resetMessage", result.message || "OTP sent to your email.", true);
        } catch (error) {
            showMessage("resetMessage", error.message || "Unable to send OTP.");
        } finally {
            sendResetOtp.disabled = false;
            sendResetOtp.textContent = "Send OTP";
        }
    });
}

const resetPasswordBtn = document.getElementById("resetPasswordBtn");
if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener("click", async function() {
        const otp = document.getElementById("resetOtp").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const user = getSavedUser();

        if (!/^\d{6}$/.test(otp)) return alert("Please enter the 6-digit OTP.");
        if (newPassword.length < 6) return alert("New password must contain at least 6 characters.");
        if (!user || !currentResetEmail) return alert("Please request a new reset OTP.");

        resetPasswordBtn.disabled = true;
        resetPasswordBtn.textContent = "Verifying...";

        try {
            await verifyServerOTP(currentResetEmail, otp, "reset");
            user.password = newPassword;
            localStorage.setItem("netfixUser", JSON.stringify(user));
            localStorage.setItem("netfixLoggedIn", "false");
            alert("Password reset successfully. Please sign in with your new password.");
            forgotModal.style.display = "none";
            document.getElementById("loginPassword").value = "";
            document.getElementById("resetOtp").value = "";
            document.getElementById("newPassword").value = "";
        } catch (error) {
            alert(error.message || "Invalid OTP.");
        } finally {
            resetPasswordBtn.disabled = false;
            resetPasswordBtn.textContent = "Reset Password";
        }
    });
}
