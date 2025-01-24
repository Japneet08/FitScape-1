

const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to,subject,text,html){
  try {
    const info=await transporter.sendMail({
      from:process.env.EMAIL,
      to:to,
      subject:subject,
      text:text,
      html:html
    })
    console.log("Email Sent successfully:",info.messageId)
    return true;
    
  } catch (error) {
    console.error("Error sending the email",error)
    throw new Error(error.message);
  }
}

module.exports={sendEmail}