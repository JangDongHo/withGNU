import express from "express";
import { createComment, info } from "../controllers/placesController";
import { placeImgUpload } from "../middlewares";
import { protectorMiddleware } from "../middlewares";

const placesRouter = express.Router();

placesRouter
  .route("/:id([0-9a-f]{24})")
  .get(info)
  .post(
    placeImgUpload.fields([{ name: "commentImg" }]),
    protectorMiddleware,
    createComment
  );
export default placesRouter;
