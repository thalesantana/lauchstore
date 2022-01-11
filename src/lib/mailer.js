const nodemailer = require('nodemailer');


module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f486dc0b56ee04",
      pass: "7d3efdf1b5034a"
    }
  });
