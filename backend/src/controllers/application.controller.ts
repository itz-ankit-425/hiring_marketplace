import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Apply to a job
export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = (req as any).user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: { userId, jobId },
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await prisma.application.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Application failed" });
  }
};

// Get logged-in user's applications (for job seekers)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: { employer: true },
        },
        user: true,
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Get applications for employer's jobs (for employers)
export const getEmployerApplications = async (req: Request, res: Response) => {
  try {
    const employerId = (req as any).user.id;

    // Get all jobs posted by this employer
    const jobs = await prisma.job.findMany({
      where: { employerId },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      return res.json([]);
    }

    // Get all applications for those jobs
    const applications = await prisma.application.findMany({
      where: {
        jobId: {
          in: jobIds,
        },
      },
      include: {
        job: {
          include: { employer: true },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Update application status (for employers)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = (req as any).user.id;

    if (!applicationId || !status) {
      return res.status(400).json({ message: "Application ID and status are required" });
    }

    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Verify that the application belongs to a job posted by this employer
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employerId !== employerId) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        job: {
          include: { employer: true },
        },
        user: true,
      },
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update application" });
  }
};