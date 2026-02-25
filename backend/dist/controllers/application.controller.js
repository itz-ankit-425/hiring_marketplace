"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplications = exports.applyToJob = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Apply to a job
const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        // Check if user already applied
        const existingApplication = await prisma_1.default.application.findFirst({
            where: { userId, jobId },
        });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }
        const application = await prisma_1.default.application.create({
            data: {
                jobId,
                userId,
                status: "PENDING",
            },
            include: {
                job: true,
                user: true,
            },
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Application failed" });
    }
};
exports.applyToJob = applyToJob;
// Get logged-in user's applications
const getApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await prisma_1.default.application.findMany({
            where: { userId },
            include: {
                job: {
                    include: { employer: true },
                },
                user: true,
            },
        });
        res.json(applications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
};
exports.getApplications = getApplications;
