import express from "express";
import { list } from "../controllers/restaurantsController";

const listsRouter = express.Router();

listsRouter.get("/", list);

export default listsRouter;
