import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, betaSurveys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./settings-form";

async function getSettingsData(userId: string) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      username: true,
      createdAt: true,
      referralCode: true,
    },
  });

  const surveyData = await db.query.betaSurveys.findFirst({
    where: eq(betaSurveys.userId, userId),
    columns: {
      country: true,
      region: true,
      timezone: true,
    },
  });

  return {
    user: userData,
    location: surveyData,
  };
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const data = await getSettingsData(session.user.id);

  if (!data.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-fg-primary mb-2">Settings</h1>
      <p className="text-fg-muted mb-8">Manage your account preferences</p>

      <SettingsForm
        initialData={{
          name: data.user.name || "",
          email: data.user.email,
          username: data.user.username || "",
          country: data.location?.country || "",
          region: data.location?.region || "",
          timezone: data.location?.timezone || "",
          referralCode: data.user.referralCode || "",
          memberSince: data.user.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
