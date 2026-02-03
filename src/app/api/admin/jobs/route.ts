import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  triggerRankRecalculation,
  triggerSocialRefresh,
  triggerUserRankRecalculation,
  triggerUserSocialRefresh,
} from "@/lib/queue/scheduler";
import { rankingsQueue, socialRefreshQueue, cleanupQueue } from "@/lib/queue";

/**
 * GET /api/admin/jobs - Get queue statistics
 */
export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin
  const [adminUser] = await db
    .select({ isAdmin: user.isAdmin })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!adminUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [rankingsStats, socialStats, cleanupStats] = await Promise.all([
      rankingsQueue().getJobCounts(),
      socialRefreshQueue().getJobCounts(),
      cleanupQueue().getJobCounts(),
    ]);

    return NextResponse.json({
      queues: {
        rankings: rankingsStats,
        socialRefresh: socialStats,
        cleanup: cleanupStats,
      },
    });
  } catch (error) {
    console.error("Failed to get queue stats:", error);
    return NextResponse.json(
      { error: "Failed to get queue statistics. Is Redis connected?" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/jobs - Trigger a job manually
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin
  const [adminUser] = await db
    .select({ isAdmin: user.isAdmin })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!adminUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { job, userId } = body;

    switch (job) {
      case "recalculate_all_ranks":
        await triggerRankRecalculation();
        return NextResponse.json({ message: "Rank recalculation job queued" });

      case "recalculate_user_rank":
        if (!userId) {
          return NextResponse.json(
            { error: "userId required for user rank recalculation" },
            { status: 400 }
          );
        }
        await triggerUserRankRecalculation(userId);
        return NextResponse.json({
          message: `Rank recalculation queued for user ${userId}`,
        });

      case "refresh_twitter":
        await triggerSocialRefresh("twitter");
        return NextResponse.json({ message: "Twitter refresh job queued" });

      case "refresh_discord":
        await triggerSocialRefresh("discord");
        return NextResponse.json({ message: "Discord refresh job queued" });

      case "refresh_all_social":
        await triggerSocialRefresh("all");
        return NextResponse.json({ message: "All social refresh jobs queued" });

      case "refresh_user_social":
        if (!userId) {
          return NextResponse.json(
            { error: "userId required for user social refresh" },
            { status: 400 }
          );
        }
        await triggerUserSocialRefresh(userId, "all");
        return NextResponse.json({
          message: `Social refresh queued for user ${userId}`,
        });

      default:
        return NextResponse.json(
          {
            error: "Unknown job type",
            validJobs: [
              "recalculate_all_ranks",
              "recalculate_user_rank",
              "refresh_twitter",
              "refresh_discord",
              "refresh_all_social",
              "refresh_user_social",
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Failed to trigger job:", error);
    return NextResponse.json(
      { error: "Failed to trigger job. Is Redis connected?" },
      { status: 500 }
    );
  }
}
