import { Router } from "express";
import
    {
        create,
        getById,
        list,
        remove,
        update
    } from "../controllers/item.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { optionalAuth } from "../middleware/optional-auth";

export const itemRouter = Router();

itemRouter.get("/items", optionalAuth, asyncHandler(list));
itemRouter.get("/items/:id", asyncHandler(getById));
itemRouter.post("/items", requireAuth, asyncHandler(create));
itemRouter.patch("/items/:id", requireAuth, asyncHandler(update));
itemRouter.delete("/items/:id", requireAuth, asyncHandler(remove));
