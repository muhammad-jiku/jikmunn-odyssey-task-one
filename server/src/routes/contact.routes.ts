import { Router } from "express";
import { create, list } from "../controllers/contact.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";

export const contactRouter = Router();

contactRouter.post("/contact", asyncHandler(create));
contactRouter.get("/contact", requireAuth, requireRole(["admin"]), asyncHandler(list));
