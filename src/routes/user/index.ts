import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleGetCertificatesByUserId,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllUsers));
router.get("/:id", ce(handleGetUserById));
router.post("/", ce(handleCreateUser));
router.patch("/:id", ce(handleUpdateUserById));
router.delete("/:id", ce(handleDeleteUser));

// Special APIs
// Get certificates by userId
router.get("/:id/certificates", handleGetCertificatesByUserId);
export default router;
