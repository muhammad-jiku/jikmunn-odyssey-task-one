import { Router } from "express";
import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { itemRouter } from "./item.routes";
import { rbacRouter } from "./rbac.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(itemRouter);
apiRouter.use(rbacRouter);
