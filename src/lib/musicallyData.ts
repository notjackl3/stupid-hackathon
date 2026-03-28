import rawMusicallyData from '../data/musicallyResults.json';
import type { MusicallyPost, MusicallyQueryData } from '../types';

type RawEntry = { posts: Array<MusicallyPost | string> };

function isPost(value: MusicallyPost | string): value is MusicallyPost {
  return typeof value !== 'string';
}

function isResolvedPost(post: MusicallyPost | undefined): post is MusicallyPost {
  return Boolean(post);
}

function normalizeMusicallyData() {
  const rawData = rawMusicallyData as Record<string, RawEntry>;
  const postIndex = new Map<string, MusicallyPost>();

  Object.values(rawData).forEach((entry) => {
    entry.posts.forEach((post) => {
      if (isPost(post)) {
        postIndex.set(post.id, post);
      }
    });
  });

  const normalized = Object.fromEntries(
    Object.entries(rawData).map(([key, entry]) => [
      key,
      {
        posts: entry.posts.map((post) => (isPost(post) ? post : postIndex.get(post))).filter(isResolvedPost),
      } satisfies MusicallyQueryData,
    ])
  );

  return normalized as Record<string, MusicallyQueryData>;
}

export const musicallyData = normalizeMusicallyData();
