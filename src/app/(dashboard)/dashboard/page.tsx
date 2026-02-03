import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  user as userTable,
  appTokens,
  twitterConnections,
  discordConnections,
  referrals,
} from "@/db/schema";
import { eq, and, count, isNotNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { WaitlistDashboard } from "./waitlist-dashboard";
import { BetaUserDashboard } from "./beta-user-dashboard";
import { getUserPoints, getUserRank } from "@/lib/points";
import { getDiscordInviteUrl } from "@/lib/discord";

async function getUserData(userId: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(userTable.id, userId),
  });

  if (!foundUser) return null;

  // Get total waitlist count
  const [totalWaitlistResult] = await db
    .select({ count: count() })
    .from(userTable)
    .where(eq(userTable.betaStatus, "waitlist"));

  return {
    ...foundUser,
    totalWaitlist: totalWaitlistResult?.count || 0,
  };
}

async function getUserDevices(userId: string) {
  const devices = await db.query.appTokens.findMany({
    where: and(eq(appTokens.userId, userId), eq(appTokens.isActive, true)),
    columns: {
      id: true,
      deviceName: true,
      deviceId: true,
      lastUsedAt: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: (appTokens, { desc }) => [desc(appTokens.lastUsedAt)],
  });

  return devices.map((d) => ({
    ...d,
    lastUsedAt: d.lastUsedAt?.toISOString() || null,
    createdAt: d.createdAt.toISOString(),
    expiresAt: d.expiresAt?.toISOString() || null,
  }));
}

async function getSocialConnections(userId: string) {
  const twitter = await db.query.twitterConnections.findFirst({
    where: eq(twitterConnections.userId, userId),
  });

  const discord = await db.query.discordConnections.findFirst({
    where: eq(discordConnections.userId, userId),
  });

  return {
    twitter: twitter
      ? {
          connected: true,
          username: twitter.twitterUsername,
          followsAccount1: twitter.followsAccount1 ?? false,
          followsAccount2: twitter.followsAccount2 ?? false,
          followsProductgremlin: twitter.followsProductgremlin ?? false,
        }
      : null,
    discord: discord
      ? {
          connected: true,
          username: discord.discordUsername,
          hasJoinedServer: discord.hasJoinedServer ?? false,
        }
      : null,
  };
}

async function getReferralStats(userId: string) {
  // Total clicks (referral records)
  const [clicksResult] = await db
    .select({ count: count() })
    .from(referrals)
    .where(eq(referrals.referrerId, userId));

  // Signups (referrals with signedUpAt)
  const [signupsResult] = await db
    .select({ count: count() })
    .from(referrals)
    .where(and(eq(referrals.referrerId, userId), isNotNull(referrals.signedUpAt)));

  return {
    clicks: clicksResult?.count || 0,
    signups: signupsResult?.count || 0,
  };
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect("/auth/signin");
  }

  // Require survey completion before accessing dashboard
  if (!userData.surveyCompletedAt) {
    redirect("/onboarding");
  }

  // Active beta users see the full dashboard
  if (userData.betaStatus === "active") {
    const devices = await getUserDevices(session.user.id);

    return (
      <BetaUserDashboard
        user={{
          id: userData.id,
          name: userData.name || "Vibe Seeker",
          email: userData.email,
        }}
        devices={devices}
      />
    );
  }

  // Waitlist users see the gamified waitlist view
  const [points, rank, social, referralStats] = await Promise.all([
    getUserPoints(session.user.id),
    getUserRank(session.user.id),
    getSocialConnections(session.user.id),
    getReferralStats(session.user.id),
  ]);

  return (
    <WaitlistDashboard
      user={{
        id: userData.id,
        name: userData.name || "Vibe Seeker",
        email: userData.email,
        referralCode: userData.referralCode || "VIBES",
        surveyCompleted: !!userData.surveyCompletedAt,
      }}
      rank={rank}
      totalPoints={points.total}
      totalWaitlist={userData.totalWaitlist}
      pointsBreakdown={points.breakdown}
      twitter={social.twitter}
      discord={social.discord}
      referralCount={referralStats.clicks}
      referralSignups={referralStats.signups}
      discordInviteUrl={getDiscordInviteUrl()}
    />
  );
}
