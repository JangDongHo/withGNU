import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "withGNU";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "권한이 없습니다.");
    return res.redirect("/");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "권한이 없습니다.");
    return res.redirect("/");
  }
};

export const placeImgUpload = multer({
  dest: "uploads/placeImg/",
  limits: {
    fileSize: 10000000000,
  },
  storage: undefined,
});

export const avartarImgUpload = multer({
  dest: "uploads/avartarImg/",
  limits: {
    fileSize: 3000000,
  },
  storage: undefined,
});
