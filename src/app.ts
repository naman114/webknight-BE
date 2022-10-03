import Express from "express";
import cors from "cors";
import config from "./config";
import apiRouter from "./routes";
import authRouter from "./routes/auth";

export const app = Express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(Express.json());

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send(
    'hello there, see the documentation here: <a href="" target="__blank">Link</a>'
  );
});
export default app;
