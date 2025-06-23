const nodemailer = require("nodemailer");
const config = require("./config");

const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: "Philippine National Bank <noreply@gmail.com>",
    to,
    subject: "Your One-Time Password (OTP)",
    text: `Dear Valued Client,

Your One-Time Password (OTP) is: ${otp}

Please use this code to complete your verification process. This OTP is valid for 5 minutes only. Do not share this code with anyone.

Thank you for choosing Philippine National Bank.

Sincerely,
PNB Digital Services Team`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #004481; color: white; padding: 20px 30px;">
            <h2 style="margin: 0;">Philippine National Bank</h2>
            <p style="margin: 5px 0 0;">Secure Verification Code</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear Valued Client,</p>
            <p style="font-size: 16px;">To complete your verification, please use the OTP provided below:</p>
            <div style="text-align: center; background: #e8f0fe; border-left: 5px solid #004481; padding: 15px; margin: 20px 0; font-size: 28px; font-weight: bold; color: #004481; letter-spacing: 2px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>5 minutes</strong>. For your security, do not share this code with anyone.</p>
            <p style="margin-top: 30px;">Thank you for choosing <strong>Philippine National Bank</strong>.</p>
            <p style="color: #888;">Sincerely,<br/>PNB Digital Services Team</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px 30px; font-size: 12px; color: #777; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
