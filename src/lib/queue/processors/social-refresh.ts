import { Job } from "bullmq";
import { db } from "@/db";
import { twitterConnections, discordConnections } from "@/db/schema";
import { eq, lt, or, isNull } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/crypto";
import { checkTwitterFollows, refreshTwitterToken } from "@/lib/twitter";
import { checkDiscordServerMembership, refreshDiscordToken } from "@/lib/discord";
import { awardPoints } from "@/lib/points";
import type { SocialRefreshJobData } from "../index";

// Only refresh connections that haven't been checked in the last 4 hours
const REFRESH_THRESHOLD_MS = 4 * 60 * 60 * 1000;

/**
 * Process social connection refresh jobs
 */
export async function processSocialRefreshJob(job: Job<SocialRefreshJobData>) {
  const { type, userId } = job.data;

  console.log(`🔄 Processing social refresh: ${type}${userId ? ` for user ${userId}` : ""}`);

  try {
    if (type === "twitter" || type === "all") {
      await refreshTwitterConnections(userId);
    }

    if (type === "discord" || type === "all") {
      await refreshDiscordConnections(userId);
    }

    return { success: true, type };
  } catch (error) {
    console.error(`❌ Social refresh job failed:`, error);
    throw error;
  }
}

/**
 * Refresh Twitter follow status for all (or one) user
 */
async function refreshTwitterConnections(userId?: string) {
  const threshold = new Date(Date.now() - REFRESH_THRESHOLD_MS);

  // Get connections that need refreshing
  const connections = await db.query.twitterConnections.findMany({
    where: userId
      ? eq(twitterConnections.userId, userId)
      : or(
          isNull(twitterConnections.followsLastChecked),
          lt(twitterConnections.followsLastChecked, threshold)
        ),
    limit: 50, // Process in batches
  });

  console.log(`🐦 Refreshing ${connections.length} Twitter connections`);

  for (const connection of connections) {
    try {
      // Refresh token if needed
      let accessToken = decrypt(connection.accessToken);

      if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
        if (!connection.refreshToken) {
          console.warn(`Twitter token expired for user ${connection.userId}, no refresh token`);
          continue;
        }

        const newTokens = await refreshTwitterToken(decrypt(connection.refreshToken));
        accessToken = newTokens.access_token;

        await db
          .update(twitterConnections)
          .set({
            accessToken: encrypt(newTokens.access_token),
            refreshToken: newTokens.refresh_token
              ? encrypt(newTokens.refresh_token)
              : connection.refreshToken,
            tokenExpiresAt: newTokens.expires_in
              ? new Date(Date.now() + newTokens.expires_in * 1000)
              : null,
          })
          .where(eq(twitterConnections.userId, connection.userId));
      }

      // Check follows
      const follows = await checkTwitterFollows(accessToken, connection.twitterId);

      // Award/deduct points for changes
      if (follows.followsAccount1 !== connection.followsAccount1) {
        await awardPoints(
          connection.userId,
          follows.followsAccount1 ? "twitter_follow_account1" : "twitter_unfollow_account1"
        );
      }
      if (follows.followsAccount2 !== connection.followsAccount2) {
        await awardPoints(
          connection.userId,
          follows.followsAccount2 ? "twitter_follow_account2" : "twitter_unfollow_account2"
        );
      }
      if (follows.followsProductgremlin !== connection.followsProductgremlin) {
        await awardPoints(
          connection.userId,
          follows.followsProductgremlin ? "twitter_follow_account3" : "twitter_unfollow_productgremlin"
        );
      }

      // Update connection
      await db
        .update(twitterConnections)
        .set({
          followsAccount1: follows.followsAccount1,
          followsAccount2: follows.followsAccount2,
          followsProductgremlin: follows.followsProductgremlin,
          followsLastChecked: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(twitterConnections.userId, connection.userId));

    } catch (error) {
      console.error(`Failed to refresh Twitter for user ${connection.userId}:`, error);
      // Continue with other users
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 100));
  }
}

/**
 * Refresh Discord server membership for all (or one) user
 */
async function refreshDiscordConnections(userId?: string) {
  const threshold = new Date(Date.now() - REFRESH_THRESHOLD_MS);

  // Get connections that need refreshing
  const connections = await db.query.discordConnections.findMany({
    where: userId
      ? eq(discordConnections.userId, userId)
      : or(
          isNull(discordConnections.serverLastVerified),
          lt(discordConnections.serverLastVerified, threshold)
        ),
    limit: 50,
  });

  console.log(`🎮 Refreshing ${connections.length} Discord connections`);

  for (const connection of connections) {
    try {
      // Refresh token if needed
      let accessToken = decrypt(connection.accessToken);

      if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
        const newTokens = await refreshDiscordToken(decrypt(connection.refreshToken));
        accessToken = newTokens.access_token;

        await db
          .update(discordConnections)
          .set({
            accessToken: encrypt(newTokens.access_token),
            refreshToken: encrypt(newTokens.refresh_token),
            tokenExpiresAt: newTokens.expires_in
              ? new Date(Date.now() + newTokens.expires_in * 1000)
              : null,
          })
          .where(eq(discordConnections.userId, connection.userId));
      }

      // Check server membership
      const hasJoinedServer = await checkDiscordServerMembership(accessToken);

      // Award/deduct points for changes
      if (hasJoinedServer !== connection.hasJoinedServer) {
        await awardPoints(
          connection.userId,
          hasJoinedServer ? "discord_join_server" : "discord_leave_server"
        );
      }

      // Update connection
      await db
        .update(discordConnections)
        .set({
          hasJoinedServer,
          serverLastVerified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(discordConnections.userId, connection.userId));

    } catch (error) {
      console.error(`Failed to refresh Discord for user ${connection.userId}:`, error);
    }

    await new Promise((r) => setTimeout(r, 100));
  }
}
