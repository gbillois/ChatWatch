import { createHash } from "node:crypto";

const URL_PROTOCOL_RE = /^https?:\/\//i;
const TRAILING_SLASH_RE = /\/$/;

export function normalizeUrl(url: string): string {
  return url.trim().replace(URL_PROTOCOL_RE, "").replace(TRAILING_SLASH_RE, "").toLowerCase();
}

export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizedTitleHash(title: string): string {
  return createHash("sha256").update(normalizeTitle(title)).digest("hex");
}

export type DedupeKeys = {
  url: string;
  canonicalUrl: string | null;
  normalizedTitleHash: string;
};

export function buildDedupeKeys(url: string, canonicalUrl: string | null, title: string): DedupeKeys {
  return {
    url: normalizeUrl(url),
    canonicalUrl: canonicalUrl ? normalizeUrl(canonicalUrl) : null,
    normalizedTitleHash: normalizedTitleHash(title)
  };
}
