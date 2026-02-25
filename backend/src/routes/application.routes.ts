import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  applyToJob,
  getApplications,
  getEmployerApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";

const router = Router();

router.post("/", authMiddleware, applyToJob);
router.get("/", authMiddleware, getApplications);
router.get("/employer/received", authMiddleware, getEmployerApplications);
router.patch("/:applicationId/status", authMiddleware, updateApplicationStatus);

export default router;