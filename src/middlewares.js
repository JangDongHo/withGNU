export const localsMiddleware = (req, res, next) => {
  req.locals.siteName = "eatGNU";
  next();
};
