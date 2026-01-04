import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ApplicationForm } from "./application-form";

const VALID_JOBS = ["zig-ml", "zig-perf", "swiftui", "fullstack", "marketing"] as const;
type ValidJob = (typeof VALID_JOBS)[number];

function isValidJob(job: string | null): job is ValidJob {
  return job !== null && VALID_JOBS.includes(job as ValidJob);
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not logged in - redirect to signin with callback
  if (!session?.user) {
    const params = await searchParams;
    const jobParam = params.job ? `&job=${params.job}` : "";
    redirect(`/auth/signin?callbackUrl=/apply${jobParam}`);
  }

  // Get job from query param or cookie
  const params = await searchParams;
  const cookieStore = await cookies();
  const jobFromCookie = cookieStore.get("apply_job")?.value;
  const selectedJob = params.job || jobFromCookie || null;

  // Validate job
  if (!isValidJob(selectedJob)) {
    redirect("/careers");
  }

  // Check if user already has an application for this job
  const existingApplication = await db.query.jobApplications.findFirst({
    where: and(
      eq(jobApplications.userId, session.user.id),
      eq(jobApplications.jobRole, selectedJob)
    ),
  });

  if (existingApplication) {
    redirect("/apply/success?already=true");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-pink font-mono text-sm mb-2">JOIN THE TEAM</p>
        <h1 className="text-3xl font-bold text-fg-primary mb-2">
          Apply to gremlinlabs
        </h1>
        <p className="text-fg-muted">
          Most job applications suck. This one doesn&apos;t.
        </p>
      </div>

      <ApplicationForm 
        selectedJob={selectedJob} 
        userEmail={session.user.email}
        userName={session.user.name || undefined}
      />
    </div>
  );
}
