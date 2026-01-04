import { Job } from "bullmq";
import { db } from "@/db";
import { appTokens } from "@/db/schema";
import { lt, eq, and } from "drizzle-orm";
import type { CleanupJobData } from "../index";

/**
 * Process cleanup jobs
 */
export async function processCleanupJob(job: Job<CleanupJobData>) {
  const { type } = job.data;

  console.log(`🧹 Processing cleanup job: ${type}`);

  try {
    if (type === "expired_tokens") {
      await cleanupExpiredTokens();
    }

    if (type === "old_referral_clicks") {
      // Future: clean up old referral click records that never converted
    }

    return { success: true, type };
  } catch (error) {
    console.error(`❌ Cleanup job failed:`, error);
    throw error;
  }
}

/**
 * Delete expired app tokens
 */
async function cleanupExpiredTokens() {
  const result = await db
    .delete(appTokens)
    .where(
      and(
        lt(appTokens.expiresAt, new Date()),
        eq(appTokens.isActive, true)
      )
    )
    .returning({ id: appTokens.id });

  console.log(`🗑️  Cleaned up ${result.length} expired tokens`);
  return result.length;
}
