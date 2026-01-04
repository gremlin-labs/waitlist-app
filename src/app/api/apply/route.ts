import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { jobApplications, jobRoleEnum } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const applicationSchema = z.object({
  jobRole: z.enum(jobRoleEnum),
  passionResponse: z.string().min(10, "Please write at least a few sentences"),
  workStyleResponse: z.string().min(10, "Please write at least a few sentences"),
  experienceResponse: z.string().min(10, "Please write at least a few sentences"),
  linkedinUrl: z.string().url().regex(/linkedin\.com/i, "Must be a LinkedIn URL"),
  githubUrl: z.string().url().regex(/github\.com/i, "Must be a GitHub URL").nullable(),
  portfolioUrl: z.string().url().nullable().or(z.literal("")),
});

const DEV_ROLES = ["zig-ml", "zig-perf", "swiftui", "fullstack"];

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Developer roles require GitHub
    if (DEV_ROLES.includes(data.jobRole) && !data.githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required for developer roles" },
        { status: 400 }
      );
    }

    // Check for existing application
    const existing = await db.query.jobApplications.findFirst({
      where: and(
        eq(jobApplications.userId, session.user.id),
        eq(jobApplications.jobRole, data.jobRole)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 400 }
      );
    }

    // Create application
    const [application] = await db.insert(jobApplications).values({
      userId: session.user.id,
      jobRole: data.jobRole,
      passionResponse: data.passionResponse,
      workStyleResponse: data.workStyleResponse,
      experienceResponse: data.experienceResponse,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl || null,
    }).returning();

    return NextResponse.json({ 
      success: true,
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
