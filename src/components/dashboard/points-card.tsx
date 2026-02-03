"use client";

import { Trophy, Twitter, MessageCircle, Share2, ClipboardCheck, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PointsGuideSheet } from "./points-guide-sheet";

interface PointsBreakdown {
  twitter: number;
  discord: number;
  referrals: number;
  survey: number;
  bonus: number;
}

interface PointsCardProps {
  total: number;
  breakdown: PointsBreakdown;
  rank: number | null;
  twitterConnected?: boolean;
  discordConnected?: boolean;
  surveyCompleted?: boolean;
}

// Max possible points for progress bars
const MAX_POINTS = {
  twitter: 35, // 5 connect + 10 each for 3 follows
  discord: 25, // 5 connect + 20 server join
  survey: 15,
};

export function PointsCard({ 
  total, 
  breakdown, 
  rank,
  twitterConnected,
  discordConnected,
  surveyCompleted,
}: PointsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow" />
            Your Points
          </CardTitle>
          {rank && (
            <span className="text-sm text-fg-muted">
              Rank <span className="text-cyan font-mono font-bold">#{rank}</span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Points */}
        <div className="text-center py-4 bg-bg-elevated rounded-lg">
          <p className="text-5xl font-bold text-pink">{total}</p>
          <p className="text-sm text-fg-dim mt-1">total points</p>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <PointsRow
            label="Twitter"
            points={breakdown.twitter}
            max={MAX_POINTS.twitter}
            icon={<Twitter className="w-4 h-4" />}
            color="text-cyan"
            bgColor="bg-cyan"
          />
          <PointsRow
            label="Discord"
            points={breakdown.discord}
            max={MAX_POINTS.discord}
            icon={<MessageCircle className="w-4 h-4" />}
            color="text-violet"
            bgColor="bg-violet"
          />
          <PointsRow
            label="Referrals"
            points={breakdown.referrals}
            max={null}
            icon={<Share2 className="w-4 h-4" />}
            color="text-orange"
            bgColor="bg-orange"
          />
          <PointsRow
            label="Survey"
            points={breakdown.survey}
            max={MAX_POINTS.survey}
            icon={<ClipboardCheck className="w-4 h-4" />}
            color="text-green"
            bgColor="bg-green"
          />
          {breakdown.bonus > 0 && (
            <PointsRow
              label="Bonus"
              points={breakdown.bonus}
              max={null}
              icon={<Gift className="w-4 h-4" />}
              color="text-yellow"
              bgColor="bg-yellow"
            />
          )}
        </div>

        {/* How to earn more link */}
        <div className="pt-2 border-t border-border-subtle flex justify-center">
          <PointsGuideSheet
            currentPoints={breakdown}
            twitterConnected={twitterConnected}
            discordConnected={discordConnected}
            surveyCompleted={surveyCompleted}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface PointsRowProps {
  label: string;
  points: number;
  max: number | null;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function PointsRow({ label, points, max, icon, color, bgColor }: PointsRowProps) {
  const percentage = max ? Math.min((points / max) * 100, 100) : (points > 0 ? 100 : 0);

  return (
    <div className="flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-fg-muted">{label}</span>
          <span className="text-fg-primary font-mono">
            {points}
            {max ? `/${max}` : ""} pts
          </span>
        </div>
        <div className="h-2 bg-bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full ${bgColor} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
