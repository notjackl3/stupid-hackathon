import Fuse from 'fuse.js';
import type { GoogleQueryData, TwitterQueryData, VineQueryData, TumblrPost, MusicallyQueryData } from '../types';

type SearchableData<T> = Record<string, T>;

function createSearcher<T>(data: SearchableData<T>) {
  const keys = Object.keys(data);
  const fuse = new Fuse(keys, {
    threshold: 0.4,
    distance: 100,
  });
  return { fuse, data };
}

export function fuzzyMatch<T>(
  rawData: SearchableData<T>,
  query: string
): { key: string; value: T; exact: boolean } | null {
  const normalized = query.toLowerCase().trim();

  // Exact match first
  if (rawData[normalized]) {
    return { key: normalized, value: rawData[normalized], exact: true };
  }

  // Fuzzy match
  const { fuse, data } = createSearcher(rawData);
  const results = fuse.search(normalized);

  if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.5) {
    const matchedKey = results[0].item;
    return { key: matchedKey, value: data[matchedKey], exact: false };
  }

  return null;
}

export function searchGoogle(
  data: SearchableData<GoogleQueryData>,
  query: string
): { results: GoogleQueryData; matchedQuery: string; exact: boolean } | null {
  const match = fuzzyMatch(data, query);
  if (!match) return null;
  return { results: match.value, matchedQuery: match.key, exact: match.exact };
}

export function searchTwitter(
  data: SearchableData<TwitterQueryData>,
  query: string
): { results: TwitterQueryData; matchedQuery: string; exact: boolean } | null {
  const match = fuzzyMatch(data, query);
  if (!match) return null;
  return { results: match.value, matchedQuery: match.key, exact: match.exact };
}

export function searchVine(
  data: SearchableData<VineQueryData>,
  query: string
): { results: VineQueryData; matchedQuery: string; exact: boolean } | null {
  const match = fuzzyMatch(data, query);
  if (!match) return null;
  return { results: match.value, matchedQuery: match.key, exact: match.exact };
}

export function searchMusically(
  data: SearchableData<MusicallyQueryData>,
  query: string
): { results: MusicallyQueryData; matchedQuery: string; exact: boolean } | null {
  const match = fuzzyMatch(data, query);
  if (!match) return null;
  return { results: match.value, matchedQuery: match.key, exact: match.exact };
}

export function searchTumblr(
  data: SearchableData<TumblrPost[]>,
  query: string
): { results: TumblrPost[]; matchedQuery: string; exact: boolean } | null {
  const match = fuzzyMatch(data, query);
  if (!match) return null;
  return { results: match.value, matchedQuery: match.key, exact: match.exact };
}
