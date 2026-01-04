import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST: Send beta invite to a user
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, email, sendEmail = true } = body;

    // Find user by ID or email
    const foundUser = userId
      ? await db.query.user.findFirst({ where: eq(userTable.id, userId) })
      : email
        ? await db.query.user.findFirst({ where: eq(userTable.email, email) })
        : null;

    if (!foundUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user status to invited
    const [updatedUser] = await db
      .update(userTable)
      .set({
        betaStatus: "invited",
        betaInvitedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, foundUser.id))
      .returning();

    // Send invite email
    if (sendEmail && process.env.RESEND_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://vibemode.ai";
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "Vibe Mode <hey@vibemode.ai>",
          to: foundUser.email,
          subject: "😈 You're in. The vibes have aligned.",
          html: betaInviteEmailTemplate(foundUser.name || "Vibe Seeker", baseUrl),
        });
      } catch (emailError) {
        console.error("Failed to send invite email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin invite error:", error);
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    );
  }
}

function betaInviteEmailTemplate(name: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
    </head>
    <body style="margin: 0; padding: 0; background-color: #050508; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050508;">
        <tr>
          <td align="center" style="padding: 48px 24px;">
            <!-- Logo -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <span style="font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #ff2d7a; text-transform: uppercase;">VIBE MODE</span>
                </td>
              </tr>
            </table>
            
            <!-- Main Card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; background-color: #0a0a12; border: 1px solid #1e1e2e; border-radius: 12px;">
              <tr>
                <td style="padding: 48px 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <span style="font-size: 56px;">😈</span>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #f5f5f7;">
                          ${name}, you're in.
                        </h1>
                        <p style="margin: 0 0 8px 0; font-size: 16px; color: #8888a0; line-height: 1.6;">
                          The vibes have aligned. Your beta access is approved.
                        </p>
                        <p style="margin: 0 0 32px 0; font-size: 16px; color: #8888a0; line-height: 1.6;">
                          You're about to experience what coding feels like when you stop trying to understand everything and start trusting the flow.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 32px;">
                        <a href="${baseUrl}/dashboard" target="_blank" style="display: inline-block; background-color: #ff2d7a; color: #050508; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Enter Your Dashboard →</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Getting Started -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #1e1e2e; padding-top: 24px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #f5f5f7; text-transform: uppercase; letter-spacing: 1px;">Getting Started</h3>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #8888a0;">
                              <span style="color: #ff2d7a; font-weight: 600;">1.</span> Download the Vibe Mode app from your dashboard
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #8888a0;">
                              <span style="color: #ff2d7a; font-weight: 600;">2.</span> Authorize your device with a one-time token
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; color: #8888a0;">
                              <span style="color: #ff2d7a; font-weight: 600;">3.</span> Open your first project and start vibing
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Footer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px;">
              <tr>
                <td align="center" style="padding-top: 32px;">
                  <p style="margin: 0; font-size: 13px; color: #555566;">
                    Built from scratch. No forks. No compromises.
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #444455; font-family: 'SF Mono', monospace;">
                    — gremlinlabs
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
