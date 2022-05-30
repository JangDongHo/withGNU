import express from "express";
import { info } from "../controllers/restaurantsController";

const restaurantsRouter = express.Router();

restaurantsRouter.get("/:id([0-9a-f]{24})", info);

export default restaurantsRouter;
