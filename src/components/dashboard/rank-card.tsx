"use client";

import { Trophy, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RankCardProps {
  rank: number | null;
  totalPoints: number;
  totalWaitlist: number;
}

export function RankCard({ rank, totalPoints, totalWaitlist }: RankCardProps) {
  // Calculate percentile (lower rank = better)
  const percentile = rank && totalWaitlist > 0 
    ? Math.round(((totalWaitlist - rank) / totalWaitlist) * 100)
    : 0;

  return (
    <Card className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-dim/30 via-transparent to-cyan-dim/20 pointer-events-none" />
      <CardHeader className="text-center pb-2 relative">
        <CardDescription className="text-xs uppercase tracking-wider text-fg-dim">
          Your Waitlist Position
        </CardDescription>
        <CardTitle className="text-7xl font-bold bg-gradient-to-r from-pink via-violet to-cyan bg-clip-text text-transparent">
          #{rank ?? "—"}
        </CardTitle>
        <CardDescription>
          of {totalWaitlist.toLocaleString()} vibe seekers
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
          <Stat
            icon={<Trophy className="w-4 h-4 text-yellow" />}
            label="Points"
            value={totalPoints.toString()}
          />
          <Stat
            icon={<TrendingUp className="w-4 h-4 text-green" />}
            label="Top"
            value={`${percentile}%`}
          />
          <Stat
            icon={<Users className="w-4 h-4 text-cyan" />}
            label="Ahead of"
            value={rank ? (totalWaitlist - rank).toLocaleString() : "0"}
          />
        </div>

        {/* Motivation message */}
        {rank && rank > 100 && (
          <div className="mt-4 p-3 rounded-lg bg-bg-elevated text-center">
            <p className="text-sm text-fg-muted">
              {rank > 500 ? (
                <>
                  <span className="text-yellow">🚀</span> Complete social tasks to climb{" "}
                  <span className="text-pink font-bold">{Math.min(rank - 100, 500)}+ spots!</span>
                </>
              ) : rank > 100 ? (
                <>
                  <span className="text-green">📈</span> You're getting close to the top 100!
                </>
              ) : null}
            </p>
          </div>
        )}

        {rank && rank <= 100 && (
          <div className="mt-4 p-3 rounded-lg bg-green-dim/30 border border-green/30 text-center">
            <p className="text-sm text-green font-medium">
              🎉 You're in the top 100! Early access coming soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-lg font-bold text-fg-primary">{value}</p>
      <p className="text-xs text-fg-dim">{label}</p>
    </div>
  );
}
