"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, BarChart3 } from "lucide-react";

interface AnalyticsData {
  users: {
    total: number;
    byStatus: Record<string, number>;
    surveyCompleted: number;
    surveyRate: string;
  };
  growth: {
    last30Days: Array<{ date: string; count: number }>;
  };
  survey: {
    topTools: Array<{ tool: string; count: number }>;
    primaryTools: Record<string, number>;
    macModels: Record<string, number>;
    vibeExperience: Record<string, number>;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-fg-muted" />
      </div>
    );
  }

  if (!data || !data.survey) {
    return (
      <div className="text-center py-24 text-fg-muted">
        Failed to load analytics
      </div>
    );
  }

  const topTools = data.survey.topTools || [];
  const maxToolCount = Math.max(...topTools.map((t) => t.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-fg-primary">Analytics</h1>
        <p className="text-fg-muted mt-1">Survey insights and user metrics</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fg-primary">
              {data.users.total.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">
              On Waitlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow">
              {(data.users.byStatus.waitlist || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">
              Active Beta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green">
              {(data.users.byStatus.active || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-fg-muted">
              Survey Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan">
              {data.users.surveyRate}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.users.byStatus).map(([status, count]) => {
              const percentage = data.users.total > 0
                ? (count / data.users.total) * 100
                : 0;
              const colors: Record<string, string> = {
                waitlist: "bg-yellow",
                invited: "bg-cyan",
                active: "bg-green",
                churned: "bg-red",
              };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-fg-primary capitalize">
                      {status}
                    </span>
                    <span className="text-sm text-fg-muted">
                      {count.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[status] || "bg-fg-dim"} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top AI Coding Tools
          </CardTitle>
          <CardDescription>
            What tools are users currently using?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topTools.length > 0 ? (
            <div className="space-y-3">
              {topTools.map((tool, index) => (
                <div key={tool.tool}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-fg-primary">
                      {index + 1}. {tool.tool}
                    </span>
                    <span className="text-sm text-fg-muted font-mono">
                      {tool.count}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink to-purple transition-all"
                      style={{ width: `${(tool.count / maxToolCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-fg-muted text-center py-8">
              No survey data yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Two column layout for smaller charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Primary Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Tools</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(data.survey.primaryTools || {}).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(data.survey.primaryTools || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([tool, count]) => (
                    <div
                      key={tool}
                      className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-sm text-fg-primary capitalize">
                        {tool.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-fg-muted font-mono">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-fg-muted text-center py-8">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Mac Models */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mac Models</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(data.survey.macModels || {}).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(data.survey.macModels || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([model, count]) => (
                    <div
                      key={model}
                      className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-sm text-fg-primary">{model}</span>
                      <span className="text-sm text-fg-muted font-mono">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-fg-muted text-center py-8">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vibe Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Vibe Coding Experience
          </CardTitle>
          <CardDescription>How experienced are users with AI coding?</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(data.survey.vibeExperience || {}).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(data.survey.vibeExperience || {})
                .sort(([, a], [, b]) => b - a)
                .map(([level, count]) => {
                  const labels: Record<string, string> = {
                    never_heard: "Never heard of it",
                    curious: "Curious but haven't tried",
                    tried_it: "I've dabbled",
                    daily_viber: "Daily viber",
                    transcended: "Transcended",
                  };
                  return (
                    <div
                      key={level}
                      className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-sm text-fg-primary">
                        {labels[level] || level}
                      </span>
                      <span className="text-sm text-fg-muted font-mono">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-fg-muted text-center py-8">No data</p>
          )}
        </CardContent>
      </Card>

      {/* Growth Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Signups Over Time</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {data.growth.last30Days.length > 0 ? (
            <div className="h-48 flex items-end gap-1">
              {data.growth.last30Days.map((day) => {
                const maxCount = Math.max(
                  ...data.growth.last30Days.map((d) => d.count),
                  1
                );
                const heightPercent = (day.count / maxCount) * 100;

                return (
                  <div
                    key={day.date}
                    className="flex-1 bg-gradient-to-t from-cyan to-blue rounded-t-sm transition-all hover:opacity-80 relative group"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                    title={`${day.date}: ${day.count} signups`}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface-overlay px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.count}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-fg-muted text-center py-12">
              No signup data for the last 30 days
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
