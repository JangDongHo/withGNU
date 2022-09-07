import nodemailer from "nodemailer";

const smtpTransport = nodemailer.createTransport({
  pool: true,
  service: "Naver",
  host: "smtp.naver.com",
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export default smtpTransport;
