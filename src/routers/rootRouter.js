import express from "express";

const rootRouter = express.Router();

rootRouter.get("/", home);

export default rootRouter;
