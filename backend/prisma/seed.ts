import prisma from "../src/utils/prisma";
import bcrypt from "bcryptjs";

async function main() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await prisma.application.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.user.deleteMany({});

    // Create employers
    const employer1 = await prisma.user.create({
      data: {
        name: "Tech Innovations Inc.",
        email: "hr@techinnovations.com",
        password: await bcrypt.hash("employer123", 10),
        role: "EMPLOYER",
      },
    });

    const employer2 = await prisma.user.create({
      data: {
        name: "Digital Solutions Ltd.",
        email: "jobs@digitalsolutions.com",
        password: await bcrypt.hash("employer123", 10),
        role: "EMPLOYER",
      },
    });

    const employer3 = await prisma.user.create({
      data: {
        name: "Cloud Systems Global",
        email: "careers@cloudsystems.com",
        password: await bcrypt.hash("employer123", 10),
        role: "EMPLOYER",
      },
    });

    // Create job seeker
    const jobSeeker = await prisma.user.create({
      data: {
        name: "John Developer",
        email: "john@example.com",
        password: await bcrypt.hash("seeker123", 10),
        role: "USER",
      },
    });

    // Create jobs
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          title: "Senior Full Stack Developer",
          description:
            "We are looking for an experienced Full Stack Developer to join our growing team. You will work with React, Node.js, and PostgreSQL to build scalable applications. Requirements: 5+ years of experience, strong TypeScript knowledge, and experience with cloud platforms.",
          location: "San Francisco, CA",
          employerId: employer1.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Frontend Engineer - React",
          description:
            "Join our frontend team to build beautiful and responsive user interfaces. You will collaborate with designers and backend engineers to create amazing user experiences. Required: React expertise, CSS/Tailwind CSS, and TypeScript.",
          location: "New York, NY",
          employerId: employer1.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Backend Engineer - Node.js",
          description:
            "We need a talented backend engineer to develop robust APIs and microservices. You will work with Node.js, Express, and PostgreSQL. Experience with Docker and Kubernetes is a plus. Competitive salary and benefits.",
          location: "Austin, TX",
          employerId: employer2.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "DevOps Engineer",
          description:
            "Help us build and maintain our cloud infrastructure. You will work with AWS, Docker, Kubernetes, and CI/CD pipelines. We are looking for someone with strong Linux skills and cloud deployment experience.",
          location: "Seattle, WA",
          employerId: employer2.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Data Scientist",
          description:
            "Join our data science team to work on machine learning projects. You will use Python, TensorFlow, and SQL to analyze and visualize data. PhD or Master's in CS/Statistics preferred.",
          location: "Boston, MA",
          employerId: employer3.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Product Manager",
          description:
            "Lead product strategy and development for our flagship product. You will work with engineering, design, and marketing teams. Experience with SaaS products and agile methodologies required.",
          location: "Remote",
          employerId: employer3.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "UI/UX Designer",
          description:
            "Create amazing user experiences and interfaces. You will work with Figma, prototyping tools, and collaborate with engineers. Portfolio required. Experience with accessibility standards is a plus.",
          location: "Los Angeles, CA",
          employerId: employer1.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Mobile Developer - iOS",
          description:
            "Develop native iOS applications using Swift. You will work on our mobile app that serves millions of users. Requirements: 3+ years Swift experience, knowledge of SwiftUI, and App Store submission experience.",
          location: "San Jose, CA",
          employerId: employer2.id,
        },
      }),
    ]);

    console.log("✅ Seeding completed!");
    console.log(`Created ${jobs.length} jobs across 3 employers`);
    console.log(`Created 1 job seeker account for testing`);
    console.log("\n📝 Test Accounts:");
    console.log("Employer: hr@techinnovations.com / employer123");
    console.log("Job Seeker: john@example.com / seeker123");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
