"use strict";

const nodemailer = require("nodemailer");
const parameters = require("../parameters");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: parameters.mailer.user,
    pass: parameters.mailer.password
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "src/views/",
    layoutsDir: "src/views/",
    defaultLayout: "welcome.hbs"
  },
  viewPath: "src/views/",
  extName: ".hbs"
};

transporter.use("compile", hbs(handlebarOptions));

module.exports = {
  sendWelcomeEmail: (email, username) => {
    let mailOptions = {
      from: parameters.mailer.user,
      to: email,
      subject: "Bienvenido a Vibes",
      template: "welcome",
      context: {
        username: username,
        email: email
      }
    };
    transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log(`New welcome mail sent to ${email}`);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
