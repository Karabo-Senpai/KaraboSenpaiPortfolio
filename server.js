import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // 📨 Send to you
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `[CyberKarabo Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #00ff99; padding: 20px; border-radius: 10px;">
          <h2>📩 New Encrypted Message Received</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#111; padding:10px; border-radius:8px; color:#ccc;">${message}</p>
          <hr style="border:1px solid #00ff99;">
          <p>⚡ CyberKarabo Secure Contact Form</p>
        </div>
      `,
    });

    // 🤖 Auto-reply to sender
    await transporter.sendMail({
      from: `"CyberKarabo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your message has been received ✅",
      html: `
        <div style="font-family: 'Arial', sans-serif; background: #0a0a0a; color: #00ff99; max-width:600px; margin:auto; padding:25px; border-radius:10px;">
          <div style="text-align:center;">
            <img src="cid:logo" alt="CyberKarabo" width="120" style="margin-bottom:15px;">
            <h2 style="font-family:'Orbitron',sans-serif;">MESSAGE_RECEIVED_SUCCESSFULLY</h2>
          </div>
          <p>Hey ${name},</p>
          <p>Your encrypted message was successfully transmitted through the CyberKarabo network.</p>
          <p>Expect a secure reply soon.</p>
          <hr style="border:1px solid #00ff99; margin:20px 0;">
          <div style="text-align:center; color:#00ff99;">
            <p>Stay connected:</p>
            <a href="https://github.com/Karabo-Senpai" style="color:#00ff99; text-decoration:none; margin:0 10px;">GitHub</a> |
            <a href="https://www.linkedin.com/in/karabo-dev/" style="color:#00ff99; text-decoration:none; margin:0 10px;">LinkedIn</a> |
            <a href="https://discord.com/users/cyber.karabo" style="color:#00ff99; text-decoration:none; margin:0 10px;">Discord</a> |
            <a href="mailto:${process.env.EMAIL_USER}" style="color:#00ff99; text-decoration:none; margin:0 10px;">Email</a>
          </div>
          <div style="text-align:center; margin-top:20px;">
            <p>⚡ CyberKarabo | Secure Web Development & Cybersecurity Solutions</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "ck_logo.png",
          path: "assets/ck_logo.png",
          cid: "logo", // embed logo
        },
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("🚀 CyberKarabo server active on port 5000"));
