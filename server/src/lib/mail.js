const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: "Philippine National Bank <noreply@gmail.com>",
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
