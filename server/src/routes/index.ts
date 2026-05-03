import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { contactRouter } from "./contact.routes";
import { healthRouter } from "./health.routes";
import { itemRouter } from "./item.routes";
import { rbacRouter } from "./rbac.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(authRouter);
apiRouter.use(itemRouter);
apiRouter.use(contactRouter);
apiRouter.use(usersRouter);
apiRouter.use(adminRouter);
apiRouter.use(rbacRouter);
