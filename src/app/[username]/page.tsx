import { notFound } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import { isReservedPath, formatUsernameForDisplay } from "@/lib/username";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { User, Calendar, Trophy } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserByUsername(username: string) {
  const userData = await db.query.user.findFirst({
    where: sql`LOWER(${user.username}) = ${username.toLowerCase()}`,
    columns: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      betaStatus: true,
      totalPoints: true,
      waitlistRank: true,
    },
  });

  return userData;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Check if this is a reserved path - if so, let Next.js handle 404
  if (isReservedPath(username)) {
    notFound();
  }

  // Try to find the user
  const userData = await getUserByUsername(username);

  if (!userData) {
    notFound();
  }

  const memberSince = new Date(userData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const statusLabel = userData.betaStatus === "active" ? "Beta Tester" : "Waitlist";
  const statusColor = userData.betaStatus === "active" ? "text-green" : "text-pink";

  return (
    <div className="min-h-screen bg-surface-void">
      <Navbar />

      <main className="pt-14">
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl">
            {/* Profile Card */}
            <div className="rounded-lg border border-border-subtle bg-surface-base p-8 text-center">
              {/* Avatar */}
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-dim">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || userData.username || "User"}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-pink" />
                )}
              </div>

              {/* Name & Username */}
              <h1 className="text-2xl font-bold text-fg-primary mb-1">
                {userData.name || "Amazing App User"}
              </h1>
              <p className="font-mono text-pink mb-4">
                {formatUsernameForDisplay(userData.username || "")}
              </p>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-sm font-medium ${statusColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${userData.betaStatus === "active" ? "bg-green" : "bg-pink"}`} />
                  {statusLabel}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-md bg-surface-raised">
                  <Trophy className="h-5 w-5 text-yellow mx-auto mb-2" />
                  <div className="text-lg font-bold text-fg-primary">
                    {userData.totalPoints || 0}
                  </div>
                  <div className="text-xs text-fg-muted">Points</div>
                </div>
                <div className="p-4 rounded-md bg-surface-raised">
                  <Calendar className="h-5 w-5 text-cyan mx-auto mb-2" />
                  <div className="text-lg font-bold text-fg-primary">
                    {memberSince}
                  </div>
                  <div className="text-xs text-fg-muted">Joined</div>
                </div>
                <div className="p-4 rounded-md bg-surface-raised">
                  <User className="h-5 w-5 text-green mx-auto mb-2" />
                  <div className="text-lg font-bold text-fg-primary">
                    #{userData.waitlistRank || "—"}
                  </div>
                  <div className="text-xs text-fg-muted">Rank</div>
                </div>
              </div>

              {/* Join CTA */}
              <div className="pt-6 border-t border-border-subtle">
                <p className="text-sm text-fg-muted mb-4">
                  Want to join the waitlist?
                </p>
                <a
                  href="/auth/signin"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-sm bg-pink text-fg-inverse font-semibold hover:bg-pink-bright transition-colors"
                >
                  Join Amazing App
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Generate static params for popular users (optional optimization)
// export async function generateStaticParams() {
//   return [];
// }

// Metadata
export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;

  if (isReservedPath(username)) {
    return {};
  }

  const userData = await getUserByUsername(username);

  if (!userData) {
    return {
      title: "User Not Found | Amazing App",
    };
  }

  const displayName = userData.name || userData.username || "User";

  return {
    title: `${displayName} (@${userData.username}) | Amazing App`,
    description: `${displayName}'s profile on Amazing App - the native AI development environment for macOS.`,
    openGraph: {
      title: `${displayName} (@${userData.username}) | Amazing App`,
      description: `${displayName}'s profile on Amazing App - the native AI development environment for macOS.`,
    },
  };
}
