import { Router } from "express";
import { ce } from "~/lib/captureError";
import {
  handleCreateTemplate,
  handleDeleteTemplate,
  handleGetAllTemplates,
  handleGetTemplateById,
  handleUpdateTemplateById,
} from "./controller";

export const router = Router();

//CRUD routes
router.get("/", ce(handleGetAllTemplates));
router.get("/:id", ce(handleGetTemplateById));
router.post("/", ce(handleCreateTemplate));
router.patch("/:id", ce(handleUpdateTemplateById));
router.delete("/:id", ce(handleDeleteTemplate));

export default router;
