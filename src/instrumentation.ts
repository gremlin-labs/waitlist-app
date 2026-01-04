/**
 * Next.js Instrumentation
 * This file runs once when the Next.js server starts
 * Used to initialize long-running services like the Discord bot and BullMQ workers
 */

export async function register() {
  // Only run on the server (not during build or in edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import to avoid issues during build
    const { startDiscordBot } = await import("@/lib/discord-bot");
    const { initializeWorkers } = await import("@/lib/queue/workers");
    const { initializeScheduler } = await import("@/lib/queue/scheduler");

    // Start the Discord bot
    await startDiscordBot();

    // Initialize BullMQ workers and scheduler
    // Only if Redis is configured
    if (process.env.REDIS_URL) {
      initializeWorkers();
      await initializeScheduler();
    } else {
      console.log("⚠️ REDIS_URL not configured, background workers disabled");
    }
  }
}
