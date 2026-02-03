#!/usr/bin/env bun
/**
 * Register Discord slash commands
 * Run with: bun run discord:register
 */

import { config } from "dotenv";
import path from "path";

// Load .env.local
config({ path: path.resolve(__dirname, "../.env.local") });

import { REST, Routes, SlashCommandBuilder } from "discord.js";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CLIENT_ID) {
  console.error("❌ DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID are required");
  console.log("\nMake sure these are set in .env.local");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Check if your Discord is linked to Amazing App"),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 on the Amazing App waitlist"),

  new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your current waitlist rank and points"),

  new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get your personal referral link to earn points"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

async function registerCommands() {
  try {
    console.log("🔄 Registering Discord slash commands...\n");

    if (DISCORD_GUILD_ID) {
      // Register to specific guild (instant, good for development)
      await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Registered ${commands.length} commands to guild ${DISCORD_GUILD_ID}`);
    } else {
      // Register globally (can take up to 1 hour to propagate)
      await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
        body: commands,
      });
      console.log(`✅ Registered ${commands.length} commands globally`);
      console.log("   (Global commands may take up to 1 hour to appear)");
    }

    console.log("\n📝 Commands registered:");
    commands.forEach((cmd: any) => {
      console.log(`   /${cmd.name} - ${cmd.description}`);
    });
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
    process.exit(1);
  }
}

registerCommands();
