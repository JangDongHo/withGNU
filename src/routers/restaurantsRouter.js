import express from "express";
import { createComment, info } from "../controllers/restaurantsController";
import { placeImgUpload } from "../middlewares";

const restaurantsRouter = express.Router();

restaurantsRouter
  .route("/:id([0-9a-f]{24})")
  .get(info)
  .post(placeImgUpload.fields([{ name: "commentImg" }]), createComment);
export default restaurantsRouter;
