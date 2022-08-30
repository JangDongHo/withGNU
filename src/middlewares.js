import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import fs from "fs";
import rateLimit from "express-rate-limit";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3AvatarUploader = multerS3({
  s3: s3,
  bucket: "withgnu/avatars",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const s3PlaceImgUploader = multerS3({
  s3: s3,
  bucket: "withgnu/reviews",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const isHeroku = process.env.NODE_ENV === "production";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "withGNU";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  res.locals.basicProfile =
    "https://www.gnu.ac.kr/images/web/main/sub_cnt/btype_vi_img18.png";
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

export const expressRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "너무 많은 작업을 요청하고 있습니다.",
});

export const reviewRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  handler: function (req, res, next) {
    req.flash("error", "리뷰 작성은 분당 최대 1개까지만 허용하고 있습니다.");
    return res.redirect(`/places/${req.params.id}`);
  },
});

const placeImageFilter = (req, file, cb) => {
  const imagesSize = parseInt(req.headers["content-length"]);
  const typeArray = file.mimetype.split("/");
  const fileType = typeArray[1];
  const acceptFileType = ["jpg", "png", "jpeg"];
  if (imagesSize >= 12 * 1024 * 1024) {
    req.fileValidationError = "파일 크기가 너무 큽니다. (최대 12MB)";
    return cb(null, false);
  }
  if (!acceptFileType.includes(fileType)) {
    req.fileValidationError = "jpg, jpeg, png 파일만 업로드 가능합니다.";
    return cb(null, false);
  }
  return cb(null, true);
};

const avatarImageFilter = (req, file, cb) => {
  const imagesSize = parseInt(req.headers["content-length"]);
  const typeArray = file.mimetype.split("/");
  const fileType = typeArray[1];
  const acceptFileType = ["jpg", "png", "jpeg"];
  if (imagesSize >= 3 * 1024 * 1024) {
    req.fileValidationError = "파일 크기가 너무 큽니다. (최대 3MB)";
    return cb(null, false);
  }
  if (!acceptFileType.includes(fileType)) {
    req.fileValidationError = "jpg, jpeg, png 파일만 업로드 가능합니다.";
    return cb(null, false);
  }
  return cb(null, true);
};

export const placeImgUpload = multer({
  dest: "uploads/placeImg/",
  fileFilter: placeImageFilter,
  storage: isHeroku ? s3PlaceImgUploader : undefined,
});

export const avartarImgUpload = multer({
  dest: "uploads/avartarImg/",
  fileFilter: avatarImageFilter,
  storage: isHeroku ? s3AvatarUploader : undefined,
}).single("avartarImage");

export const deleteAvatarImg = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  if (isHeroku) {
    s3.deleteObject(
      {
        Bucket: "withgnu/avatars",
        Key: `${req.session.user.avatarUrl.split("/")[4]}`,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );
  } else {
    try {
      fs.unlinkSync(`./${req.session.user.avatarUrl}`);
    } catch (error) {
      console.log(error);
    }
  }
  next();
};

export const deletePlaceImg = (req, res, next) => {
  const {
    body: { imagePaths },
  } = req;
  imagePaths.forEach((image) => {
    if (isHeroku) {
      s3.deleteObject(
        {
          Bucket: "withgnu/reviews",
          Key: `${image.split("/")[4]}`,
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
    } else {
      fs.unlinkSync(`./${image}`);
    }
  });
  next();
};
