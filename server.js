const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the production build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Default route to serve build index.html for SPA router support
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Cache transporter configuration
let cachedTransporter = null;
let testAccountInfo = null;

async function getTransporter() {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, info: testAccountInfo };
  }

  const useLiveSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (useLiveSmtp) {
    console.log('Using live SMTP configuration from environment variables.');
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.log('No SMTP environment variables found. Dynamically creating a free Ethereal Mail test account...');
    const testAccount = await nodemailer.createTestAccount();
    testAccountInfo = testAccount;
    console.log(`Ethereal Test SMTP credentials generated:`);
    console.log(` - User: ${testAccount.user}`);
    console.log(` - Host: smtp.ethereal.email`);
    
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return { transporter: cachedTransporter, info: testAccountInfo };
}

// Contact form API endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  try {
    const { transporter, info } = await getTransporter();
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@celestialpixel.com';
    const senderEmail = process.env.SMTP_USER || (info ? info.user : 'noreply@celestialpixel.com');

    // 1. Email to the Owner (Admin Notification)
    const adminMailOptions = {
      from: `"CelestialPixel Contact Form" <${senderEmail}>`,
      to: ownerEmail,
      replyTo: email,
      subject: `New Lead: ${name} via CelestialPixel`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #5b5ff0;">New Lead Received</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #5b5ff0; margin: 15px 0;">
            ${message.replace(/\n/g, '<br/>')}
          </blockquote>
        </div>
      `,
    };

    // 2. Email to the User (Submitter Confirmation Auto-responder)
    const confirmationMailOptions = {
      from: `"CelestialPixel" <${senderEmail}>`,
      to: email,
      subject: `We've received your request!`,
      text: `Hello ${name},\n\nThank you for reaching out to CelestialPixel. We have received your message and will get back to you shortly.\n\nBest regards,\nThe CelestialPixel Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #0b0d12; color: #e4e1ed;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #5b5ff0; margin-bottom: 5px;">CelestialPixel</h1>
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #908fa0;">Digital Alchemy in Motion</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #222;" />
          <p>Hello ${name},</p>
          <p>Thank you for reaching out to us. We have successfully received your request and our team is already reviewing your details. We will be in touch with you shortly.</p>
          <p style="background: #1a1d24; padding: 15px; border-radius: 6px; border: 1px solid #2a2e37; color: #c6c5d7; font-size: 14px;">
            <strong>Your Message:</strong><br/>
            "${message.replace(/\n/g, '<br/>')}"
          </p>
          <p>Best regards,<br/><strong>The CelestialPixel Team</strong></p>
        </div>
      `,
    };

    // Send both emails
    const adminInfo = await transporter.sendMail(adminMailOptions);
    const userInfo = await transporter.sendMail(confirmationMailOptions);

    let previewUrl = null;
    if (info) {
      previewUrl = nodemailer.getTestMessageUrl(adminInfo);
      console.log('\n--- EMAIL SENT (TEST MODE) ---');
      console.log(`Admin Notification Preview URL: ${nodemailer.getTestMessageUrl(adminInfo)}`);
      console.log(`User Confirmation Preview URL: ${nodemailer.getTestMessageUrl(userInfo)}`);
      console.log('-------------------------------\n');
    } else {
      console.log(`Emails successfully sent to admin (${ownerEmail}) and client (${email}) via Live SMTP.`);
    }

    res.status(200).json({
      success: true,
      message: 'Your request was successfully submitted!',
      previewUrl: previewUrl,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to process email dispatch.' });
  }
});

// Groq API Integration for Chatbot "Celesti"
const https = require('https');

const systemPrompt = `You are Celesti, the friendly, futuristic AI virtual concierge of CelestialPixel digital agency.
CelestialPixel specializes in Website Development, SEO Optimization, Social Media Management, Product Shoot (photography), and Meta Ads.
You should represent the agency with premium class, deep technical confidence, and a touch of digital alchemy.
Be extremely helpful, polite, and concise. Keep your responses short (under 2-3 sentences where possible) and straight to the point to make the chat widget experience comfortable.
If asked about contact or booking, direct them to fill out the form on the website (or scroll to #contact).
Our contact email is bhushanpadghan87@gmail.com.`;

function callGroq(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error('Failed to parse Groq response: ' + err.message));
          }
        } else {
          reject(new Error(`Groq API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'Messages array is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'Groq API Key is not configured on the server.' });
  }

  try {
    const response = await callGroq(apiKey, messages);
    const reply = response.choices && response.choices[0] && response.choices[0].message;
    if (reply) {
      res.status(200).json({ success: true, reply });
    } else {
      res.status(500).json({ success: false, error: 'Empty response from Groq.' });
    }
  } catch (error) {
    console.error('Groq AI API Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve chatbot response.' });
  }
});


app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`CelestialPixel Server is running on localhost:${PORT}`);
  console.log(`Access the website: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
