import smtpTransport from "../config/email";

export const getJoin = (req, res) => {
  return res.render("users/join");
};

export const getLogin = (req, res) => {};
