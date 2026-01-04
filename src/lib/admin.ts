import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Check if the current user is an admin
 * Returns the user if admin, null otherwise
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const foundUser = await db.query.user.findFirst({
    where: eq(userTable.id, session.user.id),
  });

  if (!foundUser?.isAdmin) {
    return null;
  }

  return foundUser;
}

/**
 * Type guard to check admin status
 */
export async function isAdmin(): Promise<boolean> {
  const admin = await requireAdmin();
  return admin !== null;
}
