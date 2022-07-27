import express from "express";
import { createComment, info } from "../controllers/restaurantsController";

const restaurantsRouter = express.Router();

restaurantsRouter.route("/:id([0-9a-f]{24})").get(info).post(createComment);

export default restaurantsRouter;
