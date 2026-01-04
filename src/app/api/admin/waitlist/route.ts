import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, twitterConnections, discordConnections, referrals } from "@/db/schema";
import { eq, sql, desc, asc, or, ilike, and, count } from "drizzle-orm";

/**
 * GET /api/admin/waitlist - Get full waitlist with points and social data
 */
export async function GET(req: NextRequest) {
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

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const sortBy = url.searchParams.get("sort") || "rank";
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "waitlist";

  // Build base query with subqueries for social connections and referrals
  const baseConditions = [];
  
  // Status filter
  if (status && status !== "all") {
    baseConditions.push(eq(user.betaStatus, status as "waitlist" | "invited" | "active"));
  }

  // Search filter
  if (search) {
    baseConditions.push(
      or(
        ilike(user.email, `%${search}%`),
        ilike(user.name, `%${search}%`)
      )
    );
  }

  const whereClause = baseConditions.length > 0 ? and(...baseConditions) : undefined;

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(user)
    .where(whereClause);

  const total = totalResult?.count || 0;

  // Build order by
  let orderBy;
  switch (sortBy) {
    case "rank":
      orderBy = asc(user.waitlistRank);
      break;
    case "points":
      orderBy = desc(user.totalPoints);
      break;
    case "newest":
      orderBy = desc(user.createdAt);
      break;
    case "oldest":
      orderBy = asc(user.createdAt);
      break;
    default:
      orderBy = asc(user.waitlistRank);
  }

  // Fetch users with pagination
  const offset = (page - 1) * limit;
  
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      totalPoints: user.totalPoints,
      waitlistRank: user.waitlistRank,
      betaStatus: user.betaStatus,
      createdAt: user.createdAt,
      surveyCompletedAt: user.surveyCompletedAt,
      referralCode: user.referralCode,
    })
    .from(user)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get social connection status for these users
  const userIds = users.map((u) => u.id);

  const twitterConnectionsData = userIds.length > 0
    ? await db
        .select({
          userId: twitterConnections.userId,
          followsVibemodeai: twitterConnections.followsVibemodeai,
          followsGremlinlabs: twitterConnections.followsGremlinlabs,
          followsProductgremlin: twitterConnections.followsProductgremlin,
        })
        .from(twitterConnections)
        .where(sql`${twitterConnections.userId} IN ${userIds}`)
    : [];

  const discordConnectionsData = userIds.length > 0
    ? await db
        .select({
          userId: discordConnections.userId,
          hasJoinedServer: discordConnections.hasJoinedServer,
        })
        .from(discordConnections)
        .where(sql`${discordConnections.userId} IN ${userIds}`)
    : [];

  // Get referral counts
  const referralCounts = userIds.length > 0
    ? await db
        .select({
          referrerId: referrals.referrerId,
          total: count(),
          signups: sql<number>`COUNT(CASE WHEN ${referrals.signedUpAt} IS NOT NULL THEN 1 END)`,
        })
        .from(referrals)
        .where(sql`${referrals.referrerId} IN ${userIds}`)
        .groupBy(referrals.referrerId)
    : [];

  // Create lookup maps
  const twitterMap = new Map(twitterConnectionsData.map((t) => [t.userId, t]));
  const discordMap = new Map(discordConnectionsData.map((d) => [d.userId, d]));
  const referralMap = new Map(referralCounts.map((r) => [r.referrerId, r]));

  // Combine data
  const enrichedUsers = users.map((u) => {
    const twitter = twitterMap.get(u.id);
    const discord = discordMap.get(u.id);
    const refs = referralMap.get(u.id);

    return {
      ...u,
      twitter: twitter
        ? {
            connected: true,
            followsVibemodeai: twitter.followsVibemodeai,
            followsGremlinlabs: twitter.followsGremlinlabs,
            followsProductgremlin: twitter.followsProductgremlin,
          }
        : null,
      discord: discord
        ? {
            connected: true,
            hasJoinedServer: discord.hasJoinedServer,
          }
        : null,
      referrals: refs
        ? {
            total: refs.total,
            signups: refs.signups,
          }
        : { total: 0, signups: 0 },
    };
  });

  return NextResponse.json({
    users: enrichedUsers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
