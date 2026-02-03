import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, betaSurveys } from "@/db/schema";
import { count, sql, gte, isNotNull } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

// GET: Survey and user analytics
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Total users
    const [totalUsers] = await db.select({ count: count() }).from(user);

    // Users by beta status
    const statusCounts = await db
      .select({
        status: user.betaStatus,
        count: count(),
      })
      .from(user)
      .groupBy(user.betaStatus);

    // Survey completion stats
    const [surveyStats] = await db
      .select({
        completed: count(user.surveyCompletedAt),
      })
      .from(user)
      .where(isNotNull(user.surveyCompletedAt));

    // Signups over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySignups = await db
      .select({
        date: sql<string>`DATE(${user.createdAt})`,
        count: count(),
      })
      .from(user)
      .where(gte(user.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${user.createdAt})`)
      .orderBy(sql`DATE(${user.createdAt})`);

    // Survey data aggregation (tools used)
    const toolsUsed = await db
      .select({
        tools: betaSurveys.toolsUsed,
      })
      .from(betaSurveys);

    // Count tool frequency
    const toolCounts: Record<string, number> = {};
    for (const row of toolsUsed) {
      if (row.tools) {
        for (const tool of row.tools) {
          toolCounts[tool] = (toolCounts[tool] || 0) + 1;
        }
      }
    }

    // Sort tools by frequency
    const topTools = Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tool, count]) => ({ tool, count }));

    // Primary tool aggregation
    const primaryTools = await db
      .select({
        tool: betaSurveys.primaryTool,
        count: count(),
      })
      .from(betaSurveys)
      .where(isNotNull(betaSurveys.primaryTool))
      .groupBy(betaSurveys.primaryTool);

    // Mac model distribution
    const macModels = await db
      .select({
        model: betaSurveys.macModel,
        count: count(),
      })
      .from(betaSurveys)
      .where(isNotNull(betaSurveys.macModel))
      .groupBy(betaSurveys.macModel);

    // Vibe experience level distribution
    const vibeExperience = await db
      .select({
        level: betaSurveys.vibeCodeExperience,
        count: count(),
      })
      .from(betaSurveys)
      .where(isNotNull(betaSurveys.vibeCodeExperience))
      .groupBy(betaSurveys.vibeCodeExperience);

    return NextResponse.json({
      users: {
        total: totalUsers.count,
        byStatus: Object.fromEntries(
          statusCounts.map((s) => [s.status || "unknown", s.count])
        ),
        surveyCompleted: surveyStats.completed,
        surveyRate: totalUsers.count > 0 
          ? ((surveyStats.completed / totalUsers.count) * 100).toFixed(1) + "%"
          : "0%",
      },
      growth: {
        last30Days: dailySignups,
      },
      survey: {
        topTools,
        primaryTools: Object.fromEntries(
          primaryTools.map((p) => [p.tool || "unknown", p.count])
        ),
        macModels: Object.fromEntries(
          macModels.map((m) => [m.model || "unknown", m.count])
        ),
        vibeExperience: Object.fromEntries(
          vibeExperience.map((v) => [v.level || "unknown", v.count])
        ),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
