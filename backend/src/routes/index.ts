import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import educationApplicationRoutes from "./educationApplication.routes.js";
import tradingToolsApplicationRoutes from "./tradingToolsApplication.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/education-applications", educationApplicationRoutes);
router.use("/trading-tools-applications", tradingToolsApplicationRoutes);
router.use("/admin", adminRoutes);

export default router;
