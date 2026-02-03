"use client";

import { useState } from "react";
import {
  Twitter,
  MessageCircle,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface SocialConnectionsProps {
  twitter: TwitterStatus | null;
  discord: DiscordStatus | null;
  discordInviteUrl: string;
}

export function SocialConnections({
  twitter,
  discord,
  discordInviteUrl,
}: SocialConnectionsProps) {
  const [refreshingTwitter, setRefreshingTwitter] = useState(false);
  const [refreshingDiscord, setRefreshingDiscord] = useState(false);

  async function refreshTwitter() {
    setRefreshingTwitter(true);
    try {
      await fetch("/api/social/twitter/refresh", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh Twitter:", error);
    } finally {
      setRefreshingTwitter(false);
    }
  }

  async function refreshDiscord() {
    setRefreshingDiscord(true);
    try {
      await fetch("/api/social/discord/refresh", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh Discord:", error);
    } finally {
      setRefreshingDiscord(false);
    }
  }

  const twitterFollowCount = twitter
    ? [
        twitter.followsAccount1,
        twitter.followsAccount2,
        twitter.followsProductgremlin,
      ].filter(Boolean).length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Boost Your Rank</CardTitle>
        <CardDescription>
          Connect accounts and complete tasks to earn more points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Twitter Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-cyan" />
              <span className="font-medium text-fg-primary">Twitter</span>
              {twitter?.connected && (
                <span className="text-sm text-fg-dim">@{twitter.username}</span>
              )}
            </div>
            {twitter?.connected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshTwitter}
                disabled={refreshingTwitter}
              >
                {refreshingTwitter ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <a href="/api/social/twitter/auth">Connect +5 pts</a>
              </Button>
            )}
          </div>

          {twitter?.connected && (
            <div className="pl-7 space-y-2">
              <FollowTask
                label="Follow @vibemodeai"
                completed={twitter.followsAccount1}
                href="https://twitter.com/vibemodeai"
                points={10}
              />
              <FollowTask
                label="Follow @thiscompany"
                completed={twitter.followsAccount2}
                href="https://twitter.com/thiscompany"
                points={10}
              />
              <FollowTask
                label="Follow @productgremlin"
                completed={twitter.followsProductgremlin}
                href="https://twitter.com/productgremlin"
                points={10}
              />
              <p className="text-xs text-fg-dim pt-1">
                {twitterFollowCount}/3 follows • {5 + twitterFollowCount * 10}/35 pts earned
              </p>
            </div>
          )}
        </div>

        {/* Discord Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-violet" />
              <span className="font-medium text-fg-primary">Discord</span>
              {discord?.connected && (
                <span className="text-sm text-fg-dim">{discord.username}</span>
              )}
            </div>
            {discord?.connected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshDiscord}
                disabled={refreshingDiscord}
              >
                {refreshingDiscord ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <a href="/api/social/discord/auth">Connect +5 pts</a>
              </Button>
            )}
          </div>

          {discord?.connected && (
            <div className="pl-7 space-y-2">
              <ServerTask
                label="Join Amazing App Server"
                completed={discord.hasJoinedServer}
                href={discordInviteUrl}
                points={20}
              />
              <p className="text-xs text-fg-dim pt-1">
                {discord.hasJoinedServer ? "25/25" : "5/25"} pts earned
              </p>
            </div>
          )}
        </div>

        {/* Total Progress */}
        <div className="pt-4 border-t border-border-subtle">
          <div className="flex justify-between text-sm">
            <span className="text-fg-muted">Social Points Progress</span>
            <span className="font-mono text-fg-primary">
              {(twitter?.connected ? 5 : 0) +
                twitterFollowCount * 10 +
                (discord?.connected ? 5 : 0) +
                (discord?.hasJoinedServer ? 20 : 0)}
              /60 pts
            </span>
          </div>
          <div className="mt-2 h-2 bg-bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan to-violet rounded-full transition-all duration-500"
              style={{
                width: `${
                  (((twitter?.connected ? 5 : 0) +
                    twitterFollowCount * 10 +
                    (discord?.connected ? 5 : 0) +
                    (discord?.hasJoinedServer ? 20 : 0)) /
                    60) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TaskProps {
  label: string;
  completed: boolean;
  href: string;
  points: number;
}

function FollowTask({ label, completed, href, points }: TaskProps) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-bg-elevated">
      <div className="flex items-center gap-2">
        {completed ? (
          <Check className="w-4 h-4 text-green" />
        ) : (
          <X className="w-4 h-4 text-fg-dim" />
        )}
        <span className={completed ? "text-fg-muted line-through" : "text-fg-primary"}>
          {label}
        </span>
      </div>
      {completed ? (
        <span className="text-xs text-green font-mono">+{points} pts</span>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan hover:text-cyan-bright flex items-center gap-1"
        >
          Follow <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

function ServerTask({ label, completed, href, points }: TaskProps) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-bg-elevated">
      <div className="flex items-center gap-2">
        {completed ? (
          <Check className="w-4 h-4 text-green" />
        ) : (
          <X className="w-4 h-4 text-fg-dim" />
        )}
        <span className={completed ? "text-fg-muted line-through" : "text-fg-primary"}>
          {label}
        </span>
      </div>
      {completed ? (
        <span className="text-xs text-green font-mono">+{points} pts</span>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet hover:text-violet-bright flex items-center gap-1"
        >
          Join <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
