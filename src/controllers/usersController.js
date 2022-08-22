import smtpTransport from "../config/email";
import Users from "../models/Users";
import bcrypt from "bcrypt";

const generateRandom = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

export const emailAuth = async (req, res) => {
  const pageTitle = "회원가입";
  const { id, number, username, password } = req.body;
  // 3단계
  if (username && password) {
    const userExists = await Users.exists({ username });
    if (userExists) {
      req.flash("error", "같은 닉네임이 존재합니다.");
      return res.status(400).render("users/join/join-3", { pageTitle });
    }
    // 같은 닉네임이 존재하는 경우
    const email = req.session.email;
    // 악용 방지
    const emailExists = await Users.exists({ email });
    if (emailExists) {
      req.flash("error", "이미 인증된 계정이 존재합니다.");
      return res.redirect("/login");
    }
    // 유저 정보 DB 저장
    try {
      await Users.create({
        email,
        username,
        password,
      });
      return res.redirect("/login");
    } catch (error) {
      req.flash("error", error);
      return res.status(400).render("users/join/join-3", { pageTitle });
    }
  }
  // 2단계
  else if (number) {
    // 인증번호가 일치할 경우
    const { emailCode } = req.session;
    if (emailCode === Number(number)) {
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
    const exists = await Users.exists({ email });
    if (exists) {
      req.flash("error", "이미 인증된 계정이 존재합니다.");
      return res.status(400).render("users/join/join-1", { pageTitle });
    }
    // 이미 계정이 있을 경우
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
        console.log(info);
        req.session.email = email;
        req.session.emailCode = randomNum;
        return res.render("users/join/join-2", { pageTitle });
      }
      smtpTransport.close();
    });
  }
};

export const getJoin = (req, res) => {
  return res.render("users/join/join-1", { pageTitle: "회원가입" });
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "로그인";
  const { id, password } = req.body;
  const email = id + "@gnu.ac.kr";
  const user = await Users.findOne({ email });
  // ID가 틀릴 경우
  if (!user) {
    req.flash("error", "존재하지 않는 사용자입니다.");
    return res.status(400).render("users/login", { pageTitle });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "비밀번호를 다시 확인해주세요.");
    return res.status(400).render("users/login", { pageTitle });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id)
    .populate("likes")
    .populate({
      path: "comments",
      populate: { path: "place" },
    });
  return res.render("users/profile", {
    pageTitle: `${user.username}님의 프로필`,
    user,
    id,
  });
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const checkLogin = (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(200).json({ msg: "Unauthorized" });
  }
  return res.status(200).json({ msg: "Authorized" });
};
