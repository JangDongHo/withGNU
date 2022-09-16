import express from "express";
import { createComment, info } from "../controllers/placesController";
import { placeImgUpload } from "../middlewares";
import { protectorMiddleware, reviewRateLimit } from "../middlewares";

const placesRouter = express.Router();

placesRouter
  .route("/:id([0-9a-f]{24})")
  .get(info)
  .post(
    placeImgUpload.fields([
      { name: "commentImg1" },
      { name: "commentImg2" },
      { name: "commentImg3" },
    ]),
    protectorMiddleware,
    createComment
  );
export default placesRouter;
