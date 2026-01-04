import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  user,
  twitterConnections,
  discordConnections,
  referrals,
  betaSurveys,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserPoints } from "@/lib/points";

/**
 * GET /api/admin/waitlist/[id] - Get detailed user info with full points breakdown
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Get user
  const targetUser = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get social connections
  const twitter = await db.query.twitterConnections.findFirst({
    where: eq(twitterConnections.userId, id),
  });

  const discord = await db.query.discordConnections.findFirst({
    where: eq(discordConnections.userId, id),
  });

  // Get points breakdown
  const points = await getUserPoints(id);

  // Get referrals made by this user
  const userReferrals = await db.query.referrals.findMany({
    where: eq(referrals.referrerId, id),
    orderBy: (referrals, { desc }) => [desc(referrals.clickedAt)],
  });

  // Get survey
  const survey = await db.query.betaSurveys.findFirst({
    where: eq(betaSurveys.userId, id),
  });

  return NextResponse.json({
    user: {
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      totalPoints: targetUser.totalPoints,
      waitlistRank: targetUser.waitlistRank,
      betaStatus: targetUser.betaStatus,
      referralCode: targetUser.referralCode,
      referredByCode: targetUser.referredByCode,
      createdAt: targetUser.createdAt,
      surveyCompletedAt: targetUser.surveyCompletedAt,
    },
    twitter: twitter
      ? {
          username: twitter.twitterUsername,
          twitterId: twitter.twitterId,
          connected: true,
          followsVibemodeai: twitter.followsVibemodeai,
          followsGremlinlabs: twitter.followsGremlinlabs,
          followsProductgremlin: twitter.followsProductgremlin,
          connectedAt: twitter.connectedAt,
          lastChecked: twitter.followsLastChecked,
        }
      : null,
    discord: discord
      ? {
          username: discord.discordUsername,
          discordId: discord.discordId,
          connected: true,
          hasJoinedServer: discord.hasJoinedServer,
          connectedAt: discord.connectedAt,
          lastVerified: discord.serverLastVerified,
        }
      : null,
    points,
    referrals: {
      total: userReferrals.length,
      signups: userReferrals.filter((r) => r.signedUpAt).length,
      activated: userReferrals.filter((r) => r.activatedAt).length,
      list: userReferrals.slice(0, 10).map((r) => ({
        id: r.id,
        refereeId: r.refereeId,
        refereeEmail: r.refereeEmail,
        clickedAt: r.clickedAt,
        signedUpAt: r.signedUpAt,
        activatedAt: r.activatedAt,
      })),
    },
    survey: survey
      ? {
          primaryTool: survey.primaryTool,
          vibeCodeExperience: survey.vibeCodeExperience,
          yearsExperience: survey.yearsExperience,
          excitedAbout: survey.excitedAbout,
          completedAt: survey.completedAt,
        }
      : null,
  });
}
