import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { discordGuildMemberships, discordGuildStats } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

/**
 * GET /api/admin/guilds
 * Get top Discord guilds by user count (for marketing outreach)
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userData = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, session.user.id),
      columns: { isAdmin: true },
    });

    if (!userData?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get top guilds by actual user count from memberships table
    const topGuilds = await db
      .select({
        guildId: discordGuildMemberships.guildId,
        guildName: discordGuildMemberships.guildName,
        guildIcon: discordGuildMemberships.guildIcon,
        userCount: sql<number>`count(distinct ${discordGuildMemberships.userId})`.as("user_count"),
        ownerCount: sql<number>`sum(case when ${discordGuildMemberships.isOwner} then 1 else 0 end)`.as("owner_count"),
      })
      .from(discordGuildMemberships)
      .groupBy(
        discordGuildMemberships.guildId,
        discordGuildMemberships.guildName,
        discordGuildMemberships.guildIcon
      )
      .orderBy(desc(sql`count(distinct ${discordGuildMemberships.userId})`))
      .limit(100);

    // Get total unique users with Discord connected
    const totalResult = await db
      .select({
        total: sql<number>`count(distinct ${discordGuildMemberships.userId})`,
      })
      .from(discordGuildMemberships);

    const totalUsers = totalResult[0]?.total || 0;

    // Format response with percentage
    const guildsWithStats = topGuilds.map((guild) => ({
      ...guild,
      iconUrl: guild.guildIcon
        ? `https://cdn.discordapp.com/icons/${guild.guildId}/${guild.guildIcon}.png`
        : null,
      percentage: totalUsers > 0 ? ((guild.userCount / totalUsers) * 100).toFixed(1) : "0",
    }));

    return NextResponse.json({
      guilds: guildsWithStats,
      totalUsersWithDiscord: totalUsers,
    });
  } catch (error) {
    console.error("Error fetching guild stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch guild stats" },
      { status: 500 }
    );
  }
}
