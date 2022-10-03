import { Request, Response, Router } from "express";
import userRouter from "./user";
import certificateRouter from "./certificate";
import templateRouter from "./template";

const router = Router();

router.use("/user", userRouter);
router.use("/certificate", certificateRouter);
router.use("/template", templateRouter);

router.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

export default router;
