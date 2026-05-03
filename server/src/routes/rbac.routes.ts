import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";

export const rbacRouter = Router();

rbacRouter.get("/protected/profile", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Authenticated access granted",
    auth: req.auth
  });
});

rbacRouter.get("/protected/admin", requireAuth, requireRole(["admin"]), (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Admin access granted",
    auth: req.auth
  });
});
