# Vibe Mode Web 🌊

The waitlist and beta management platform for Vibe Mode — the post-comprehension coding experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (Magic Link + Google OAuth)
- **Styling**: Tailwind CSS v4
- **Email**: Resend
- **Runtime**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager & runtime)
- PostgreSQL (local or hosted)
- Node.js 20+ (for some tooling)

### 1. Clone & Install

```bash
git clone https://github.com/gremlinlabs/vibemode-web.git
cd vibemode-web
bun install
```

### 2. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Required
DATABASE_URL="postgresql://postgres:password@localhost:5432/vibemode"
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (for magic links)
RESEND_API_KEY="re_..."
FROM_EMAIL="Vibe Mode <hey@vibemode.ai>"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Database Setup

```bash
# Push schema to database
bun run db:push

# Or generate and run migrations
bun run db:generate
bun run db:migrate
```

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard
│   ├── (auth)/            # Auth pages (signin, signup, verify)
│   ├── (dashboard)/       # User dashboard & settings
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── marketing/         # Marketing page components
│   ├── survey/            # Onboarding survey components
│   └── ui/                # Base UI components (shadcn-style)
├── db/                    # Database
│   ├── schema/            # Drizzle schema definitions
│   └── migrations/        # Generated migrations
├── lib/                   # Utilities & services
│   ├── auth.ts            # Better Auth configuration
│   ├── discord-bot.ts     # Discord bot (integrated)
│   ├── points.ts          # Gamification points service
│   ├── twitter.ts         # Twitter OAuth helpers
│   └── discord.ts         # Discord OAuth helpers
└── constants/             # App constants
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run db:push` | Push schema changes to DB |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run admin:promote <email>` | Promote user to admin |
| `bun run admin:list` | List all admin users |
| `bun run discord:register` | Register Discord slash commands |

---

## Waitlist Gamification

The waitlist uses a points-based ranking system to encourage social engagement.

### Points Structure

| Action | Points |
|--------|--------|
| **Twitter** | |
| Connect account | +5 |
| Follow @vibemodeai | +10 |
| Follow @gremlinlabs | +10 |
| Follow @productgremlin | +10 |
| Unfollow (any) | -10 |
| **Discord** | |
| Connect account | +5 |
| Join server | +20 |
| Leave server | -20 |
| **Referrals** | |
| Invite clicked | +1 (max 100) |
| Invite signup | +5 |
| Invite activated | +10 |
| **Other** | |
| Complete survey | +15 |

### Ranking Algorithm

Users are ranked by:
1. Total points (descending)
2. Signup time as tiebreaker (earlier = higher)

---

## Discord Bot

The Discord bot runs inside the Next.js app (via instrumentation) and provides:

- **Real-time tracking**: Detects server joins/leaves and updates points
- **Slash commands**: `/verify`, `/leaderboard`, `/rank`, `/invite`

### Setup

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application → Bot section → Add Bot
   - Enable **Server Members Intent** under Privileged Gateway Intents
   - Copy the Bot Token

2. **Invite Bot to Server**
   - OAuth2 → URL Generator
   - Scopes: `bot`, `applications.commands`
   - Permissions: View Channels, Send Messages, Use Slash Commands
   - Open generated URL to invite

3. **Configure Environment**
   
   Add to `.env.local`:
   ```bash
   DISCORD_BOT_TOKEN="your-bot-token"
   BOT_API_SECRET="$(openssl rand -base64 32)"
   ```

4. **Register Slash Commands** (one-time)
   ```bash
   bun run discord:register
   ```

5. **Start the App**
   ```bash
   bun run dev
   ```
   
   You'll see in the console:
   ```
   🌊 Discord Bot ready as Vibe Mode#1234
   📡 Connected to 1 guild(s)
   ```

### Slash Commands

| Command | Description |
|---------|-------------|
| `/verify` | Check if Discord is linked to Vibe Mode |
| `/leaderboard` | View top 10 waitlist rankings |
| `/rank` | Check your personal rank and points |
| `/invite` | Get your referral link |

---

## Twitter Integration

### Setup

1. Create app at [Twitter Developer Portal](https://developer.twitter.com/)
2. Enable OAuth 2.0 with PKCE
3. Add callback URL: `http://localhost:3000/api/social/twitter/callback`
4. Add to `.env.local`:
   ```bash
   TWITTER_CLIENT_ID=""
   TWITTER_CLIENT_SECRET=""
   TWITTER_ID_VIBEMODEAI=""
   TWITTER_ID_GREMLINLABS=""
   TWITTER_ID_PRODUCTGREMLIN=""
   ```

---

## Admin Dashboard

Access at `/admin` (requires admin privileges).

### Promote a User to Admin

```bash
bun run admin:promote user@example.com
```

### Other Admin Commands

```bash
bun run admin:demote user@example.com   # Remove admin
bun run admin:list                       # List all admins
bun run admin:activate user@example.com  # Activate beta access
bun run admin:invite user@example.com    # Send beta invite
```

---

## Deployment

### Self-Hosted (Coolify, Railway, etc.)

1. Set all environment variables
2. Build: `bun run build`
3. Start: `bun run start`

The Discord bot runs automatically with the app.

### Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["bun", "run", "start"]
```

---

## License

Proprietary — GremlinLabs © 2024
