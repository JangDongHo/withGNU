import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "eatGNU";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const placeImgUpload = multer({
  dest: "uploads/placeImg/",
  limits: {
    fileSize: 10000000000,
  },
  storage: undefined,
});
