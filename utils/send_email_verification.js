const nodemailer = require("nodemailer");
const config = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aman.gv072@gmail.com",
    pass: "btaqvpcjjlpfaljg",
  },
});

const sendEmailVerification = async (username, email, token) => {
  let mailOptions = {
    from: "aman.gv072@gmail.com",
    to: email,
    subject: "Verify your email",
    text:
      `Hi ${username},\n\n` +
      `Please verify your email by clicking the link: \n` +
      `http://localhost:5000/auth/activate/${token}\n\n`,
  };

  config.sendMail(mailOptions, function (err, result) {
    if (err) {
      console.log(err);
      return { status_code: 500, message: "Error in sending email" };
    } else {
      console.log("Email sent: " + result.response);
      return result;
    }
  });
};

module.exports = sendEmailVerification;
