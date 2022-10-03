import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateCertificate,
  handleDeleteCertificate,
  handleGetAllCertificates,
  handleGetCertificateById,
  handleUpdateCertificateById,
} from "./controller";

export const router = Router();

// CRUD routes
router.get("/", ce(handleGetAllCertificates));
router.get("/:id", ce(handleGetCertificateById));
router.post("/", ce(handleCreateCertificate));
router.patch("/:id", ce(handleUpdateCertificateById));
router.delete("/:id", ce(handleDeleteCertificate));
export default router;
