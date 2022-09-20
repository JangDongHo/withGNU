import smtpTransport from "../config/email";
import Users from "../models/Users";
import bcrypt from "bcrypt";

const generateRandom = (min, max) => {
  let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

export const emailAuth = async (req, res) => {
  const pageTitle = "회원가입";
  const { id, number, password, password2, username, acceptPolicy } = req.body;
  // 3단계
  if (password && password2 && username) {
    const userExists = await Users.exists({ username });
    if (password !== password2) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.status(400).render("users/join/join-3", { pageTitle });
    }
    if (userExists) {
      req.flash("error", "같은 닉네임이 존재합니다.");
      return res.status(400).render("users/join/join-3", { pageTitle });
    }
    // 악용 방지
    const email = req.session.email;
    const emailExists = await Users.exists({ email });
    if (emailExists) {
      req.flash("error", "이미 인증된 계정이 존재합니다.");
      return res.status(400).render("/login", { pageTitle });
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
      req.flash("error", JSON.stringify(error));
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
    if (acceptPolicy !== "on") {
      req.flash("error", "이용약관 및 개인정보취급방침에 동의하셔야 합니다.");
      return res.status(400).render("users/join/join-1", { pageTitle });
    }
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
      subject: "[withGNU]인증 관련 이메일 입니다",
      text: "오른쪽 숫자 6자리를 입력해주세요 : " + randomNum,
    };
    try {
      smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          req.session.email = email;
          req.session.emailCode = randomNum;
          return res.render("users/join/join-2", { pageTitle });
        }
        smtpTransport.close();
      });
    } catch (error) {
      req.flash("error", "이메일 발송 오류(관리자에게 문의해주세요.)");
      console.log(error);
      return res.status(400).render("users/join/join-1", { pageTitle });
    }
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

export const getEditProfile = (req, res) => {
  const user = req.session.user;
  return res.render("users/edit-profile", { pageTitle: "프로필 수정", user });
};

export const postEditProfile = async (req, res) => {
  const {
    session: {
      user: { avatarUrl, _id, username },
    },
    body: { avatarName },
    fileValidationError,
    file,
  } = req;
  try {
    // 허용하지 않는 파일일 경우
    if (fileValidationError) {
      req.flash("error", fileValidationError);
      return res.redirect(`/users/edit-profile`);
    }
    // 닉네임 중복 체크
    if (username !== avatarName) {
      const userExists = await Users.exists({ username: avatarName });
      if (userExists) {
        req.flash("error", "같은 닉네임이 존재합니다.");
        return res.redirect(`/users/edit-profile`);
      }
    }
    const isHeroku = process.env.NODE_ENV === "production";

    const updatedUser = await Users.findByIdAndUpdate(
      _id,
      {
        username: avatarName,
        avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect(`/users/${_id}`);
  } catch (error) {
    req.flash("error", JSON.stringify(error));
    return res.redirect(`/users/edit-profile`);
  }
};

export const getEditPassword = (req, res) => {
  const user = req.session.user;
  return res.render("users/edit-password", {
    pageTitle: "비밀번호 변경",
    user,
  });
};

export const postEditPassword = async (req, res) => {
  const { _id } = req.session.user;
  const { password1, password2, password3 } = req.body;
  const user = await Users.findById(_id);
  const checkOldpassword = await bcrypt.compare(password1, user.password);
  const pageTitle = "비밀번호 변경";
  if (!checkOldpassword) {
    req.flash("error", "현재 비밀번호를 다시 확인해주세요.");
    return res.status(400).render("users/edit-password", { pageTitle });
  }
  if (password2 !== password3) {
    req.flash("error", "새로운 비밀번호 확인을 다시 확인해주세요.");
    return res.status(400).render("users/edit-password", { pageTitle });
  }
  user.password = password2;
  user.save();
  req.flash("info", "비밀번호가 변경되었습니다.");
  return res.redirect(`/users/${_id}`);
};

export const privacyPolicy = (req, res) => {
  return res.render("footer/privacyPolicy", { pageTitle: "개인정보처리방침" });
};

export const servicePolicy = (req, res) => {
  return res.render("footer/servicePolicy", { pageTitle: "이용약관" });
};
