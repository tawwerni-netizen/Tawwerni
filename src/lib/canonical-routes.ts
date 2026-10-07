import { ALL_100_TRACKS, Track100 } from "@/content/tracks100";
import { getAllCareerPaths, CareerPath } from "@/content/career-paths";
import { HANDCRAFTED_TO_TRACK_SLUG_MAP } from "@/lib/course-loader";

/**
 * Canonical Route & URL Source of Truth
 * (Tawwerni V4.7 Requirement 02, 05, 06)
 *
 * Prevents fragile raw hardcoded strings and guessed URLs.
 * All marketing components, landing pages, and CTAs build their
 * URLs from canonical product/track/career-path objects.
 */

const FALLBACK_TRACK_SLUG = "prompt-engineering-mastery";

/**
 * Resolves a track using either numeric ID (1..100), modern slug, or handcrafted slug.
 */
export function resolveCanonicalTrack(identifier: number | string): Track100 | undefined {
  if (typeof identifier === "number") {
    return ALL_100_TRACKS.find((t) => t.id === identifier);
  }

  // Direct match on modern slug
  let track = ALL_100_TRACKS.find((t) => t.slug === identifier);
  if (track) return track;

  // Bridge lookup for legacy/handcrafted slug
  const mappedSlug = HANDCRAFTED_TO_TRACK_SLUG_MAP[identifier];
  if (mappedSlug) {
    track = ALL_100_TRACKS.find((t) => t.slug === mappedSlug);
    if (track) return track;
  }

  return undefined;
}

/**
 * Builds the canonical Day 1 Free Preview URL for a track.
 * Always resolves to `/app/learn/${CANONICAL_SLUG}/1`.
 */
export function getTrackDayOneUrl(identifier: number | string): string {
  const track = resolveCanonicalTrack(identifier);
  if (!track) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[canonical-routes] Unknown track identifier "${identifier}", falling back to "${FALLBACK_TRACK_SLUG}".`);
    }
    return `/app/learn/${FALLBACK_TRACK_SLUG}/1`;
  }
  return `/app/learn/${track.slug}/1`;
}

/**
 * Builds the canonical curriculum overview / public track URL.
 */
export function getTrackDetailUrl(identifier: number | string): string {
  const track = resolveCanonicalTrack(identifier);
  const slug = track ? track.slug : FALLBACK_TRACK_SLUG;
  return `/tracks/${slug}`;
}

/**
 * Resolves a career path by either its ID (e.g. 'cp-web-dev') or its slug ('fullstack-web-developer').
 */
export function resolveCanonicalCareerPath(identifier: string): CareerPath | undefined {
  const allPaths = getAllCareerPaths();
  return allPaths.find((p) => p.id === identifier || p.slug === identifier);
}

/**
 * Returns the canonical first track slug for a career path (Stage 1, Track 1).
 */
export function getCareerPathFirstTrackSlug(identifier: string): string {
  const cp = resolveCanonicalCareerPath(identifier);
  if (!cp || !cp.stages.length || !cp.stages[0].tracks.length) {
    return FALLBACK_TRACK_SLUG;
  }
  const firstTrack = cp.stages[0].tracks[0];
  return firstTrack.trackSlug || FALLBACK_TRACK_SLUG;
}

/**
 * Builds the canonical Day 1 Free Preview URL for a career path's first track.
 * Guarantees resolution to `/app/learn/${FIRST_TRACK_SLUG}/1`.
 */
export function getCareerPathFirstDayUrl(identifier: string): string {
  const firstTrackSlug = getCareerPathFirstTrackSlug(identifier);
  return getTrackDayOneUrl(firstTrackSlug);
}

/**
 * Builds the canonical career path detail URL.
 */
export function getCareerPathDetailUrl(identifier: string): string {
  const cp = resolveCanonicalCareerPath(identifier);
  const slug = cp ? cp.slug : identifier;
  return `/career-paths/${slug}`;
}
