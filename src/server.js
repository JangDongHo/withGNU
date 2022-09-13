import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import rootRouter from "./routers/rootRouter";
import placesRouter from "./routers/placesRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware, expressRateLimit } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");
const adminJS = new AdminJS({
  database: [],
  rootPath: "/admin",
});
const adminRouter = AdminJSExpress.buildRouter(adminJS);
app.use(adminJS.options.rootPath, adminRouter);
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy: same-site");
  res.header("Cross-Origin-Resource-Policy: cross-origin");
  next();
});
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", expressRateLimit, rootRouter);
app.use("/places", expressRateLimit, placesRouter);
app.use("/users", expressRateLimit, userRouter);
app.use("/api", expressRateLimit, apiRouter);

export default app;
