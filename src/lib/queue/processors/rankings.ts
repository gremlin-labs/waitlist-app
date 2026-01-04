import { Job } from "bullmq";
import { recalculateAllRanks, getUserRank } from "@/lib/points";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { RankingJobData } from "../index";

/**
 * Process ranking recalculation jobs
 */
export async function processRankingJob(job: Job<RankingJobData>) {
  const { type, userId } = job.data;

  console.log(`📊 Processing ranking job: ${type}${userId ? ` for user ${userId}` : ""}`);

  try {
    if (type === "recalculate_all") {
      await recalculateAllRanks();
      console.log("✅ All rankings recalculated");
      return { success: true, type: "all" };
    }

    if (type === "recalculate_user" && userId) {
      // Recalculate single user's rank
      const rank = await getUserRank(userId);
      
      if (rank) {
        await db
          .update(user)
          .set({ waitlistRank: rank })
          .where(eq(user.id, userId));
      }
      
      console.log(`✅ User ${userId} rank updated to #${rank}`);
      return { success: true, type: "user", userId, rank };
    }

    throw new Error(`Unknown ranking job type: ${type}`);
  } catch (error) {
    console.error(`❌ Ranking job failed:`, error);
    throw error; // Re-throw to trigger retry
  }
}
