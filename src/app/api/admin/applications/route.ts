import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/db";
import { jobApplications, user, applicationStatusEnum } from "@/db/schema";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jobRole = searchParams.get("jobRole") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(jobApplications.status, status as typeof applicationStatusEnum[number]));
    }
    
    if (jobRole && jobRole !== "all") {
      conditions.push(eq(jobApplications.jobRole, jobRole as any));
    }

    // Get applications with user info
    const applicationsQuery = db
      .select({
        id: jobApplications.id,
        jobRole: jobApplications.jobRole,
        status: jobApplications.status,
        submittedAt: jobApplications.submittedAt,
        linkedinUrl: jobApplications.linkedinUrl,
        githubUrl: jobApplications.githubUrl,
        portfolioUrl: jobApplications.portfolioUrl,
        notes: jobApplications.notes,
        userId: jobApplications.userId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(jobApplications)
      .leftJoin(user, eq(jobApplications.userId, user.id))
      .orderBy(desc(jobApplications.submittedAt))
      .limit(limit)
      .offset(offset);

    // Apply filters
    let applications;
    if (conditions.length > 0) {
      if (search) {
        applications = await applicationsQuery.where(
          and(
            ...conditions,
            or(
              ilike(user.email, `%${search}%`),
              ilike(user.name, `%${search}%`)
            )
          )
        );
      } else {
        applications = await applicationsQuery.where(and(...conditions));
      }
    } else if (search) {
      applications = await applicationsQuery.where(
        or(
          ilike(user.email, `%${search}%`),
          ilike(user.name, `%${search}%`)
        )
      );
    } else {
      applications = await applicationsQuery;
    }

    // Get total count
    const countConditions = [...conditions];
    let totalQuery = db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobApplications)
      .leftJoin(user, eq(jobApplications.userId, user.id));

    let totalResult;
    if (countConditions.length > 0) {
      if (search) {
        totalResult = await totalQuery.where(
          and(
            ...countConditions,
            or(
              ilike(user.email, `%${search}%`),
              ilike(user.name, `%${search}%`)
            )
          )
        );
      } else {
        totalResult = await totalQuery.where(and(...countConditions));
      }
    } else if (search) {
      totalResult = await totalQuery.where(
        or(
          ilike(user.email, `%${search}%`),
          ilike(user.name, `%${search}%`)
        )
      );
    } else {
      totalResult = await totalQuery;
    }

    const total = totalResult[0]?.count || 0;

    // Get status counts
    const statusCounts = await db
      .select({
        status: jobApplications.status,
        count: sql<number>`count(*)::int`,
      })
      .from(jobApplications)
      .groupBy(jobApplications.status);

    const statusCountsMap = Object.fromEntries(
      statusCounts.map((s) => [s.status, s.count])
    );

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statusCounts: statusCountsMap,
    });
  } catch (error) {
    console.error("Admin applications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
