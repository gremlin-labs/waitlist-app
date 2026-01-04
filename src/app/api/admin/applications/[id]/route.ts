import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/db";
import { jobApplications, user, applicationStatusEnum } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET single application
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [application] = await db
      .select({
        id: jobApplications.id,
        jobRole: jobApplications.jobRole,
        status: jobApplications.status,
        passionResponse: jobApplications.passionResponse,
        workStyleResponse: jobApplications.workStyleResponse,
        experienceResponse: jobApplications.experienceResponse,
        linkedinUrl: jobApplications.linkedinUrl,
        githubUrl: jobApplications.githubUrl,
        portfolioUrl: jobApplications.portfolioUrl,
        notes: jobApplications.notes,
        submittedAt: jobApplications.submittedAt,
        reviewedAt: jobApplications.reviewedAt,
        userId: jobApplications.userId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(jobApplications)
      .leftJoin(user, eq(jobApplications.userId, user.id))
      .where(eq(jobApplications.id, id));

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Admin application fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// PATCH update application status/notes
const updateSchema = z.object({
  status: z.enum(applicationStatusEnum).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    
    if (parsed.data.status !== undefined) {
      updates.status = parsed.data.status;
      updates.reviewedAt = new Date();
    }
    
    if (parsed.data.notes !== undefined) {
      updates.notes = parsed.data.notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const [updated] = await db
      .update(jobApplications)
      .set(updates)
      .where(eq(jobApplications.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Admin application update error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
