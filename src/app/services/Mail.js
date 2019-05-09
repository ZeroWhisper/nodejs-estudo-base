const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const exphbs = require("express-handlebars");
const mailConfig = require("../../config/mail");

const transport = nodemailer.createTransport(mailConfig);

transport.use(
  "compile",
  hbs({
    viewEngine: exphbs(),
    viewPath: path.resolve(__dirname, "..", "views", "emails"),
    extName: ".hbs"
  })
);

// transport.sendCustomEmail = async function(mail) {
//   await this.sendMail({
//     from: mail.from,
//     to: mail.to,
//     subject: mail.subject,
//     template: mail.template,
//     context: mail.context
//   });
// };

module.exports = transport;
