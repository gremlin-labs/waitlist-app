import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SurveyForm } from "@/components/survey/survey-form";
import { getGeoFromHeaders } from "@/lib/geo";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingPage() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user already completed survey
  const userData = await db.query.user.findFirst({
    where: eq(userTable.id, session.user.id),
    columns: {
      surveyCompletedAt: true,
    },
  });

  // If survey already completed, redirect to dashboard
  if (userData?.surveyCompletedAt) {
    redirect("/dashboard");
  }

  // Get geo data from Vercel headers (or fallback for local dev)
  const headersList = await headers();
  const geoData = getGeoFromHeaders(headersList);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-fg-primary mb-3">
          Welcome to the waitlist 🌊
        </h1>
        <p className="text-fg-muted max-w-md mx-auto">
          Help us understand you better so we can prioritize your access and 
          tailor Vibe Mode to your needs.
        </p>
      </div>

      <SurveyForm
        initialGeoData={{
          country: geoData.country,
          region: geoData.region,
          timezone: geoData.timezone,
        }}
      />
    </div>
  );
}
