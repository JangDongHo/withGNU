import express from "express";
import { home } from "../controllers/restaurantsController";

const rootRouter = express.Router();

rootRouter.get("/", home);

export default rootRouter;
