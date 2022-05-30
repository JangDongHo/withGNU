import express from "express";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import restaurantsRouter from "./routers/restaurantsRouter";

const app = express();
const logger = morgan("dev");
app.use(logger);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/restaurants", restaurantsRouter);

export default app;
