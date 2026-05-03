import { Router } from "express";
import { charts, items, overview, removeItem, updateUserRole, users } from "../controllers/admin.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["admin"]));

adminRouter.get("/admin/overview", asyncHandler(overview));
adminRouter.get("/admin/users", asyncHandler(users));
adminRouter.patch("/admin/users/:id/role", asyncHandler(updateUserRole));
adminRouter.get("/admin/items", asyncHandler(items));
adminRouter.delete("/admin/items/:id", asyncHandler(removeItem));
adminRouter.get("/admin/reports/charts", asyncHandler(charts));
