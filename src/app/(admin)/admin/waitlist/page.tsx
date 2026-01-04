"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Twitter,
  MessageCircle,
  Share2,
  Check,
  X,
  RefreshCw,
  ArrowUpDown,
  Eye,
  Calculator,
  Loader2,
} from "lucide-react";

interface WaitlistUser {
  id: string;
  email: string;
  name: string | null;
  totalPoints: number | null;
  waitlistRank: number | null;
  betaStatus: string;
  createdAt: string;
  surveyCompletedAt: string | null;
  referralCode: string | null;
  twitter: {
    connected: boolean;
    followsVibemodeai: boolean;
    followsGremlinlabs: boolean;
    followsProductgremlin: boolean;
  } | null;
  discord: {
    connected: boolean;
    hasJoinedServer: boolean;
  } | null;
  referrals: {
    total: number;
    signups: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function WaitlistPage() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [adjustingPoints, setAdjustingPoints] = useState(false);
  const [pointAdjustment, setPointAdjustment] = useState({ points: 0, note: "" });
  const [reranking, setReranking] = useState(false);

  async function fetchWaitlist(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        sort: sortBy,
        status: "waitlist",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/waitlist?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, limit: 25, total: 0, pages: 0 });
    } catch (error) {
      console.error("Failed to fetch waitlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetail(userId: string) {
    try {
      const res = await fetch(`/api/admin/waitlist/${userId}`);
      const data = await res.json();
      setUserDetail(data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    }
  }

  async function adjustPoints() {
    if (!selectedUser || pointAdjustment.points === 0) return;
    setAdjustingPoints(true);
    try {
      const res = await fetch(`/api/admin/waitlist/${selectedUser}/adjust-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pointAdjustment),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUserDetail(selectedUser);
        await fetchWaitlist(pagination.page);
        setPointAdjustment({ points: 0, note: "" });
      }
    } catch (error) {
      console.error("Failed to adjust points:", error);
    } finally {
      setAdjustingPoints(false);
    }
  }

  async function triggerRerank() {
    setReranking(true);
    try {
      const res = await fetch("/api/admin/rerank", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Refresh the list after re-ranking
        await fetchWaitlist(pagination.page);
        if (selectedUser) {
          await fetchUserDetail(selectedUser);
        }
      }
    } catch (error) {
      console.error("Failed to re-rank:", error);
    } finally {
      setReranking(false);
    }
  }

  useEffect(() => {
    fetchWaitlist();
  }, [sortBy]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchWaitlist(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserDetail(selectedUser);
    }
  }, [selectedUser]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg-primary flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow" />
            Leaderboard
          </h1>
          <p className="text-fg-muted mt-1">
            {pagination.total.toLocaleString()} users ranked by points
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={triggerRerank}
            disabled={reranking}
            className="gap-2"
          >
            {reranking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            Re-rank
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchWaitlist(pagination.page)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Sort */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-dim" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-elevated border border-border-subtle rounded-md px-3 py-2 text-fg-primary focus:outline-none focus:ring-2 focus:ring-cyan"
            >
              <option value="rank">Sort by Rank</option>
              <option value="points">Sort by Points</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && users.length === 0 ? (
                <div className="text-center py-8 text-fg-dim">Loading...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-fg-dim">No users found</div>
              ) : (
                <div className="space-y-2">
                  {users.map((u, index) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser === u.id
                          ? "bg-cyan-dim border border-cyan"
                          : "bg-bg-elevated hover:bg-bg-surface border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            (u.waitlistRank || index + 1) === 1
                              ? "bg-yellow-dim text-yellow"
                              : (u.waitlistRank || index + 1) === 2
                                ? "bg-fg-dim/20 text-fg-muted"
                                : (u.waitlistRank || index + 1) === 3
                                  ? "bg-orange-dim text-orange"
                                  : "bg-bg-surface text-fg-dim"
                          }`}
                        >
                          {u.waitlistRank || "—"}
                        </span>
                        <div>
                          <p className="font-medium text-fg-primary text-sm">
                            {u.name || u.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-fg-dim">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Social badges */}
                        <div className="flex items-center gap-1">
                          {u.twitter?.connected ? (
                            <Twitter
                              className={`w-4 h-4 ${
                                u.twitter.followsVibemodeai &&
                                u.twitter.followsGremlinlabs &&
                                u.twitter.followsProductgremlin
                                  ? "text-cyan"
                                  : "text-fg-dim"
                              }`}
                            />
                          ) : (
                            <Twitter className="w-4 h-4 text-fg-dim/30" />
                          )}
                          {u.discord?.connected ? (
                            <MessageCircle
                              className={`w-4 h-4 ${
                                u.discord.hasJoinedServer ? "text-violet" : "text-fg-dim"
                              }`}
                            />
                          ) : (
                            <MessageCircle className="w-4 h-4 text-fg-dim/30" />
                          )}
                          {u.referrals.signups > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-orange">
                              <Share2 className="w-3 h-3" />
                              {u.referrals.signups}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-cyan min-w-[60px] text-right">
                          {u.totalPoints ?? 0} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                  <p className="text-sm text-fg-dim">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchWaitlist(pagination.page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => fetchWaitlist(pagination.page + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Detail Panel */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                User Details
              </CardTitle>
              <CardDescription>
                {selectedUser ? "Click a user to view details" : "Select a user"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedUser ? (
                <p className="text-center text-fg-dim py-8">
                  Select a user from the list
                </p>
              ) : !userDetail ? (
                <p className="text-center text-fg-dim py-8">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {/* User Info */}
                  <div>
                    <p className="font-medium text-fg-primary">{userDetail.user.name || "No name"}</p>
                    <p className="text-sm text-fg-dim">{userDetail.user.email}</p>
                    <p className="text-xs text-fg-dim mt-1">
                      Joined {new Date(userDetail.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Points Breakdown */}
                  <div className="bg-bg-elevated rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-fg-muted">Total Points</span>
                      <span className="font-mono font-bold text-cyan">
                        {userDetail.points.total}
                      </span>
                    </div>
                    <div className="h-px bg-border-subtle" />
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-fg-dim">Twitter</span>
                        <span className="font-mono">{userDetail.points.breakdown.twitter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg-dim">Discord</span>
                        <span className="font-mono">{userDetail.points.breakdown.discord}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg-dim">Referrals</span>
                        <span className="font-mono">{userDetail.points.breakdown.referrals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg-dim">Survey</span>
                        <span className="font-mono">{userDetail.points.breakdown.survey}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg-dim">Bonus</span>
                        <span className="font-mono">{userDetail.points.breakdown.bonus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Status */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-fg-muted">Social Connections</p>
                    <div className="flex flex-wrap gap-2">
                      {userDetail.twitter ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-dim rounded text-xs">
                          <Twitter className="w-3 h-3 text-cyan" />
                          <span className="text-cyan">@{userDetail.twitter.username}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-bg-elevated rounded text-xs text-fg-dim">
                          <Twitter className="w-3 h-3" />
                          Not connected
                        </div>
                      )}
                      {userDetail.discord ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-violet-dim rounded text-xs">
                          <MessageCircle className="w-3 h-3 text-violet" />
                          <span className="text-violet">{userDetail.discord.username}</span>
                          {userDetail.discord.hasJoinedServer ? (
                            <Check className="w-3 h-3 text-green" />
                          ) : (
                            <X className="w-3 h-3 text-red" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-bg-elevated rounded text-xs text-fg-dim">
                          <MessageCircle className="w-3 h-3" />
                          Not connected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Referrals */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-fg-muted">Referrals</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-bg-elevated rounded p-2">
                        <p className="text-lg font-bold text-fg-primary">
                          {userDetail.referrals.total}
                        </p>
                        <p className="text-xs text-fg-dim">Clicks</p>
                      </div>
                      <div className="bg-bg-elevated rounded p-2">
                        <p className="text-lg font-bold text-green">
                          {userDetail.referrals.signups}
                        </p>
                        <p className="text-xs text-fg-dim">Signups</p>
                      </div>
                      <div className="bg-bg-elevated rounded p-2">
                        <p className="text-lg font-bold text-cyan">
                          {userDetail.referrals.activated}
                        </p>
                        <p className="text-xs text-fg-dim">Activated</p>
                      </div>
                    </div>
                  </div>

                  {/* Point Adjustment */}
                  <div className="space-y-2 pt-2 border-t border-border-subtle">
                    <p className="text-sm font-medium text-fg-muted">Adjust Points</p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="±100"
                        value={pointAdjustment.points || ""}
                        onChange={(e) =>
                          setPointAdjustment({
                            ...pointAdjustment,
                            points: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                      <Input
                        placeholder="Note (optional)"
                        value={pointAdjustment.note}
                        onChange={(e) =>
                          setPointAdjustment({ ...pointAdjustment, note: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={pointAdjustment.points === 0 || adjustingPoints}
                      onClick={adjustPoints}
                    >
                      {adjustingPoints ? "Adjusting..." : "Apply Adjustment"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
