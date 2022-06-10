import express from "express";
import { emailAuth } from "../controllers/usersController";

const apiRouter = express.Router();

apiRouter.post("/join/emailAuth", emailAuth);

export default apiRouter;
