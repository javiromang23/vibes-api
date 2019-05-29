"use strict";

const nodemailer = require("nodemailer");
const parameters = require("../parameters");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const defaultConfig = {
  service: "hotmail",
  auth: {
    user: parameters.mailer.user,
    pass: parameters.mailer.password
  }
};

module.exports = {
  sendWelcomeEmail: (email, username) => {
    let transporter = nodemailer.createTransport(defaultConfig);
    let handlebarOptions = {
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
  },
  sendResetPassword: (email, hash, username) => {
    let transporter = nodemailer.createTransport(defaultConfig);
    let handlebarOptions = {
      viewEngine: {
        extName: ".hbs",
        partialsDir: "src/views/",
        layoutsDir: "src/views/",
        defaultLayout: "resetPassword.hbs"
      },
      viewPath: "src/views/",
      extName: ".hbs"
    };

    transporter.use("compile", hbs(handlebarOptions));

    let mailOptions = {
      from: parameters.mailer.user,
      to: email,
      subject: "Recuperación de contraseña",
      template: "resetPassword",
      context: {
        hash: hash,
        email: email,
        username: username
      }
    };
    transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log(`New reset password mail sent to ${email}`);
      })
      .catch(err => {
        console.error(err);
      });
  }
};
