const { sendEmail } = require('../config/email.config');

const sendOTP = async (email, fullname, otp) => {
  const subject = 'Email Verification || FitScape';
  const text = `Hello ${fullname},

Thank you for registering with FitScape. Please use the following OTP to verify your email address:

${otp}

This OTP is valid for the next 5 minutes.

Best regards,
The FitScape Team`;
  const html = `<p>Hello ${fullname},</p>
<p>Thank you for registering with FitScape. Please use the following OTP to verify your email address:</p>
<h2>${otp}</h2>
<p>This OTP is valid for the next 2 minutes.</p>
<p>Best regards,<br>The FitScape Team</p>`;

  return await sendEmail(email, subject, text, html);
};

module.exports = sendOTP;
