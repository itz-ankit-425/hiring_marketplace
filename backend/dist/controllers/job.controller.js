"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobById = exports.getAllJobs = exports.createJob = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const createJob = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const employerId = req.user.id;
        if (!title || !description || !location) {
            return res.status(400).json({ message: "Title, description, and location are required" });
        }
        const job = await prisma_1.default.job.create({
            data: {
                title,
                description,
                location,
                employerId,
            },
            include: { employer: true },
        });
        res.status(201).json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Job creation failed" });
    }
};
exports.createJob = createJob;
const getAllJobs = async (_req, res) => {
    try {
        const jobs = await prisma_1.default.job.findMany({
            include: { employer: true },
        });
        res.json(jobs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};
exports.getAllJobs = getAllJobs;
const getJobById = async (req, res) => {
    try {
        const job = await prisma_1.default.job.findUnique({
            where: { id: req.params.id },
            include: { employer: true, applications: true },
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch job" });
    }
};
exports.getJobById = getJobById;
