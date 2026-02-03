import { db } from "@/db";
import {
  pointsLedger,
  user,
  waitlistRankings,
  referrals,
  type PointAction,
} from "@/db/schema";
import { eq, sql, desc, asc, and, or, count, gt, lt } from "drizzle-orm";

// Lazy import to avoid circular dependencies
let triggerUserRankRecalculation: ((userId: string) => Promise<void>) | null = null;

async function getTriggerFn() {
  if (!triggerUserRankRecalculation && process.env.REDIS_URL) {
    try {
      const scheduler = await import("@/lib/queue/scheduler");
      triggerUserRankRecalculation = scheduler.triggerUserRankRecalculation;
    } catch {
      // Redis not available, skip
    }
  }
  return triggerUserRankRecalculation;
}

/**
 * Points configuration
 */
export const POINTS_CONFIG = {
  // Twitter
  twitter_connect: 5,
  twitter_follow_account1: 10,
  twitter_follow_account2: 10,
  twitter_follow_account3: 10,
  twitter_unfollow_account1: -10,
  twitter_unfollow_account2: -10,
  twitter_unfollow_account3: -10,
  
  // Discord
  discord_connect: 5,
  discord_join_server: 20,
  discord_leave_server: -20,
  
  // Referrals
  referral_click: 1,
  referral_signup: 5,
  referral_activated: 10,
  
  // Engagement
  survey_completed: 15,
} as const;

// Max points for referral clicks (to prevent gaming)
const MAX_REFERRAL_CLICK_POINTS = 100;

/**
 * Award or deduct points for a user
 * Creates an entry in the points ledger and updates user's total
 */
export async function awardPoints(
  userId: string,
  action: PointAction,
  points?: number,
  referenceId?: string,
  note?: string
): Promise<void> {
  // Use configured points if not specified
  const pointsToAward = points ?? POINTS_CONFIG[action as keyof typeof POINTS_CONFIG] ?? 0;

  // Check for referral click cap
  if (action === "referral_click") {
    const [existingClicks] = await db
      .select({ total: sql<number>`COALESCE(SUM(${pointsLedger.points}), 0)` })
      .from(pointsLedger)
      .where(and(
        eq(pointsLedger.userId, userId),
        eq(pointsLedger.action, "referral_click")
      ));

    if ((existingClicks?.total || 0) >= MAX_REFERRAL_CLICK_POINTS) {
      // Cap reached, don't award more click points
      return;
    }
  }

  // Insert ledger entry
  await db.insert(pointsLedger).values({
    userId,
    points: pointsToAward,
    action,
    referenceId,
    note,
  });

  // Update user's total points (denormalized for fast queries)
  await db
    .update(user)
    .set({
      totalPoints: sql`COALESCE(${user.totalPoints}, 0) + ${pointsToAward}`,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));

  // Optionally trigger rank recalculation if Redis is available
  const trigger = await getTriggerFn();
  if (trigger) {
    // Fire and forget - don't block the response
    trigger(userId).catch((err) => {
      console.warn("Failed to queue rank recalculation:", err.message);
    });
  }
}

/**
 * Get a user's points breakdown and history
 */
export async function getUserPoints(userId: string) {
  const ledger = await db.query.pointsLedger.findMany({
    where: eq(pointsLedger.userId, userId),
    orderBy: desc(pointsLedger.createdAt),
  });

  const breakdown = {
    twitter: 0,
    discord: 0,
    referrals: 0,
    survey: 0,
    bonus: 0,
  };

  for (const entry of ledger) {
    if (entry.action.startsWith("twitter_")) {
      breakdown.twitter += entry.points;
    } else if (entry.action.startsWith("discord_")) {
      breakdown.discord += entry.points;
    } else if (entry.action.startsWith("referral_")) {
      breakdown.referrals += entry.points;
    } else if (entry.action === "survey_completed") {
      breakdown.survey += entry.points;
    } else {
      breakdown.bonus += entry.points;
    }
  }

  return {
    total: Object.values(breakdown).reduce((a, b) => a + b, 0),
    breakdown,
    history: ledger,
  };
}

/**
 * Get a user's waitlist rank
 * Returns position based on points (higher = better) with signup time as tiebreaker
 */
export async function getUserRank(userId: string): Promise<number | null> {
  const targetUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { totalPoints: true, createdAt: true, betaStatus: true },
  });

  if (!targetUser) return null;

  // Only calculate rank for waitlist users
  if (targetUser.betaStatus !== "waitlist") return null;

  const userPoints = targetUser.totalPoints ?? 0;

  // Count users with more points, or same points but earlier signup
  const [result] = await db
    .select({ count: count() })
    .from(user)
    .where(
      and(
        eq(user.betaStatus, "waitlist"),
        or(
          gt(user.totalPoints, userPoints),
          and(
            eq(user.totalPoints, userPoints),
            lt(user.createdAt, targetUser.createdAt)
          )
        )
      )
    );

  return (result?.count ?? 0) + 1;
}

/**
 * Recalculate and cache all waitlist rankings
 * Should be run periodically via cron job
 */
export async function recalculateAllRanks(): Promise<void> {
  // Get all waitlist users sorted by points (desc), then signup time (asc)
  const waitlistUsers = await db.query.user.findMany({
    where: eq(user.betaStatus, "waitlist"),
    orderBy: [desc(user.totalPoints), asc(user.createdAt)],
    columns: { id: true, totalPoints: true },
  });

  // Get referral stats for each user
  const referralStats = await db
    .select({
      referrerId: referrals.referrerId,
      total: count(),
      signups: sql<number>`COUNT(CASE WHEN ${referrals.signedUpAt} IS NOT NULL THEN 1 END)`,
    })
    .from(referrals)
    .groupBy(referrals.referrerId);

  const referralMap = new Map(
    referralStats.map((r) => [r.referrerId, { total: r.total, signups: r.signups }])
  );

  // Get points breakdown for each user
  const pointsBreakdown = await db
    .select({
      userId: pointsLedger.userId,
      action: pointsLedger.action,
      total: sql<number>`SUM(${pointsLedger.points})`,
    })
    .from(pointsLedger)
    .groupBy(pointsLedger.userId, pointsLedger.action);

  const breakdownMap = new Map<string, Record<string, number>>();
  for (const entry of pointsBreakdown) {
    if (!breakdownMap.has(entry.userId)) {
      breakdownMap.set(entry.userId, {});
    }
    breakdownMap.get(entry.userId)![entry.action] = entry.total;
  }

  // Upsert rankings for each user
  for (let i = 0; i < waitlistUsers.length; i++) {
    const u = waitlistUsers[i];
    const breakdown = breakdownMap.get(u.id) || {};
    const refStats = referralMap.get(u.id) || { total: 0, signups: 0 };

    // Calculate category totals
    const twitterPoints = Object.entries(breakdown)
      .filter(([k]) => k.startsWith("twitter_"))
      .reduce((sum, [, v]) => sum + v, 0);

    const discordPoints = Object.entries(breakdown)
      .filter(([k]) => k.startsWith("discord_"))
      .reduce((sum, [, v]) => sum + v, 0);

    const referralPoints = Object.entries(breakdown)
      .filter(([k]) => k.startsWith("referral_"))
      .reduce((sum, [, v]) => sum + v, 0);

    const surveyPoints = breakdown.survey_completed || 0;

    const bonusPoints = Object.entries(breakdown)
      .filter(
        ([k]) =>
          !k.startsWith("twitter_") &&
          !k.startsWith("discord_") &&
          !k.startsWith("referral_") &&
          k !== "survey_completed"
      )
      .reduce((sum, [, v]) => sum + v, 0);

    await db
      .insert(waitlistRankings)
      .values({
        userId: u.id,
        rank: i + 1,
        totalPoints: u.totalPoints ?? 0,
        twitterPoints,
        discordPoints,
        referralPoints,
        surveyPoints,
        bonusPoints,
        referralCount: refStats.total,
        referralSignups: refStats.signups,
        calculatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: waitlistRankings.userId,
        set: {
          rank: i + 1,
          totalPoints: u.totalPoints ?? 0,
          twitterPoints,
          discordPoints,
          referralPoints,
          surveyPoints,
          bonusPoints,
          referralCount: refStats.total,
          referralSignups: refStats.signups,
          calculatedAt: new Date(),
        },
      });

    // Also update user's cached rank
    await db
      .update(user)
      .set({ waitlistRank: i + 1 })
      .where(eq(user.id, u.id));
  }
}

/**
 * Get the top N users on the waitlist leaderboard
 */
export async function getLeaderboard(limit = 10) {
  return db.query.waitlistRankings.findMany({
    orderBy: asc(waitlistRankings.rank),
    limit,
  });
}
