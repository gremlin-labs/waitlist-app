import Link from "next/link";
import { db } from "@/db";
import { user, twitterConnections, discordConnections, referrals } from "@/db/schema";
import { count, eq, isNotNull, gte, desc } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, BarChart3, Mail, ArrowRight, Trophy, Twitter, MessageCircle, Share2 } from "lucide-react";

async function getQuickStats() {
  const [totalUsers] = await db.select({ count: count() }).from(user);
  const [waitlistUsers] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.betaStatus, "waitlist"));
  const [activeUsers] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.betaStatus, "active"));
  const [surveyCompleted] = await db
    .select({ count: count() })
    .from(user)
    .where(isNotNull(user.surveyCompletedAt));

  // Last 24h signups
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [recentSignups] = await db
    .select({ count: count() })
    .from(user)
    .where(gte(user.createdAt, yesterday));

  // Gamification stats
  const [twitterConnected] = await db.select({ count: count() }).from(twitterConnections);
  const [discordConnected] = await db.select({ count: count() }).from(discordConnections);
  const [discordInServer] = await db
    .select({ count: count() })
    .from(discordConnections)
    .where(eq(discordConnections.hasJoinedServer, true));
  const [totalReferrals] = await db.select({ count: count() }).from(referrals);
  const [referralSignups] = await db
    .select({ count: count() })
    .from(referrals)
    .where(isNotNull(referrals.signedUpAt));

  return {
    total: totalUsers.count,
    waitlist: waitlistUsers.count,
    active: activeUsers.count,
    surveyCompleted: surveyCompleted.count,
    last24h: recentSignups.count,
    twitterConnected: twitterConnected.count,
    discordConnected: discordConnected.count,
    discordInServer: discordInServer.count,
    totalReferrals: totalReferrals.count,
    referralSignups: referralSignups.count,
  };
}

async function getTopWaitlist() {
  return db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      totalPoints: user.totalPoints,
      waitlistRank: user.waitlistRank,
    })
    .from(user)
    .where(eq(user.betaStatus, "waitlist"))
    .orderBy(desc(user.totalPoints))
    .limit(5);
}

async function getRecentUsers() {
  return db.query.user.findMany({
    limit: 5,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
    columns: {
      id: true,
      email: true,
      name: true,
      betaStatus: true,
      createdAt: true,
    },
  });
}

export default async function AdminDashboard() {
  const stats = await getQuickStats();
  const recentUsers = await getRecentUsers();
  const topWaitlist = await getTopWaitlist();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-fg-primary">Dashboard</h1>
        <p className="text-fg-muted mt-1">Overview of user activity and growth</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Total Users</CardTitle>
            <Users className="h-4 w-4 text-fg-dim" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              +{stats.last24h} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Waitlist</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow">{stats.waitlist.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              Waiting for invite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Active Beta</CardTitle>
            <BarChart3 className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green">{stats.active.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              Using Vibe Mode
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Survey Rate</CardTitle>
            <Mail className="h-4 w-4 text-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan">
              {stats.total > 0
                ? ((stats.surveyCompleted / stats.total) * 100).toFixed(0)
                : 0}%
            </div>
            <p className="text-xs text-fg-dim mt-1">
              {stats.surveyCompleted} surveys completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Twitter Connected</CardTitle>
            <Twitter className="h-4 w-4 text-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">{stats.twitterConnected.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              {stats.total > 0
                ? ((stats.twitterConnected / stats.total) * 100).toFixed(0)
                : 0}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Discord Server</CardTitle>
            <MessageCircle className="h-4 w-4 text-violet" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">{stats.discordInServer.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              {stats.discordConnected} connected total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Referral Clicks</CardTitle>
            <Share2 className="h-4 w-4 text-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">{stats.totalReferrals.toLocaleString()}</div>
            <p className="text-xs text-fg-dim mt-1">
              {stats.referralSignups} converted to signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">Conversion Rate</CardTitle>
            <Trophy className="h-4 w-4 text-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">
              {stats.totalReferrals > 0
                ? ((stats.referralSignups / stats.totalReferrals) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-fg-dim mt-1">
              Referral click to signup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Signups</CardTitle>
            <CardDescription>Last 5 users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                >
                  <div>
                    <p className="font-medium text-fg-primary text-sm">
                      {u.email}
                    </p>
                    <p className="text-xs text-fg-dim">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      u.betaStatus === "active"
                        ? "bg-green-dim text-green"
                        : u.betaStatus === "invited"
                          ? "bg-cyan-dim text-cyan"
                          : "bg-yellow-dim text-yellow"
                    }`}
                  >
                    {u.betaStatus}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/admin/users" className="block mt-4">
              <Button variant="ghost" className="w-full">
                View All Users <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow" />
              Top Leaderboard
            </CardTitle>
            <CardDescription>Highest point earners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topWaitlist.map((u, index) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-dim text-yellow" :
                      index === 1 ? "bg-fg-dim/20 text-fg-muted" :
                      index === 2 ? "bg-orange-dim text-orange" :
                      "bg-bg-elevated text-fg-dim"
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-fg-primary text-sm truncate max-w-[180px]">
                        {u.name || u.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-fg-dim">
                        #{u.waitlistRank ?? "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-cyan">
                    {u.totalPoints ?? 0} pts
                  </span>
                </div>
              ))}
              {topWaitlist.length === 0 && (
                <p className="text-sm text-fg-dim text-center py-4">
                  No users on leaderboard yet
                </p>
              )}
            </div>
            <Link href="/admin/waitlist" className="block mt-4">
              <Button variant="ghost" className="w-full">
                View Full Leaderboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
