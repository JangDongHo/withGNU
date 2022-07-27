import express from "express";
import { createComment } from "../controllers/restaurantsController";

const apiRouter = express.Router();

apiRouter.post("/restaurants/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
