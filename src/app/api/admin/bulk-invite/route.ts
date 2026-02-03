import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, inArray, isNotNull, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST: Bulk invite users by criteria
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      criteria,
      limit = 10,
      sendEmail = true,
      userIds, // Optional: specific user IDs to invite
    } = body;

    let usersToInvite;

    if (userIds && userIds.length > 0) {
      // Invite specific users
      usersToInvite = await db.query.user.findMany({
        where: and(
          inArray(user.id, userIds),
          eq(user.betaStatus, "waitlist")
        ),
      });
    } else {
      // Find users matching criteria
      const conditions = [eq(user.betaStatus, "waitlist")];

      if (criteria?.surveyCompleted) {
        conditions.push(isNotNull(user.surveyCompletedAt));
      }

      usersToInvite = await db.query.user.findMany({
        where: and(...conditions),
        limit,
        orderBy: (user, { asc }) => [asc(user.createdAt)], // FIFO
      });
    }

    if (usersToInvite.length === 0) {
      return NextResponse.json({
        success: true,
        invited: 0,
        message: "No users matching criteria",
      });
    }

    // Update all users to invited status
    const userIdsToUpdate = usersToInvite.map((u) => u.id);
    
    await db
      .update(user)
      .set({
        betaStatus: "invited",
        betaInvitedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(inArray(user.id, userIdsToUpdate));

    // Send emails in batches (if enabled)
    let emailsSent = 0;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://waitlist.example.com";
    if (sendEmail && process.env.RESEND_API_KEY) {
      for (const user of usersToInvite) {
        try {
          await resend.emails.send({
            from: process.env.FROM_EMAIL || "Waitlist <noreply@example.com>",
            to: user.email,
            subject: "😈 You're in. The vibes have aligned.",
            html: bulkInviteEmailTemplate(user.name || "Vibe Seeker", baseUrl),
          });
          emailsSent++;
          
          // Rate limit: wait 100ms between emails
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (emailError) {
          console.error(`Failed to send invite to ${user.email}:`, emailError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      invited: usersToInvite.length,
      emailsSent,
      users: usersToInvite.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
      })),
    });
  } catch (error) {
    console.error("Bulk invite error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk invite" },
      { status: 500 }
    );
  }
}

function bulkInviteEmailTemplate(name: string, baseUrl: string): string {
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
                  <span style="font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #ff2d7a; text-transform: uppercase;">AMAZING APP</span>
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
                              <span style="color: #ff2d7a; font-weight: 600;">1.</span> Download the Amazing App app from your dashboard
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
                    — This Company
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
