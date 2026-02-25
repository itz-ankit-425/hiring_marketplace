import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, location } = req.body;
    const employerId = (req as any).user.id;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        employerId,
      },
      include: { employer: true },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Job creation failed" });
  }
};

export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { employer: true },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { employer: true, applications: true },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};