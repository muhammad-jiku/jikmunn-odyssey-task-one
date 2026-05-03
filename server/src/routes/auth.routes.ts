import { Router } from "express";
import
    {
        demoLogin,
        login,
        logout,
        me,
        refresh,
        register
    } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/auth/register", asyncHandler(register));
authRouter.post("/auth/login", asyncHandler(login));
authRouter.post("/auth/demo-login", asyncHandler(demoLogin));
authRouter.post("/auth/refresh", asyncHandler(refresh));
authRouter.post("/auth/logout", asyncHandler(logout));
authRouter.get("/auth/me", requireAuth, asyncHandler(me));
