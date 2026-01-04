import { nanoid } from "nanoid";
import nodeCrypto from "crypto";

// Encryption key derived from BETTER_AUTH_SECRET
const ENCRYPTION_KEY = process.env.BETTER_AUTH_SECRET || "development-key-change-me-in-prod";

/**
 * Hash a token using SHA-256 for secure storage
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(): string {
  return `vm_${nanoid(32)}`;
}

/**
 * Compare a token with its hash
 */
export async function verifyToken(token: string, expectedHash: string): Promise<boolean> {
  const tokenHash = await hashToken(token);
  return tokenHash === expectedHash;
}

/**
 * Encrypt sensitive data (e.g., OAuth tokens) for storage
 * Uses AES-256-GCM for authenticated encryption
 */
export function encrypt(plaintext: string): string {
  // Derive a 32-byte key from the secret
  const key = nodeCrypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = nodeCrypto.randomBytes(16);
  const cipher = nodeCrypto.createCipheriv("aes-256-gcm", key, iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:ciphertext
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt sensitive data encrypted with encrypt()
 */
export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(":");
  
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("Invalid ciphertext format");
  }
  
  const key = nodeCrypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = nodeCrypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

// Legacy exports for backwards compatibility
export const hash = hashToken;
export const verify = verifyToken;
