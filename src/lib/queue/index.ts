import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

// Redis connection (singleton)
const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined;
};

export function getRedisConnection(): IORedis {
  if (!globalForRedis.redis) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    globalForRedis.redis = new IORedis(redisUrl, {
      maxRetriesPerRequest: null, // Required for BullMQ
    });
  }
  return globalForRedis.redis;
}

// Queue names
export const QUEUE_NAMES = {
  RANKINGS: "rankings",
  SOCIAL_REFRESH: "social-refresh",
  CLEANUP: "cleanup",
} as const;

// Create queues (lazy initialization)
const queues: Map<string, Queue> = new Map();

export function getQueue(name: string): Queue {
  if (!queues.has(name)) {
    queues.set(
      name,
      new Queue(name, {
        connection: getRedisConnection(),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 500, // Keep last 500 failed jobs
        },
      })
    );
  }
  return queues.get(name)!;
}

// Job types
export interface RankingJobData {
  type: "recalculate_all" | "recalculate_user";
  userId?: string;
}

export interface SocialRefreshJobData {
  type: "twitter" | "discord" | "all";
  userId?: string; // If specified, refresh only this user
}

export interface CleanupJobData {
  type: "expired_tokens" | "old_referral_clicks";
}

// Export queue getters
export const rankingsQueue = () => getQueue(QUEUE_NAMES.RANKINGS);
export const socialRefreshQueue = () => getQueue(QUEUE_NAMES.SOCIAL_REFRESH);
export const cleanupQueue = () => getQueue(QUEUE_NAMES.CLEANUP);
