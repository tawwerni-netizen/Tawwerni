/**
 * Referral values shared between the edge middleware and server code.
 *
 * Kept free of any Prisma or Node-only import so `middleware.ts` can use it —
 * the edge runtime cannot load the database client.
 */
export const REFERRAL_COOKIE = "tawwerni_ref";

/** Query parameter carrying a referral code, e.g. /?ref=ABC1234 */
export const REFERRAL_PARAM = "ref";

/** Attribution window for a click, in seconds. */
export const REFERRAL_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
