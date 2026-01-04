import { rankingsQueue, socialRefreshQueue, cleanupQueue } from "./index";
import type { RankingJobData, SocialRefreshJobData, CleanupJobData } from "./index";

// Global state for scheduler (singleton pattern)
const globalForScheduler = globalThis as unknown as {
  schedulerInitialized: boolean;
};

/**
 * Schedule recurring jobs
 * Uses BullMQ's built-in repeatable jobs
 */
export async function initializeScheduler(): Promise<void> {
  if (globalForScheduler.schedulerInitialized) {
    console.log("📅 Scheduler already initialized, skipping...");
    return;
  }

  console.log("📅 Initializing job scheduler...");

  // Recalculate all ranks every 5 minutes
  await rankingsQueue().add(
    "recalculate-all",
    { type: "recalculate_all" } as RankingJobData,
    {
      repeat: {
        pattern: "*/5 * * * *", // Every 5 minutes
      },
      jobId: "scheduled-rank-recalculation",
    }
  );

  // Refresh Twitter follows every 6 hours
  await socialRefreshQueue().add(
    "refresh-twitter",
    { type: "twitter" } as SocialRefreshJobData,
    {
      repeat: {
        pattern: "0 */6 * * *", // Every 6 hours
      },
      jobId: "scheduled-twitter-refresh",
    }
  );

  // Refresh Discord membership every 6 hours
  await socialRefreshQueue().add(
    "refresh-discord",
    { type: "discord" } as SocialRefreshJobData,
    {
      repeat: {
        pattern: "30 */6 * * *", // Every 6 hours, offset by 30 min from Twitter
      },
      jobId: "scheduled-discord-refresh",
    }
  );

  // Clean up expired tokens daily at 3 AM
  await cleanupQueue().add(
    "cleanup-tokens",
    { type: "expired_tokens" } as CleanupJobData,
    {
      repeat: {
        pattern: "0 3 * * *", // Daily at 3 AM
      },
      jobId: "scheduled-token-cleanup",
    }
  );

  globalForScheduler.schedulerInitialized = true;
  console.log("✅ Job scheduler initialized with recurring jobs");
}

/**
 * Manually trigger a ranking recalculation
 */
export async function triggerRankRecalculation(): Promise<void> {
  await rankingsQueue().add(
    "manual-recalculate-all",
    { type: "recalculate_all" } as RankingJobData,
    {
      priority: 1, // High priority
    }
  );
}

/**
 * Trigger rank recalculation for a single user
 */
export async function triggerUserRankRecalculation(userId: string): Promise<void> {
  await rankingsQueue().add(
    `recalculate-user-${userId}`,
    { type: "recalculate_user", userId } as RankingJobData,
    {
      priority: 2,
    }
  );
}

/**
 * Manually trigger social refresh for all users
 */
export async function triggerSocialRefresh(type: "twitter" | "discord" | "all"): Promise<void> {
  await socialRefreshQueue().add(
    `manual-refresh-${type}`,
    { type } as SocialRefreshJobData,
    {
      priority: 1,
    }
  );
}

/**
 * Trigger social refresh for a single user
 */
export async function triggerUserSocialRefresh(
  userId: string,
  type: "twitter" | "discord" | "all"
): Promise<void> {
  await socialRefreshQueue().add(
    `refresh-user-${userId}-${type}`,
    { type, userId } as SocialRefreshJobData,
    {
      priority: 2,
    }
  );
}
