import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory cache for fast response times (<2ms)
const tracksCache: Record<string, any[]> = {};
let domainsIndexCache: any[] | null = null;
let vaultSummaryCache: any | null = null;

const VAULT_DIR = path.join(process.cwd(), "src", "content", "vip-vault");
const TRACKS_DIR = path.join(VAULT_DIR, "tracks");

const TRACK_KEYS = [
  "strategy",
  "sales",
  "marketing",
  "freelance",
  "engineering",
  "product",
  "operations",
  "finance",
  "hr",
  "retention",
];

function getTrackPrompts(trackKey: string): any[] {
  if (tracksCache[trackKey]) return tracksCache[trackKey];
  const filePath = path.join(TRACKS_DIR, `track-${trackKey}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    tracksCache[trackKey] = parsed;
    return parsed;
  } catch {
    return [];
  }
}

function getAllPrompts(): any[] {
  let all: any[] = [];
  for (const k of TRACK_KEYS) {
    all = all.concat(getTrackPrompts(k));
  }
  return all;
}

function getDomainsIndex(): any[] {
  if (domainsIndexCache) return domainsIndexCache;
  const filePath = path.join(VAULT_DIR, "domains-index.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    domainsIndexCache = JSON.parse(raw);
    return domainsIndexCache!;
  } catch {
    return [];
  }
}

function getVaultSummary(): any {
  if (vaultSummaryCache) return vaultSummaryCache;
  const filePath = path.join(VAULT_DIR, "vault-summary.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    vaultSummaryCache = JSON.parse(raw);
    return vaultSummaryCache;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track") || "all";
  const domain = searchParams.get("domain") || "all";
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));

  // If client just wants metadata and domains list
  if (searchParams.get("metaOnly") === "true") {
    return NextResponse.json({
      domains: getDomainsIndex(),
      summary: getVaultSummary(),
    });
  }

  // Load target pool of prompts
  let pool: any[] = [];
  if (track !== "all" && TRACK_KEYS.includes(track)) {
    pool = getTrackPrompts(track);
  } else {
    // If domain specified and not all, find track of domain
    if (domain !== "all") {
      const domains = getDomainsIndex();
      const targetDomain = domains.find((d) => d.id === domain || d.slug === domain);
      if (targetDomain) {
        pool = getTrackPrompts(targetDomain.trackKey);
      } else {
        pool = getAllPrompts();
      }
    } else {
      pool = getAllPrompts();
    }
  }

  // Filter by domain if specified
  if (domain !== "all") {
    pool = pool.filter((p) => p.domainId === domain || p.domainSlug === domain);
  }

  // Filter by search query if specified
  if (search) {
    pool = pool.filter((p) => {
      return (
        p.titleAr?.toLowerCase().includes(search) ||
        p.titleEn?.toLowerCase().includes(search) ||
        p.promptTextAr?.toLowerCase().includes(search) ||
        p.promptTextEn?.toLowerCase().includes(search) ||
        p.targetRoleAr?.toLowerCase().includes(search) ||
        p.id?.toLowerCase().includes(search) ||
        p.domainTitleAr?.toLowerCase().includes(search)
      );
    });
  }

  const filteredCount = pool.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / limit));
  const startIndex = (page - 1) * limit;
  const paginated = pool.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    total: 10000,
    filteredCount,
    page,
    totalPages,
    limit,
    track,
    domain,
    prompts: paginated,
  });
}
