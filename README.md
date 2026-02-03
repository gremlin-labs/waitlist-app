# Waitlist Web 🌊

A full-featured waitlist and beta management platform with gamification, social integration, and referral tracking.

## Project Overview

This application provides a complete waitlist management system with the following capabilities:

### Core Features

- **User Authentication**: Magic link email authentication and OAuth (Google, GitHub)
- **Waitlist Management**: Users can join the waitlist and track their position
- **Gamification System**: Points-based ranking to encourage engagement
- **Social Connections**: Connect Twitter and Discord accounts to earn points
- **Referral System**: Users earn points for referring others
- **Onboarding Survey**: Collect user information about tools, experience, and hardware
- **Admin Dashboard**: Full admin interface for managing users, waitlist, and applications
- **Discord Bot Integration**: Real-time tracking of server joins/leaves with slash commands
- **Background Job Processing**: Scheduled tasks for rankings, social refresh, and cleanup
- **Beta User Dashboard**: Authorized users can access beta features and download desktop apps

### Points & Gamification

Users earn points through various actions to improve their waitlist ranking:

| Action | Points |
|--------|--------|
| **Twitter** | |
| Connect account | +5 |
| Follow account 1 | +10 |
| Follow account 2 | +10 |
| Follow account 3 | +10 |
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

Users are ranked by total points (descending), with signup time as a tiebreaker.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (Magic Link + OAuth)
- **Styling**: Tailwind CSS v4
- **Email**: Resend
- **Runtime**: Bun
- **Background Jobs**: BullMQ + Redis
- **Discord**: discord.js
- **UI Components**: Radix UI + shadcn/ui

## Prerequisites

### Required Software

- [Bun](https://bun.sh/) v1+ (package manager & runtime)
- [Node.js](https://nodejs.org/) 20+ (for some tooling)
- PostgreSQL (local or hosted)
- Redis (local or hosted, e.g., [Upstash](https://upstash.com/))

### Required Accounts/Services

| Service | Purpose |
|---------|---------|
| **Discord** | Bot for real-time server events and slash commands |
| **Twitter/X** | OAuth for social connection tracking |
| **Resend** | Email service for magic links |
| **PostgreSQL** | Database (can be local or hosted) |
| **Redis** | Background job queue (can be local or hosted) |
| **Google OAuth** (optional) | Alternative social login |
| **GitHub OAuth** (optional) | Alternative social login |

## Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/waitlist-web.git
cd waitlist-web
bun install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` with your credentials. All required variables are documented below:

#### Database Configuration

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/waitlist"
```

#### Better Auth Configuration

```bash
# Generate secret with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-generated-secret"

# Your app URL (used for callbacks)
BETTER_AUTH_URL="http://localhost:3000"
```

#### Public App URL

```bash
# Used for client-side links and callbacks
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Email Service (Resend)

```bash
# Get API key at: https://resend.com/api-keys
RESEND_API_KEY="re_..."
FROM_EMAIL="Waitlist <noreply@example.com>"
```

#### Google OAuth (Optional)

```bash
# Create credentials at: https://console.cloud.google.com/apis/credentials
# Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

#### GitHub OAuth (Optional)

```bash
# Create OAuth app at: https://github.com/settings/developers
# Add callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

#### Twitter/X OAuth 2.0

```bash
# Create app at: https://developer.twitter.com/en/portal/dashboard
# OAuth 2.0 with PKCE, add callback: http://localhost:3000/api/social/twitter/callback
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""

# Twitter account IDs to track follows (get from Twitter API or tools like tweeterid.com)
TWITTER_ID_ACCOUNT1=""
TWITTER_ID_ACCOUNT2=""
TWITTER_ID_ACCOUNT3=""
```

#### Discord OAuth 2.0

```bash
# Create app at: https://discord.com/developers/applications
# Add redirect URI: http://localhost:3000/api/social/discord/callback
DISCORD_CLIENT_ID=""
DISCORD_SECRET=""

# Your Discord server ID (right-click server → Copy Server ID with Developer Mode enabled)
DISCORD_GUILD_ID=""

# Discord invite URL for your server
DISCORD_INVITE_URL="https://discord.gg/yourserver"
```

#### Discord Bot Configuration

```bash
# Bot token from Discord Developer Portal (Bot section)
DISCORD_BOT_TOKEN=""

# Shared secret for bot <-> API webhook authentication
# Generate with: openssl rand -base64 32
BOT_API_SECRET=""

# API URL for the bot to call webhooks (use public URL in production)
WAITLIST_API_URL="http://localhost:3000"
```

#### Redis Configuration

```bash
# Local: redis://localhost:6379
# With auth: redis://:password@localhost:6379
# Upstash: rediss://default:xxx@xxx.upstash.io:6379
REDIS_URL="redis://localhost:6379"
```

#### Token Encryption

```bash
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=""
```

#### Analytics (Optional)

```bash
POSTHOG_KEY=""
POSTHOG_HOST=""
```

### 3. Database Setup

#### Option A: Push Schema (Development)

```bash
bun run db:push
```

This pushes the schema directly to the database without creating migration files. Good for development.

#### Option B: Generate and Run Migrations (Production)

```bash
# Generate migration from schema
bun run db:generate

# Run migrations
bun run db:migrate
```

#### Database Studio

View and edit your database with Drizzle Studio:

```bash
bun run db:studio
```

### 4. Discord Bot Setup

The Discord bot runs inside the Next.js app and provides real-time tracking and slash commands.

#### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application → Bot section → Add Bot
3. Enable **Server Members Intent** under Privileged Gateway Intents
4. Copy the Bot Token to `DISCORD_BOT_TOKEN` in `.env.local`

#### Step 2: Invite Bot to Server

1. OAuth2 → URL Generator
2. Scopes: `bot`, `applications.commands`
3. Permissions: View Channels, Send Messages, Use Slash Commands
4. Open generated URL to invite bot to your server

#### Step 3: Register Slash Commands

```bash
bun run discord:register
```

This registers the following slash commands:
- `/verify` - Check if Discord is linked to your waitlist account
- `/leaderboard` - View top 10 waitlist rankings
- `/rank` - Check your personal rank and points
- `/invite` - Get your referral link

#### Step 4: Start the App

```bash
bun run dev
```

You'll see in the console:
```
🌊 Discord Bot ready as Amazing App#1234
📡 Connected to 1 guild(s)
```

### 5. Twitter OAuth Setup

1. Create app at [Twitter Developer Portal](https://developer.twitter.com/)
2. Enable OAuth 2.0 with PKCE
3. Add callback URL: `http://localhost:3000/api/social/twitter/callback`
4. Add credentials to `.env.local`:
   ```bash
   TWITTER_CLIENT_ID=""
   TWITTER_CLIENT_SECRET=""
   TWITTER_ID_ACCOUNT1=""
   TWITTER_ID_ACCOUNT2=""
   TWITTER_ID_ACCOUNT3=""
   ```

### 6. Email Service Setup

1. Sign up at [Resend](https://resend.com/)
2. Get API key
3. Add to `.env.local`:
   ```bash
   RESEND_API_KEY="re_..."
   FROM_EMAIL="Waitlist <noreply@example.com>"
   ```

## Running the App

### Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

The development server includes:
- Hot reload with Turbopack
- Discord bot running
- BullMQ workers processing background jobs
- Scheduled tasks running

### Production Build

```bash
bun run build
bun run start
```

### Docker

```bash
docker build -t waitlist-web .
docker run -p 3000:3000 --env-file .env.local waitlist-web
```

## Database Management

### Generating Migrations

```bash
bun run db:generate
```

This creates a new migration file in `src/db/migrations/` based on schema changes.

### Running Migrations

```bash
bun run db:migrate
```

### Pushing Schema (Development Only)

```bash
bun run db:push
```

Directly pushes schema changes without creating migration files.

### Viewing Database

```bash
bun run db:studio
```

Opens Drizzle Studio at http://localhost:4983

### Cleaning Database

```bash
bun run db:clean --force
```

⚠️ **Warning**: This deletes ALL data from the database while preserving schema.

## Scripts Documentation

### Database Scripts

#### `db:clean` - Clean Database

Wipes all data from the database while preserving schema.

```bash
bun run db:clean --force
```

Use `--force` flag to confirm deletion without prompt.

### Admin Scripts

#### `admin:promote` - Promote User to Admin

Promotes a user to admin status.

```bash
bun run admin:promote user@example.com
```

#### `admin:demote` - Demote Admin

Removes admin status from a user.

```bash
bun run admin:demote user@example.com
```

#### `admin:list` - List Admin Users

Lists all admin users.

```bash
bun run admin:list
```

#### `admin:activate` - Activate Beta Access

Activates beta access for a user.

```bash
bun run admin:activate user@example.com
```

#### `admin:invite` - Send Beta Invite

Sends a beta invitation email to a user.

```bash
bun run admin:invite user@example.com
```

### Discord Scripts

#### `discord:register` - Register Discord Commands

Registers Discord slash commands to your bot.

```bash
bun run discord:register
```

Commands are registered to your guild (instant) if `DISCORD_GUILD_ID` is set, or globally (up to 1 hour) otherwise.

### Queue Management Scripts

#### `queue:stats` - View Queue Statistics

Shows statistics for all background job queues.

```bash
bun run queue:stats
```

Output includes active, waiting, completed, failed, and delayed job counts for:
- `rankings` - User ranking calculations
- `social-refresh` - Social connection refreshes
- `cleanup` - Cleanup tasks

#### `queue:clear` - Clear a Queue

Clears all jobs from a specific queue.

```bash
bun run queue:clear rankings
bun run queue:clear social-refresh
bun run queue:clear cleanup
```

#### `queue:failed` - View Failed Jobs

Shows the last 10 failed jobs.

```bash
bun run queue:failed rankings
bun run queue:failed
```

### Seeding Scripts

#### `seed:users` - Create Demo Users

Creates realistic-looking demo users to populate the waitlist.

```bash
bun run seed:users 50    # Create 50 demo users
bun run seed:users 100   # Create 100 demo users
```

Users are created with:
- Random names from CSV files
- Realistic usernames
- Random point totals
- Random survey responses
- Random social connections

#### `unseed:users` - Remove Demo Users

Removes all demo users (emails matching `demo-*@example.com`).

```bash
bun run unseed:users           # Remove with confirmation
bun run unseed:users --force   # Remove without confirmation
bun run unseed:users --dry-run # Show what would be deleted
```

## Architecture Overview

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard routes
│   │   ├── admin/         # Admin pages
│   │   │   ├── analytics/ # Analytics dashboard
│   │   │   ├── applications/ # Job applications
│   │   │   ├── users/     # User management
│   │   │   └── waitlist/  # Waitlist management
│   │   └── layout.tsx     # Admin layout
│   ├── (auth)/            # Authentication pages
│   │   ├── auth/
│   │   │   ├── signin/    # Sign in page
│   │   │   ├── signup/    # Sign up page
│   │   │   └── verify/    # Email verification
│   │   └── layout.tsx
│   ├── (dashboard)/       # User dashboard
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── apply/         # Application form
│   │   ├── onboarding/    # Onboarding survey
│   │   └── settings/      # User settings
│   ├── (marketing)/       # Public pages
│   │   ├── benchmarks/    # Benchmarks page
│   │   ├── careers/       # Careers page
│   │   ├── ecosystem/     # Ecosystem page
│   │   ├── philosophy/    # Philosophy page
│   │   ├── privacy/       # Privacy policy
│   │   └── terms/         # Terms of service
│   ├── [username]/        # Public user profile
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── social/        # Social connection endpoints
│   │   ├── webhooks/      # Webhook endpoints
│   │   └── ...            # Other API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── marketing/         # Marketing page components
│   ├── survey/            # Survey components
│   └── ui/                # Base UI components (shadcn-style)
├── db/                    # Database
│   ├── schema/            # Drizzle schema definitions
│   │   ├── auth.ts        # User and session schemas
│   │   ├── surveys.ts     # Survey response schemas
│   │   ├── points.ts      # Points and ranking schemas
│   │   ├── referrals.ts   # Referral schemas
│   │   ├── social-connections.ts # Twitter/Discord connections
│   │   ├── applications.ts # Job application schemas
│   │   └── index.ts       # Schema exports
│   └── migrations/        # Generated migrations
├── lib/                   # Utilities & services
│   ├── auth.ts            # Better Auth configuration
│   ├── auth-client.ts     # Client-side auth helpers
│   ├── discord-bot.ts     # Discord bot implementation
│   ├── discord.ts         # Discord OAuth helpers
│   ├── twitter.ts         # Twitter OAuth helpers
│   ├── points.ts          # Points and ranking logic
│   ├── queue/             # Background job processing
│   │   ├── index.ts       # Queue setup
│   │   ├── scheduler.ts   # Scheduled jobs
│   │   ├── workers.ts     # Job workers
│   │   └── processors/    # Job processors
│   └── utils.ts           # Utility functions
├── constants/             # App constants
│   ├── countries.ts       # Country list
│   └── survey-tools.ts    # Tool options
├── names/                 # Name lists for seeding
│   ├── first-names.csv
│   └── last-names.csv
└── words/                 # Word lists for username generation
    ├── action.txt
    ├── adjectives.txt
    └── nouns.txt
```

### Key Libraries & Technologies

| Category | Library | Purpose |
|----------|---------|---------|
| Framework | Next.js 16 | React framework with App Router |
| Database | Drizzle ORM | Type-safe SQL queries |
| Auth | Better Auth | Authentication & session management |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | Radix UI | Accessible component primitives |
| Background Jobs | BullMQ | Job queue with Redis |
| Discord | discord.js | Discord bot library |
| Email | Resend | Email service |
| Validation | Zod | Schema validation |

### Background Jobs

The app uses BullMQ + Redis for background job processing:

| Queue | Purpose | Schedule |
|-------|---------|----------|
| `rankings` | Recalculate user rankings | Every 5 minutes |
| `social-refresh` | Refresh Twitter/Discord connections | Every 6 hours |
| `cleanup` | Clean up expired tokens | Daily at 3 AM |

### Discord Bot

The Discord bot runs inside the Next.js app via instrumentation and provides:

- **Real-time tracking**: Detects server joins/leaves and updates points
- **Slash commands**: `/verify`, `/leaderboard`, `/rank`, `/invite`
- **Webhook integration**: Communicates with the API via authenticated webhooks

## Development Workflow

### Linting

```bash
bun run lint
```

Uses Next.js ESLint configuration.

### Type Checking

```bash
bun tsc
```

Runs TypeScript compiler to check for type errors.

### Development Server

```bash
bun run dev
```

Starts the development server with:
- Turbopack for fast refresh
- Hot reload
- Discord bot running
- BullMQ workers processing
- Scheduled tasks running

### Testing

Currently, this project does not have automated tests. Tests can be added using frameworks like Vitest or Jest.

## Admin Dashboard

Access the admin dashboard at `/admin` (requires admin privileges).

### Admin Features

- **Analytics**: View waitlist statistics and user engagement
- **Applications**: Manage job applications
- **Users**: View and manage user accounts
- **Waitlist**: View and manage waitlist entries
- **Health**: Check system health

### Promote First Admin

After setting up the app, promote your first user to admin:

```bash
bun run admin:promote your-email@example.com
```

Then sign in with that account to access the admin dashboard.

## Deployment

### Self-Hosted (Coolify, Railway, etc.)

1. Set all environment variables
2. Build: `bun run build`
3. Start: `bun run start`

The Discord bot and background workers run automatically with the app.

### Environment Variables for Production

Make sure to update these for production:

```bash
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
WAITLIST_API_URL="https://your-domain.com"
```

### Dockerfile

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

## License

Proprietary — This Company © 2026
