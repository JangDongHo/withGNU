import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import fs from "fs";

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

export const placeImgUpload = multer({
  dest: "uploads/placeImg/",
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  storage: isHeroku ? s3PlaceImgUploader : undefined,
});

export const avartarImgUpload = multer({
  dest: "uploads/avartarImg/",
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  storage: isHeroku ? s3AvatarUploader : undefined,
});

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
    try {
      if (isHeroku) {
        s3.deleteObject({
          Bucket: "withgnu/reviews",
          Key: `${image.split("/")[4]}`,
        });
      } else {
        fs.unlinkSync(`./${image}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
  next();
};
