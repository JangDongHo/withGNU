import smtpTransport from "../config/email";

const generateRandom = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

export const emailAuth = async (req, res) => {
  const pageTitle = "회원가입";
  const { id, number } = req.body;
  // 2단계
  if (number) {
    // 인증번호가 일치할 경우
    if (req.session.emailCode === Number(number)) {
      return res.render("users/join/join-3");
    }
    // 인증번호가 일치하지 않을 경우
    else {
      req.flash("error", "인증번호가 일치하지 않습니다.");
      return res.status(400).render("users/join/join-2", { pageTitle });
    }
  }
  // 1단계
  else {
    const email = id + "@gnu.ac.kr";
    const randomNum = generateRandom(111111, 999999);

    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "[eatGNU]인증 관련 이메일 입니다",
      text: "오른쪽 숫자 6자리를 입력해주세요 : " + randomNum,
    };

    smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        req.session.emailCode = randomNum;
        return res.render("users/join/join-2", { pageTitle });
      }
      smtpTransport.close();
    });
  }
};

export const getJoin = (req, res) => {
  console.log(req.session);
  return res.render("users/join/join-1", { pageTitle: "회원가입" });
};

export const getLogin = (req, res) => {};
