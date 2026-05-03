import { Router } from "express";
import { me, updateAvatar, updatePassword, updateProfile } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";

export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, asyncHandler(me));
usersRouter.patch("/users/me", requireAuth, asyncHandler(updateProfile));
usersRouter.patch("/users/me/password", requireAuth, asyncHandler(updatePassword));
usersRouter.post("/users/me/avatar", requireAuth, asyncHandler(updateAvatar));
