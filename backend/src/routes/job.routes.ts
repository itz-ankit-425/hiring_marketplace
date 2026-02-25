import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createJob,
  getAllJobs,
  getJobById,
} from "../controllers/job.controller";

const router = Router();

router.post("/", authMiddleware, createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;