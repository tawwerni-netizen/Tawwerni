import { ALL_100_TRACKS } from "./tracks100";
import { getTrackArtwork } from "./track-artworks";

export interface TrackArtPrompt {
  id: number;
  slug: string;
  pillarId: number;
  titleAr: string;
  titleEn: string;
  nanoBananaPrompt: string;
  currentImage: string;
}

export function generateNanoBananaPrompt(trackTitleEn: string, pillarNameEn: string): string {
  return `Ultra-detailed 3D digital illustration representing ${trackTitleEn} (${pillarNameEn}). Glowing holographic glass UI elements, floating neon isometric tech objects, radiant emerald and cyan ambient lighting, cinematic lighting, sleek futuristic educational interface, octane 3D render, 8k resolution, Masterclass aesthetic.`;
}

export const ALL_100_TRACK_ART_PROMPTS: TrackArtPrompt[] = ALL_100_TRACKS.map((t) => {
  const art = getTrackArtwork(t.slug);
  return {
    id: t.id,
    slug: t.slug,
    pillarId: t.pillarId,
    titleAr: t.titleAr,
    titleEn: t.titleEn,
    nanoBananaPrompt: generateNanoBananaPrompt(t.titleEn, t.pillarNameEn),
    currentImage: art?.image || "/images/tracks/prompt-engineering-mastery.jpg",
  };
});
