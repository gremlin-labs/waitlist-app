import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Reserved words that cannot be used as usernames
// These are routes, features, or words we might use in the future
export const RESERVED_USERNAMES = new Set([
  // Auth routes
  "auth",
  "signin",
  "sign-in",
  "signup",
  "sign-up",
  "login",
  "logout",
  "register",
  "verify",
  "reset",
  "forgot",
  "password",
  "oauth",
  "callback",
  
  // App routes
  "admin",
  "dashboard",
  "settings",
  "profile",
  "account",
  "onboarding",
  "survey",
  
  // Marketing routes
  "philosophy",
  "ecosystem",
  "benchmarks",
  "pricing",
  "about",
  "blog",
  "careers",
  "contact",
  "press",
  "privacy",
  "terms",
  "legal",
  "docs",
  "documentation",
  "help",
  "support",
  "faq",
  
  // API and system
  "api",
  "webhooks",
  "static",
  "assets",
  "images",
  "uploads",
  "downloads",
  "public",
  "private",
  "internal",
  
  // Brand/product
  "waitlist",
  "wait-list",
  "thiscompany",
  "gremlin-labs",
  
  // Common reserved
  "www",
  "mail",
  "email",
  "root",
  "system",
  "null",
  "undefined",
  "admin",
  "administrator",
  "moderator",
  "mod",
  "staff",
  "team",
  "official",
  "bot",
  "robot",
  "test",
  "demo",
  "example",
  "sample",
  
  // Social/features
  "feed",
  "explore",
  "search",
  "discover",
  "trending",
  "popular",
  "featured",
  "notifications",
  "messages",
  "inbox",
  "invite",
  "referral",
  "referrals",
  
  // Misc
  "new",
  "edit",
  "create",
  "delete",
  "remove",
  "update",
  "manage",
  "config",
  "configuration",
]);

// Word lists - loaded once and cached
let adjectives: string[] = [];
let nouns: string[] = [];
let actions: string[] = [];
let wordListsLoaded = false;

// Fallback words if files can't be loaded
const fallbackAdjectives = [
  "swift", "bright", "calm", "bold", "warm", "cool", "fresh", "wild",
  "quick", "smart", "happy", "lucky", "clever", "brave", "gentle", "keen",
  "noble", "proud", "silent", "golden", "silver", "cosmic", "stellar", "lunar"
];

const fallbackNouns = [
  "wolf", "fox", "bear", "eagle", "hawk", "falcon", "otter", "lynx",
  "river", "forest", "mountain", "ocean", "storm", "thunder", "star", "comet",
  "crystal", "diamond", "phoenix", "dragon", "tiger", "panther", "dolphin", "raven"
];

const fallbackActions = [
  "running", "flying", "dancing", "coding", "building", "creating", "exploring",
  "racing", "climbing", "swimming", "dreaming", "soaring", "gliding", "blazing"
];

/**
 * Parse a comma-separated word list file
 */
function parseWordList(content: string): string[] {
  return content
    .split(",")
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0 && word.length <= 12);
}

/**
 * Load word lists from files (cached)
 */
function loadWordLists(): void {
  if (wordListsLoaded) return;

  try {
    const wordsDir = path.join(process.cwd(), "src", "words");
    
    const adjectivesContent = fs.readFileSync(path.join(wordsDir, "adjectives.txt"), "utf-8");
    const nounsContent = fs.readFileSync(path.join(wordsDir, "nouns.txt"), "utf-8");
    const actionsContent = fs.readFileSync(path.join(wordsDir, "action.txt"), "utf-8");
    
    adjectives = parseWordList(adjectivesContent);
    nouns = parseWordList(nounsContent);
    actions = parseWordList(actionsContent);
    
    // Fallback if parsing results in empty arrays
    if (adjectives.length === 0) adjectives = fallbackAdjectives;
    if (nouns.length === 0) nouns = fallbackNouns;
    if (actions.length === 0) actions = fallbackActions;
    
    wordListsLoaded = true;
    console.log(`Loaded word lists: ${adjectives.length} adjectives, ${nouns.length} nouns, ${actions.length} actions`);
  } catch (error) {
    console.warn("Failed to load word lists, using fallbacks:", error);
    adjectives = fallbackAdjectives;
    nouns = fallbackNouns;
    actions = fallbackActions;
    wordListsLoaded = true;
  }
}

/**
 * Get a random element from an array
 */
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a 2-4 digit random number suffix
 */
function randomNumberSuffix(): string {
  const num = Math.floor(Math.random() * 9000 + 1000);
  const digits = Math.floor(Math.random() * 3) + 2; // 2-4 digits
  return num.toString().slice(-digits);
}

/**
 * Normalize a username (lowercase, no @ prefix)
 */
export function normalizeUsername(username: string): string {
  return username.replace(/^@/, "").toLowerCase().trim();
}

/**
 * Format username for display with @ prefix
 */
export function formatUsernameForDisplay(username: string): string {
  return `@${normalizeUsername(username)}`;
}

/**
 * Check if a username exists in the database
 */
export async function usernameExists(username: string): Promise<boolean> {
  const normalized = normalizeUsername(username);
  
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(sql`LOWER(${user.username}) = ${normalized}`)
    .limit(1);
  
  return existing.length > 0;
}

/**
 * Validate username format
 */
export function validateUsernameFormat(username: string): { valid: boolean; error?: string } {
  const normalized = normalizeUsername(username);
  
  // Length: 3-30 characters
  if (normalized.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }
  if (normalized.length > 30) {
    return { valid: false, error: "Username must be 30 characters or less" };
  }
  
  // Characters: lowercase letters, numbers, hyphens only
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return { valid: false, error: "Username can only contain lowercase letters, numbers, and hyphens" };
  }
  
  // No leading/trailing hyphens
  if (normalized.startsWith("-") || normalized.endsWith("-")) {
    return { valid: false, error: "Username cannot start or end with a hyphen" };
  }
  
  // No consecutive hyphens
  if (normalized.includes("--")) {
    return { valid: false, error: "Username cannot contain consecutive hyphens" };
  }
  
  // Check reserved words
  if (RESERVED_USERNAMES.has(normalized)) {
    return { valid: false, error: "This username is reserved" };
  }
  
  return { valid: true };
}

/**
 * Full username validation (format + availability)
 */
export async function validateUsername(username: string): Promise<{ valid: boolean; error?: string }> {
  const formatCheck = validateUsernameFormat(username);
  if (!formatCheck.valid) {
    return formatCheck;
  }
  
  const exists = await usernameExists(username);
  if (exists) {
    return { valid: false, error: "This username is already taken" };
  }
  
  return { valid: true };
}

/**
 * Generate a unique username using 3-phase fallback strategy
 * Phase 1: adjective-noun (3 attempts)
 * Phase 2: action-adjective-noun (3 attempts)
 * Phase 3: action-adjective-noun-number (10 attempts)
 * Ultimate fallback: adjective-noun-timestamp
 */
export async function generateUniqueUsername(): Promise<string> {
  loadWordLists();
  
  const maxAttempts = 3;
  
  // Phase 1: Try adjective-noun (shortest, most memorable)
  for (let i = 0; i < maxAttempts; i++) {
    const username = `${randomElement(adjectives)}-${randomElement(nouns)}`;
    
    // Skip if reserved
    if (RESERVED_USERNAMES.has(username)) continue;
    
    if (!(await usernameExists(username))) {
      return username;
    }
  }
  
  // Phase 2: Try action-adjective-noun (more unique)
  for (let i = 0; i < maxAttempts; i++) {
    const username = `${randomElement(actions)}-${randomElement(adjectives)}-${randomElement(nouns)}`;
    
    // Skip if reserved
    if (RESERVED_USERNAMES.has(username)) continue;
    
    if (!(await usernameExists(username))) {
      return username;
    }
  }
  
  // Phase 3: action-adjective-noun-number (guaranteed unique with retries)
  for (let i = 0; i < 10; i++) {
    const username = `${randomElement(actions)}-${randomElement(adjectives)}-${randomElement(nouns)}-${randomNumberSuffix()}`;
    
    if (!(await usernameExists(username))) {
      return username;
    }
  }
  
  // Ultimate fallback: adjective-noun-timestamp (extremely unlikely)
  const timestamp = Date.now().toString(36);
  return `${randomElement(adjectives)}-${randomElement(nouns)}-${timestamp}`;
}

/**
 * Check if a path segment matches a reserved username
 * Used for routing to determine if a path is a username or a route
 */
export function isReservedPath(pathSegment: string): boolean {
  return RESERVED_USERNAMES.has(normalizeUsername(pathSegment));
}
