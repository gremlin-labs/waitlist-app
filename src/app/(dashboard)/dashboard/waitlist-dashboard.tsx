"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, Twitter, BookOpen, BarChart3 } from "lucide-react";
import { RankCard } from "@/components/dashboard/rank-card";
import { PointsCard } from "@/components/dashboard/points-card";
import { SocialConnections } from "@/components/dashboard/social-connections";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { PointsGuideSheet } from "@/components/dashboard/points-guide-sheet";

interface PointsBreakdown {
  twitter: number;
  discord: number;
  referrals: number;
  survey: number;
  bonus: number;
}

interface TwitterStatus {
  connected: boolean;
  username?: string;
  followsAccount1: boolean;
  followsAccount2: boolean;
  followsProductgremlin: boolean;
}

interface DiscordStatus {
  connected: boolean;
  username?: string;
  hasJoinedServer: boolean;
}

interface WaitlistDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    surveyCompleted: boolean;
  };
  rank: number | null;
  totalPoints: number;
  totalWaitlist: number;
  pointsBreakdown: PointsBreakdown;
  twitter: TwitterStatus | null;
  discord: DiscordStatus | null;
  referralCount: number;
  referralSignups: number;
  discordInviteUrl: string;
}

export function WaitlistDashboard({
  user,
  rank,
  totalPoints,
  totalWaitlist,
  pointsBreakdown,
  twitter,
  discord,
  referralCount,
  referralSignups,
  discordInviteUrl,
}: WaitlistDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-fg-primary mb-2">
          You&apos;re on the List
        </h1>
        <p className="text-fg-muted">
          Good things come to those who wait, {user.name}
        </p>
        <div className="mt-3">
          <PointsGuideSheet
            currentPoints={pointsBreakdown}
            twitterConnected={twitter?.connected}
            discordConnected={discord?.connected}
            surveyCompleted={user.surveyCompleted}
          />
        </div>
      </div>

      {/* Survey reminder */}
      {!user.surveyCompleted && (
        <Card className="border-yellow bg-yellow-dim/30">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-yellow">Complete your survey</p>
                <p className="text-sm text-fg-muted">
                  Earn 15 points and help us understand you better
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/onboarding">Complete Survey +15 pts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rank Card - Full Width */}
      <RankCard
        rank={rank}
        totalPoints={totalPoints}
        totalWaitlist={totalWaitlist}
      />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <PointsCard
            total={totalPoints}
            breakdown={pointsBreakdown}
            rank={rank}
            twitterConnected={twitter?.connected}
            discordConnected={discord?.connected}
            surveyCompleted={user.surveyCompleted}
          />
          <ReferralCard
            referralCode={user.referralCode}
            referralCount={referralCount}
            referralSignups={referralSignups}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SocialConnections
            twitter={twitter}
            discord={discord}
            discordInviteUrl={discordInviteUrl}
          />

          {/* While you wait */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-fg-primary mb-4">While you wait</h3>
              <div className="grid gap-3">
                <a
                  href="https://twitter.com/vibemodeai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-md border border-border-subtle bg-bg-elevated hover:border-cyan/50 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-cyan" />
                  <span className="flex-1 text-fg-primary text-sm">Follow @vibemodeai</span>
                  <ExternalLink className="w-4 h-4 text-fg-dim" />
                </a>
                <a
                  href="https://github.com/gremlin-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-md border border-border-subtle bg-bg-elevated hover:border-fg-dim/50 transition-colors"
                >
                  <Github className="w-5 h-5 text-fg-muted" />
                  <span className="flex-1 text-fg-primary text-sm">Star us on GitHub</span>
                  <ExternalLink className="w-4 h-4 text-fg-dim" />
                </a>
                <Link
                  href="/philosophy"
                  className="flex items-center gap-3 p-3 rounded-md border border-border-subtle bg-bg-elevated hover:border-pink/50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-pink" />
                  <span className="flex-1 text-fg-primary text-sm">Read the Philosophy</span>
                  <ExternalLink className="w-4 h-4 text-fg-dim" />
                </Link>
                <Link
                  href="/benchmarks"
                  className="flex items-center gap-3 p-3 rounded-md border border-border-subtle bg-bg-elevated hover:border-green/50 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-green" />
                  <span className="flex-1 text-fg-primary text-sm">See the Benchmarks</span>
                  <ExternalLink className="w-4 h-4 text-fg-dim" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
