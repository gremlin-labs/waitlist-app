"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContentWrapper,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Twitter,
  MessageCircle,
  Share2,
  ClipboardCheck,
  Gift,
  Zap,
  Trophy,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    }
  },
};

interface PointsGuideSheetProps {
  // Current user status (optional - for highlighting incomplete tasks)
  currentPoints?: {
    twitter: number;
    discord: number;
    referrals: number;
    survey: number;
    bonus: number;
  };
  twitterConnected?: boolean;
  discordConnected?: boolean;
  surveyCompleted?: boolean;
}

export function PointsGuideSheet({
  currentPoints,
  twitterConnected,
  discordConnected,
  surveyCompleted,
}: PointsGuideSheetProps) {
  const [open, setOpen] = useState(false);
  
  // Calculate max potential points
  const maxPotentialPoints = 35 + 25 + 15; // Twitter + Discord + Survey (minimum guaranteed)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-fg-muted hover:text-fg-primary">
          <HelpCircle className="w-4 h-4" />
          How to earn points
        </Button>
      </SheetTrigger>
      <SheetContentWrapper open={open} className="overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-yellow" />
            How to Earn Points
          </SheetTitle>
          <SheetDescription>
            Climb the waitlist by completing tasks. Higher points = earlier access!
          </SheetDescription>
        </SheetHeader>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Quick Summary */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-pink-dim/30 via-bg-elevated to-cyan-dim/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-pink" />
              </motion.div>
              <span className="font-semibold text-fg-primary">Earn up to {maxPotentialPoints}+ points</span>
            </div>
            <p className="text-sm text-fg-muted">
              Complete all tasks to maximize your ranking. Referrals have no limit!
            </p>
          </motion.div>

          {/* Twitter Section */}
          <motion.div variants={itemVariants}>
            <PointsSection
              icon={<Twitter className="w-5 h-5" />}
              title="Twitter"
              color="cyan"
              maxPoints={35}
              currentPoints={currentPoints?.twitter}
              completed={twitterConnected && (currentPoints?.twitter ?? 0) >= 35}
            >
              <PointsTask
                label="Connect your Twitter account"
                points={5}
                completed={(currentPoints?.twitter ?? 0) >= 5}
                href={!twitterConnected ? "/api/social/twitter/auth" : undefined}
                isInternal
              />
              <PointsTask
                label="Follow @vibemodeai"
                points={10}
                completed={(currentPoints?.twitter ?? 0) >= 15}
                href="https://twitter.com/vibemodeai"
              />
              <PointsTask
                label="Follow @thiscompany"
                points={10}
                completed={(currentPoints?.twitter ?? 0) >= 25}
                href="https://twitter.com/thiscompany"
              />
              <PointsTask
                label="Follow @productgremlin"
                points={10}
                completed={(currentPoints?.twitter ?? 0) >= 35}
                href="https://twitter.com/productgremlin"
              />
              <p className="text-xs text-fg-dim mt-2 italic">
                ⚠️ Unfollowing deducts points. We check periodically!
              </p>
            </PointsSection>
          </motion.div>

          {/* Discord Section */}
          <motion.div variants={itemVariants}>
            <PointsSection
              icon={<MessageCircle className="w-5 h-5" />}
              title="Discord"
              color="violet"
              maxPoints={25}
              currentPoints={currentPoints?.discord}
              completed={discordConnected && (currentPoints?.discord ?? 0) >= 25}
            >
              <PointsTask
                label="Connect your Discord account"
                points={5}
                completed={(currentPoints?.discord ?? 0) >= 5}
                href={!discordConnected ? "/api/social/discord/auth" : undefined}
                isInternal
              />
              <PointsTask
                label="Join the Amazing App server"
                points={20}
                completed={(currentPoints?.discord ?? 0) >= 25}
                href="https://discord.gg/thiscompany"
              />
              <p className="text-xs text-fg-dim mt-2 italic">
                ⚠️ Leaving the server deducts points. Stay vibing!
              </p>
            </PointsSection>
          </motion.div>

          {/* Survey Section */}
          <motion.div variants={itemVariants}>
            <PointsSection
              icon={<ClipboardCheck className="w-5 h-5" />}
              title="Onboarding Survey"
              color="green"
              maxPoints={15}
              currentPoints={currentPoints?.survey}
              completed={surveyCompleted}
            >
              <PointsTask
                label="Complete the onboarding survey"
                points={15}
                completed={surveyCompleted ?? false}
                href={!surveyCompleted ? "/onboarding" : undefined}
                isInternal
              />
              <p className="text-xs text-fg-dim mt-2">
                Help us build the perfect IDE for you!
              </p>
            </PointsSection>
          </motion.div>

          {/* Referrals Section */}
          <motion.div variants={itemVariants}>
            <PointsSection
              icon={<Share2 className="w-5 h-5" />}
              title="Referrals"
              color="orange"
              maxPoints={null}
              currentPoints={currentPoints?.referrals}
            >
              <PointsTask
                label="Each friend who clicks your link"
                points={1}
                completed={false}
                note="(max 100 pts)"
              />
              <PointsTask
                label="Each friend who signs up"
                points={5}
                completed={false}
                note="(unlimited)"
              />
              <PointsTask
                label="Each friend who completes onboarding"
                points={10}
                completed={false}
                note="(unlimited)"
              />
              <div className="mt-3 p-3 bg-bg-elevated rounded-lg">
                <p className="text-sm font-medium text-fg-primary mb-1">
                  🚀 Power User Tip
                </p>
                <p className="text-xs text-fg-muted">
                  Share on Twitter, Discord, Reddit, or dev communities. Each activated referral = 16 total points!
                </p>
              </div>
            </PointsSection>
          </motion.div>

          {/* Bonus Section */}
          <motion.div variants={itemVariants}>
            <PointsSection
              icon={<Gift className="w-5 h-5" />}
              title="Bonus Points"
              color="yellow"
              maxPoints={null}
              currentPoints={currentPoints?.bonus}
            >
              <div className="space-y-2 text-sm text-fg-muted">
                <p>
                  <Zap className="w-4 h-4 inline mr-1 text-yellow" />
                  Special events and promotions
                </p>
                <p>
                  <Zap className="w-4 h-4 inline mr-1 text-yellow" />
                  Community contributions
                </p>
                <p>
                  <Zap className="w-4 h-4 inline mr-1 text-yellow" />
                  Bug reports and feedback
                </p>
                <p>
                  <Zap className="w-4 h-4 inline mr-1 text-yellow" />
                  Admin rewards for exceptional vibes
                </p>
              </div>
            </PointsSection>
          </motion.div>

          {/* Footer CTA */}
          <motion.div 
            variants={itemVariants}
            className="pt-4 border-t border-border-subtle"
          >
            <SheetClose asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full">
                  Start Earning Points
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </SheetClose>
          </motion.div>
        </motion.div>
      </SheetContentWrapper>
    </Sheet>
  );
}

interface PointsSectionProps {
  icon: React.ReactNode;
  title: string;
  color: "cyan" | "violet" | "green" | "orange" | "yellow" | "pink";
  maxPoints: number | null;
  currentPoints?: number;
  completed?: boolean;
  children: React.ReactNode;
}

function PointsSection({
  icon,
  title,
  color,
  maxPoints,
  currentPoints,
  completed,
  children,
}: PointsSectionProps) {
  const colorClasses = {
    cyan: "text-cyan bg-cyan-dim/30 border-cyan/30",
    violet: "text-violet bg-violet-dim/30 border-violet/30",
    green: "text-green bg-green-dim/30 border-green/30",
    orange: "text-orange bg-orange-dim/30 border-orange/30",
    yellow: "text-yellow bg-yellow-dim/30 border-yellow/30",
    pink: "text-pink bg-pink-dim/30 border-pink/30",
  };

  const iconColorClass = {
    cyan: "text-cyan",
    violet: "text-violet",
    green: "text-green",
    orange: "text-orange",
    yellow: "text-yellow",
    pink: "text-pink",
  };

  return (
    <div className={`rounded-lg border p-4 ${completed ? colorClasses[color] : "bg-bg-elevated border-border-subtle"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={iconColorClass[color]}>{icon}</span>
          <span className="font-semibold text-fg-primary">{title}</span>
        </div>
        <div className="text-sm">
          {completed ? (
            <span className={`flex items-center gap-1 ${iconColorClass[color]}`}>
              <Check className="w-4 h-4" />
              Complete
            </span>
          ) : maxPoints ? (
            <span className="font-mono text-fg-muted">
              {currentPoints ?? 0}/{maxPoints} pts
            </span>
          ) : (
            <span className="font-mono text-fg-muted">
              {currentPoints ?? 0} pts
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

interface PointsTaskProps {
  label: string;
  points: number;
  completed: boolean;
  href?: string;
  isInternal?: boolean;
  note?: string;
}

function PointsTask({ label, points, completed, href, isInternal, note }: PointsTaskProps) {
  const content = (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
        completed
          ? "bg-green-dim/20 text-fg-muted"
          : href
            ? "bg-bg-surface hover:bg-bg-base cursor-pointer"
            : "bg-bg-surface"
      }`}
    >
      <div className="flex items-center gap-2">
        {completed ? (
          <Check className="w-4 h-4 text-green shrink-0" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-fg-dim shrink-0" />
        )}
        <span className={completed ? "line-through" : ""}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {note && <span className="text-xs text-fg-dim">{note}</span>}
        {completed ? (
          <span className="text-xs text-green font-mono">+{points}</span>
        ) : href ? (
          <span className="text-xs text-cyan font-mono flex items-center gap-1">
            +{points}
            {!isInternal && <ExternalLink className="w-3 h-3" />}
          </span>
        ) : (
          <span className="text-xs text-fg-dim font-mono">+{points}</span>
        )}
      </div>
    </div>
  );

  if (href && !completed) {
    if (isInternal) {
      return <a href={href}>{content}</a>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
