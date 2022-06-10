import smtpTransport from "../config/email";

let generateRandom = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

export const emailAuth = (req, res) => {
  console.log(req);
};

export const getJoin = (req, res) => {
  return res.render("users/join");
};

export const getLogin = (req, res) => {};
