import smtpTransport from "../config/email";

let generateRandom = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

export const emailAuth = async (req, res) => {
  const { id } = req.body;
  const email = id + "@gnu.ac.kr";
  const number = generateRandom(111111, 999999);

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "[eatGNU]인증 관련 이메일 입니다",
    text: "오른쪽 숫자 6자리를 입력해주세요 : " + number,
  };

  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).send({ number });
    }
    smtpTransport.close();
  });
};

export const getJoin = (req, res) => {
  return res.render("users/join");
};

export const getLogin = (req, res) => {};
