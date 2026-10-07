import { FREE_PREVIEW_DAY } from "./access";

/**
 * Public routes inside `/app` that do not require an active session:
 * 1) `/app/learn/<slug>` — Course curriculum & outline overview (public for SEO / prospective students)
 * 2) `/app/learn/<slug>/1` — Day 1 Free Preview experience (100% cardless, no login barrier)
 *
 * Day 2+ (/app/learn/<slug>/2..) remains strictly protected behind authentication & entitlement check.
 *
 * Shared between `proxy.ts` (skips redirect) and `app/app/layout.tsx` (skips auth check).
 */
export const PUBLIC_COURSE_PAGE = new RegExp(`^\\/app\\/learn\\/[^/]+(\\/${FREE_PREVIEW_DAY})?\\/?$`);

