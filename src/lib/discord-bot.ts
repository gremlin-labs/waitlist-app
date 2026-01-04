import { Client, GatewayIntentBits, Events, EmbedBuilder } from "discord.js";

const VIBEMODE_GUILD_ID = process.env.DISCORD_GUILD_ID!;
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const BOT_API_SECRET = process.env.BOT_API_SECRET!;

let client: Client | null = null;
let isRunning = false;

/**
 * Start the Discord bot
 * Only runs once even if called multiple times (singleton pattern)
 */
export async function startDiscordBot() {
  // Skip if already running or missing config
  if (isRunning || client) {
    return;
  }

  if (!process.env.DISCORD_BOT_TOKEN) {
    console.log("⚠️  DISCORD_BOT_TOKEN not set, Discord bot disabled");
    return;
  }

  if (!BOT_API_SECRET) {
    console.log("⚠️  BOT_API_SECRET not set, Discord bot disabled");
    return;
  }

  isRunning = true;

  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  // Bot ready event
  client.once(Events.ClientReady, (c) => {
    console.log(`🌊 Discord Bot ready as ${c.user.tag}`);
    console.log(`📡 Connected to ${c.guilds.cache.size} guild(s)`);
  });

  // Member join event
  client.on(Events.GuildMemberAdd, async (member) => {
    if (VIBEMODE_GUILD_ID && member.guild.id !== VIBEMODE_GUILD_ID) return;

    console.log(`✅ Discord: ${member.user.username} joined`);

    try {
      await fetch(`${API_BASE_URL}/api/webhooks/discord/member-joined`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BOT_API_SECRET}`,
        },
        body: JSON.stringify({
          discordId: member.user.id,
          discordUsername: member.user.username,
          joinedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to notify API of member join:", error);
    }
  });

  // Member leave event
  client.on(Events.GuildMemberRemove, async (member) => {
    if (VIBEMODE_GUILD_ID && member.guild.id !== VIBEMODE_GUILD_ID) return;

    console.log(`❌ Discord: ${member.user.username} left`);

    try {
      await fetch(`${API_BASE_URL}/api/webhooks/discord/member-left`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BOT_API_SECRET}`,
        },
        body: JSON.stringify({
          discordId: member.user.id,
          leftAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to notify API of member leave:", error);
    }
  });

  // Slash command handler
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // /verify command
    if (interaction.commandName === "verify") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/webhooks/discord/check-link`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BOT_API_SECRET}`,
            },
            body: JSON.stringify({ discordId: interaction.user.id }),
          }
        );

        const data = await response.json();

        if (data.linked) {
          const embed = new EmbedBuilder()
            .setColor(0xff2d7a)
            .setTitle("✅ Account Linked!")
            .setDescription("Your Discord is connected to Vibe Mode")
            .addFields(
              { name: "Total Points", value: `**${data.totalPoints}**`, inline: true },
              { name: "Waitlist Rank", value: `**#${data.rank}**`, inline: true }
            )
            .setFooter({ text: "Keep vibing! 🌊" });

          await interaction.editReply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor(0xffaa00)
            .setTitle("🔗 Not Linked Yet")
            .setDescription(
              "Your Discord isn't connected to Vibe Mode yet!\n\n" +
              "Visit **https://vibemode.ai/dashboard** to connect and earn **+25 bonus points**."
            )
            .setFooter({ text: "The vibes await! 😈" });

          await interaction.editReply({ embeds: [embed] });
        }
      } catch (error) {
        console.error("Verify command error:", error);
        await interaction.editReply({
          content: "❌ Something went wrong. Please try again later.",
        });
      }
    }

    // /leaderboard command
    if (interaction.commandName === "leaderboard") {
      await interaction.deferReply();

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/webhooks/discord/leaderboard`,
          {
            headers: { Authorization: `Bearer ${BOT_API_SECRET}` },
          }
        );

        const data = await response.json();

        if (!data.top10 || data.top10.length === 0) {
          await interaction.editReply({
            content: "📊 No one on the leaderboard yet. Be the first!",
          });
          return;
        }

        const leaderboardLines = data.top10.map((user: any, i: number) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
          return `${medal} **${user.name}** — ${user.totalPoints} pts`;
        });

        const embed = new EmbedBuilder()
          .setColor(0xff2d7a)
          .setTitle("🏆 Vibe Mode Waitlist Leaderboard")
          .setDescription(leaderboardLines.join("\n"))
          .addFields({
            name: "How to earn points",
            value:
              "• Connect Twitter (+5) & follow us (+30)\n" +
              "• Connect Discord (+5) & stay in server (+20)\n" +
              "• Complete survey (+15)\n" +
              "• Invite friends (unlimited!)",
          })
          .setFooter({ text: "vibemode.ai" });

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error("Leaderboard command error:", error);
        await interaction.editReply({
          content: "❌ Failed to fetch leaderboard.",
        });
      }
    }

    // /rank command
    if (interaction.commandName === "rank") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/webhooks/discord/check-link`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BOT_API_SECRET}`,
            },
            body: JSON.stringify({ discordId: interaction.user.id }),
          }
        );

        const data = await response.json();

        if (data.linked) {
          const embed = new EmbedBuilder()
            .setColor(0xff2d7a)
            .setTitle("📊 Your Waitlist Stats")
            .addFields(
              { name: "Rank", value: `#${data.rank}`, inline: true },
              { name: "Points", value: `${data.totalPoints}`, inline: true },
              { name: "Referrals", value: `${data.referralCount || 0}`, inline: true }
            )
            .setDescription(
              data.rank <= 10
                ? "🔥 You're in the top 10!"
                : data.rank <= 50
                  ? "⚡ Keep climbing!"
                  : "🌊 Keep vibing!"
            );

          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply({
            content: "🔗 Link your account at **https://vibemode.ai/dashboard**",
          });
        }
      } catch (error) {
        console.error("Rank command error:", error);
        await interaction.editReply({ content: "❌ Something went wrong." });
      }
    }

    // /invite command
    if (interaction.commandName === "invite") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/webhooks/discord/check-link`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${BOT_API_SECRET}`,
            },
            body: JSON.stringify({ discordId: interaction.user.id }),
          }
        );

        const data = await response.json();

        if (data.linked && data.referralCode) {
          const embed = new EmbedBuilder()
            .setColor(0xff2d7a)
            .setTitle("🎁 Your Referral Link")
            .setDescription(
              `**https://vibemode.ai?ref=${data.referralCode}**\n\n` +
              "• Click: +1 pt (max 100)\n• Signup: +5 pts\n• Activated: +10 pts"
            )
            .addFields({
              name: "Your Stats",
              value: `Referrals: **${data.referralCount || 0}** | Points: **${data.totalPoints}**`,
            });

          await interaction.editReply({ embeds: [embed] });
        } else {
          await interaction.editReply({
            content: "🔗 Link your account first at **https://vibemode.ai/dashboard**",
          });
        }
      } catch (error) {
        console.error("Invite command error:", error);
        await interaction.editReply({ content: "❌ Something went wrong." });
      }
    }
  });

  // Login
  try {
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error("❌ Failed to start Discord bot:", error);
    isRunning = false;
    client = null;
  }
}

/**
 * Stop the Discord bot gracefully
 */
export async function stopDiscordBot() {
  if (client) {
    await client.destroy();
    client = null;
    isRunning = false;
    console.log("🛑 Discord bot stopped");
  }
}
