import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, betaSurveys } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for settings updates
const settingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  country: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  timezone: z.string().max(100).optional(),
});

/**
 * GET /api/settings - Get current user settings
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user data
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      username: true,
      createdAt: true,
      referralCode: true,
    },
  });

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get survey data (for location)
  const surveyData = await db.query.betaSurveys.findFirst({
    where: eq(betaSurveys.userId, session.user.id),
    columns: {
      country: true,
      region: true,
      timezone: true,
    },
  });

  return NextResponse.json({
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      createdAt: userData.createdAt,
      referralCode: userData.referralCode,
    },
    location: {
      country: surveyData?.country || null,
      region: surveyData?.region || null,
      timezone: surveyData?.timezone || null,
    },
  });
}

/**
 * PATCH /api/settings - Update user settings
 */
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = settingsSchema.parse(body);

    // Update user table (name)
    if (validated.name !== undefined) {
      await db
        .update(user)
        .set({
          name: validated.name,
          updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id));
    }

    // Update survey table (location)
    if (
      validated.country !== undefined ||
      validated.region !== undefined ||
      validated.timezone !== undefined
    ) {
      // Check if survey exists
      const existingSurvey = await db.query.betaSurveys.findFirst({
        where: eq(betaSurveys.userId, session.user.id),
        columns: { id: true },
      });

      if (existingSurvey) {
        // Update existing survey
        await db
          .update(betaSurveys)
          .set({
            country: validated.country,
            region: validated.region,
            timezone: validated.timezone,
          })
          .where(eq(betaSurveys.userId, session.user.id));
      } else {
        // Create minimal survey record for location
        await db.insert(betaSurveys).values({
          userId: session.user.id,
          country: validated.country,
          region: validated.region,
          timezone: validated.timezone,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
