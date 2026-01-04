import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { betaSurveys, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getClientIP } from "@/lib/geo";
import { MAC_MODELS } from "@/constants/survey-tools";

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const headersList = await headers();

    // Find the mac chip from the selected model
    const selectedMac = MAC_MODELS.find((m) => m.id === body.macModel);
    const macChip = selectedMac?.chip || "other";

    // Insert or update survey
    const existingSurvey = await db.query.betaSurveys.findFirst({
      where: eq(betaSurveys.userId, session.user.id),
    });

    const surveyData = {
      vibeCodeExperience: body.vibeCodeExperience,
      toolsUsed: body.toolsUsed,
      otherToolText: body.otherToolText || null,
      primaryTool: body.primaryTool,
      jobRole: body.jobRole,
      otherJobRole: body.otherJobRole || null,
      yearsExperience: body.yearsExperience,
      macModel: body.macModel,
      macChip: macChip,
      ramGb: body.ramGb ? parseInt(body.ramGb) : null,
      country: body.country,
      region: body.region,
      timezone: body.timezone,
      excitedAbout: body.excitedAbout,
      biggestPainPoint: body.biggestPainPoint,
      howHeardAboutUs: body.howHeardAboutUs,
      ipAddress: getClientIP(headersList),
      userAgent: headersList.get("user-agent") || null,
      completedAt: new Date(),
    };

    if (existingSurvey) {
      await db
        .update(betaSurveys)
        .set(surveyData)
        .where(eq(betaSurveys.id, existingSurvey.id));
    } else {
      await db.insert(betaSurveys).values({
        userId: session.user.id,
        ...surveyData,
      });
    }

    // Update user's survey completion timestamp
    await db
      .update(user)
      .set({ surveyCompletedAt: new Date() })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const survey = await db.query.betaSurveys.findFirst({
      where: eq(betaSurveys.userId, session.user.id),
    });

    return NextResponse.json({ survey });
  } catch (error) {
    console.error("Survey fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey" },
      { status: 500 }
    );
  }
}
