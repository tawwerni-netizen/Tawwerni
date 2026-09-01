/**
 * `/app/learn/<slug>` — the course overview and curriculum outline — is not
 * really part of the authenticated app; it is the page the sitemap submits
 * for indexing on the strength of its public curriculum. Only that exact
 * shape matches: `/app/learn/<slug>/<day>` (actual lesson content),
 * `/app/learn` (the bare "your courses" list), and everything else under
 * `/app` stay behind the login wall.
 *
 * Shared between `proxy.ts` (skips the redirect) and `app/app/layout.tsx`
 * (skips its own, independent auth check) — two different gates that both
 * used to hard-block anonymous visitors here, so both need the same answer
 * to "is this page public" or one of them silently wins.
 */
export const PUBLIC_COURSE_PAGE = /^\/app\/learn\/[^/]+\/?$/;
