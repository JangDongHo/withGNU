import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";

const app = express();
const logger = morgan("dev");
app.use(logger);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/", rootRouter);

export default app;
