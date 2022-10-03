import { Router } from "express";
import { ce } from "~/lib/captureError";
import { handleLogin, getCurrentUser } from "./controller";

export const router = Router();

//CRUD routes
router.post("/login", ce(handleLogin));
router.get("/me", ce(getCurrentUser));
export default router;
