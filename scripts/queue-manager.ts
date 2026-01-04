#!/usr/bin/env bun
import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: path.resolve(__dirname, "../.env.local") });

import { Queue } from "bullmq";
import IORedis from "ioredis";

const QUEUE_NAMES = ["rankings", "social-refresh", "cleanup"];

async function main() {
  const command = process.argv[2];
  const queueName = process.argv[3];

  if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL not configured");
    process.exit(1);
  }

  const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  const getQueue = (name: string) =>
    new Queue(name, { connection });

  switch (command) {
    case "stats": {
      console.log("📊 Queue Statistics\n");
      for (const name of QUEUE_NAMES) {
        const queue = getQueue(name);
        const counts = await queue.getJobCounts();
        console.log(`  ${name}:`);
        console.log(`    Active: ${counts.active}`);
        console.log(`    Waiting: ${counts.waiting}`);
        console.log(`    Completed: ${counts.completed}`);
        console.log(`    Failed: ${counts.failed}`);
        console.log(`    Delayed: ${counts.delayed}`);
        console.log();
      }
      break;
    }

    case "clear": {
      if (!queueName || !QUEUE_NAMES.includes(queueName)) {
        console.error(`❌ Invalid queue. Choose from: ${QUEUE_NAMES.join(", ")}`);
        process.exit(1);
      }
      const queue = getQueue(queueName);
      await queue.obliterate({ force: true });
      console.log(`✅ Cleared queue: ${queueName}`);
      break;
    }

    case "clear-all": {
      for (const name of QUEUE_NAMES) {
        const queue = getQueue(name);
        await queue.obliterate({ force: true });
        console.log(`✅ Cleared queue: ${name}`);
      }
      break;
    }

    case "pause": {
      if (!queueName || !QUEUE_NAMES.includes(queueName)) {
        console.error(`❌ Invalid queue. Choose from: ${QUEUE_NAMES.join(", ")}`);
        process.exit(1);
      }
      const queue = getQueue(queueName);
      await queue.pause();
      console.log(`⏸️  Paused queue: ${queueName}`);
      break;
    }

    case "resume": {
      if (!queueName || !QUEUE_NAMES.includes(queueName)) {
        console.error(`❌ Invalid queue. Choose from: ${QUEUE_NAMES.join(", ")}`);
        process.exit(1);
      }
      const queue = getQueue(queueName);
      await queue.resume();
      console.log(`▶️  Resumed queue: ${queueName}`);
      break;
    }

    case "failed": {
      const targetQueues = queueName ? [queueName] : QUEUE_NAMES;
      console.log("❌ Failed Jobs\n");
      for (const name of targetQueues) {
        if (!QUEUE_NAMES.includes(name)) continue;
        const queue = getQueue(name);
        const failed = await queue.getFailed(0, 10);
        if (failed.length > 0) {
          console.log(`  ${name}:`);
          for (const job of failed) {
            console.log(`    - ${job.id}: ${job.failedReason}`);
          }
          console.log();
        }
      }
      break;
    }

    case "retry-failed": {
      if (!queueName || !QUEUE_NAMES.includes(queueName)) {
        console.error(`❌ Invalid queue. Choose from: ${QUEUE_NAMES.join(", ")}`);
        process.exit(1);
      }
      const queue = getQueue(queueName);
      const failed = await queue.getFailed();
      for (const job of failed) {
        await job.retry();
      }
      console.log(`🔄 Retried ${failed.length} failed jobs in ${queueName}`);
      break;
    }

    default:
      console.log(`
📦 Vibe Mode Queue Manager

Usage:
  bun scripts/queue-manager.ts <command> [queue]

Commands:
  stats                    Show statistics for all queues
  clear <queue>            Clear a specific queue
  clear-all                Clear all queues
  pause <queue>            Pause a queue
  resume <queue>           Resume a queue
  failed [queue]           List failed jobs (all queues if not specified)
  retry-failed <queue>     Retry all failed jobs in a queue

Queues:
  ${QUEUE_NAMES.join(", ")}
      `);
  }

  await connection.quit();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
