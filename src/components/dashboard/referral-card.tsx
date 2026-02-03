"use client";

import { useState } from "react";
import { Copy, Check, Share2, Twitter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReferralCardProps {
  referralCode: string;
  referralCount: number;
  referralSignups: number;
}

export function ReferralCard({
  referralCode,
  referralCount,
  referralSignups,
}: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.example.com";
  const referralLink = `${baseUrl}/join/${referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Points earned from referrals (clicks=1, signups=5 each)
  const pointsFromClicks = Math.min(referralCount, 100); // Capped at 100
  const pointsFromSignups = referralSignups * 5;
  const totalReferralPoints = pointsFromClicks + pointsFromSignups;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="w-5 h-5 text-orange" />
          Refer Friends
        </CardTitle>
        <CardDescription>
          Earn points when friends click and sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-bg-elevated rounded-lg">
            <p className="text-2xl font-bold text-fg-primary">{referralCount}</p>
            <p className="text-xs text-fg-dim">Clicks</p>
          </div>
          <div className="text-center p-3 bg-bg-elevated rounded-lg">
            <p className="text-2xl font-bold text-green">{referralSignups}</p>
            <p className="text-xs text-fg-dim">Signups</p>
          </div>
          <div className="text-center p-3 bg-bg-elevated rounded-lg">
            <p className="text-2xl font-bold text-orange">{totalReferralPoints}</p>
            <p className="text-xs text-fg-dim">Points</p>
          </div>
        </div>

        {/* Referral Link */}
        <div>
          <p className="text-xs text-fg-dim mb-2">Your referral link:</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-bg-surface border border-border-subtle rounded-md px-3 py-2 font-mono text-sm text-fg-muted truncate">
              waitlist.example.com/join/{referralCode}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" asChild className="gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                "I'm on the waitlist for Amazing App — the native AI IDE built from scratch. No forks, no wrappers. Join me:"
              )}&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4" />
              Share on X
            </a>
          </Button>
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>
        </div>

        {/* Points Info */}
        <div className="text-xs text-fg-dim space-y-1 pt-2 border-t border-border-subtle">
          <p>• +1 point per click (max 100 pts)</p>
          <p>• +5 points per signup</p>
          <p>• +10 points when they complete onboarding</p>
        </div>
      </CardContent>
    </Card>
  );
}
