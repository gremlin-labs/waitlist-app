import { Worker } from "bullmq";
import { getRedisConnection, QUEUE_NAMES } from "./index";
import { processRankingJob } from "./processors/rankings";
import { processSocialRefreshJob } from "./processors/social-refresh";
import { processCleanupJob } from "./processors/cleanup";

// Global state for workers (singleton pattern)
const globalForWorkers = globalThis as unknown as {
  workersInitialized: boolean;
  workers: Worker[];
};

/**
 * Initialize all BullMQ workers
 * Should only be called once at startup
 */
export function initializeWorkers(): void {
  if (globalForWorkers.workersInitialized) {
    console.log("🔄 Workers already initialized, skipping...");
    return;
  }

  console.log("🚀 Initializing BullMQ workers...");

  const connection = getRedisConnection();
  const workers: Worker[] = [];

  // Rankings worker
  const rankingsWorker = new Worker(
    QUEUE_NAMES.RANKINGS,
    processRankingJob,
    {
      connection,
      concurrency: 1, // Only process one at a time to avoid race conditions
    }
  );

  rankingsWorker.on("completed", (job) => {
    console.log(`📊 Rankings job ${job.id} completed`);
  });

  rankingsWorker.on("failed", (job, err) => {
    console.error(`📊 Rankings job ${job?.id} failed:`, err.message);
  });

  workers.push(rankingsWorker);

  // Social refresh worker
  const socialWorker = new Worker(
    QUEUE_NAMES.SOCIAL_REFRESH,
    processSocialRefreshJob,
    {
      connection,
      concurrency: 2, // Can process multiple users in parallel
    }
  );

  socialWorker.on("completed", (job) => {
    console.log(`🔄 Social refresh job ${job.id} completed`);
  });

  socialWorker.on("failed", (job, err) => {
    console.error(`🔄 Social refresh job ${job?.id} failed:`, err.message);
  });

  workers.push(socialWorker);

  // Cleanup worker
  const cleanupWorker = new Worker(
    QUEUE_NAMES.CLEANUP,
    processCleanupJob,
    {
      connection,
      concurrency: 1,
    }
  );

  cleanupWorker.on("completed", (job) => {
    console.log(`🧹 Cleanup job ${job.id} completed`);
  });

  cleanupWorker.on("failed", (job, err) => {
    console.error(`🧹 Cleanup job ${job?.id} failed:`, err.message);
  });

  workers.push(cleanupWorker);

  globalForWorkers.workers = workers;
  globalForWorkers.workersInitialized = true;

  console.log(`✅ ${workers.length} BullMQ workers initialized`);
}

/**
 * Graceful shutdown of all workers
 */
export async function shutdownWorkers(): Promise<void> {
  if (!globalForWorkers.workers) return;

  console.log("🛑 Shutting down BullMQ workers...");

  await Promise.all(
    globalForWorkers.workers.map((worker) => worker.close())
  );

  console.log("✅ All workers shut down");
}
