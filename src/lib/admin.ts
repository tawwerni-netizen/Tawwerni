import { getCurrentUser } from "@/lib/auth";

/**
 * Admin access.
 *
 * There is one door into the business: the owner's own account, email plus
 * password, with `isAdmin` set on the user row. The shared `ADMIN_PASSWORD`
 * env var that used to guard this panel is gone — a single secret sitting in
 * plaintext config, shared by anyone who ever saw it, with no name attached to
 * an approval, is not a credential for the surface that moves money.
 *
 * Create or promote the owner account with:
 *   npx tsx scripts/create-admin.ts <email> <password> [name]
 */
export const SUPER_ADMIN_EMAILS = [
  "hhifzy@gmail.com",
  "tawwerni@gmail.com",
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export async function adminUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (isSuperAdminEmail(user.email) || user.isAdmin) {
    return { ...user, isAdmin: true };
  }
  return null;
}

export async function isAdmin(): Promise<boolean> {
  return (await adminUser()) !== null;
}
