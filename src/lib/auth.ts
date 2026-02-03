import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";
import { generateReferralCode } from "./utils";
import { generateUniqueUsername } from "./username";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  emailAndPassword: {
    enabled: false, // Magic link only
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "Waitlist <noreply@example.com>",
          to: email,
          subject: "Sign in to Waitlist",
          html: magicLinkEmailTemplate(url),
        });
      },
    }),
  ],

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
      betaStatus: {
        type: "string",
        defaultValue: "waitlist",
      },
      referralCode: {
        type: "string",
        defaultValue: () => generateReferralCode(),
      },
      referredBy: {
        type: "string",
        required: false,
      },
      surveyCompletedAt: {
        type: "date",
        required: false,
      },
      betaInvitedAt: {
        type: "date",
        required: false,
      },
      betaActivatedAt: {
        type: "date",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Generate a unique username if not provided
          if (!user.username) {
            const username = await generateUniqueUsername();
            return {
              data: {
                ...user,
                username,
              },
            };
          }
          return { data: user };
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
});

/**
 * Magic link email template - Dark mode vibes
 */
function magicLinkEmailTemplate(url: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <meta name="supported-color-schemes" content="dark">
      <title>Sign in to Amazing App</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050508; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050508;">
        <tr>
          <td align="center" style="padding: 48px 24px;">
            <!-- Logo -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px;">
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <span style="font-size: 14px; font-weight: 700; letter-spacing: 2px; color: #ff2d7a; text-transform: uppercase;">AMAZING APP</span>
                </td>
              </tr>
            </table>
            
            <!-- Main Card -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; background-color: #0a0a12; border: 1px solid #1e1e2e; border-radius: 12px;">
              <tr>
                <td style="padding: 48px 40px;">
                  <!-- Emoji + Title -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 24px;">
                        <span style="font-size: 48px;">🌊</span>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #f5f5f7; line-height: 1.2;">
                          Your magic link is here
                        </h1>
                        <p style="margin: 0 0 32px 0; font-size: 16px; color: #8888a0; line-height: 1.5;">
                          Click below to sign in to Amazing App
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding-bottom: 32px;">
                        <a href="${url}" target="_blank" style="display: inline-block; background-color: #ff2d7a; color: #050508; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Sign In</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Divider -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="border-top: 1px solid #1e1e2e; padding-top: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #555566; line-height: 1.6; text-align: center;">
                          This link expires in 10 minutes.<br>
                          If you didn't request this, the vibes simply weren't aligned.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Footer -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px;">
              <tr>
                <td align="center" style="padding-top: 32px;">
                  <p style="margin: 0; font-size: 12px; color: #444455; font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;">
                    — This Company 😈
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

export type Auth = typeof auth;
