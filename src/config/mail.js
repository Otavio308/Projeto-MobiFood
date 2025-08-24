const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Exemplo: 'gmail'. Você pode usar outros como 'Outlook' ou configurar host/port.
  auth: {
    user: process.env.EMAIL_USER, // Seu email (ex: seu.email@gmail.com)
    pass: process.env.EMAIL_PASS, // Sua senha de aplicativo ou senha do email
  },
});

module.exports = transporter;