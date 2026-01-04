import { NextRequest, NextResponse } from "next/server";
import { validateUsername, normalizeUsername } from "@/lib/username";

/**
 * GET /api/username/check?username=xxx
 * Check if a username is available and valid
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { available: false, error: "Username is required" },
      { status: 400 }
    );
  }

  const validation = await validateUsername(username);

  return NextResponse.json({
    available: validation.valid,
    error: validation.error || null,
    normalized: normalizeUsername(username),
  });
}
