import type { YouTubeVideoData } from '../types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

function formatCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return count;
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '10:01';
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const HOMEPAGE_QUERIES: Record<string, string> = {
  trending: 'most popular viral 2016',
  music: 'official music video 2016',
  gaming: 'gameplay walkthrough 2016',
  recommended: 'best videos 2016',
};

export async function fetchHomepageVideos(): Promise<Record<string, YouTubeVideoData[]> | null> {
  if (!API_KEY) return null;

  try {
    const entries = await Promise.all(
      Object.entries(HOMEPAGE_QUERIES).map(async ([category, query]) => {
        const videos = await searchYouTube(query);
        return [category, videos.slice(0, 8)] as const;
      }),
    );

    const result: Record<string, YouTubeVideoData[]> = {};
    let hasAny = false;
    for (const [category, videos] of entries) {
      if (videos.length > 0) {
        result[category] = videos;
        hasAny = true;
      }
    }

    return hasAny ? result : null;
  } catch {
    return null;
  }
}

export async function searchYouTube(query: string): Promise<YouTubeVideoData[]> {
  if (!API_KEY) return [];

  try {
    const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&publishedAfter=2016-01-01T00:00:00Z&publishedBefore=2016-12-31T23:59:59Z&maxResults=12&order=relevance&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return [];

    const searchData = await searchRes.json();
    const items: YouTubeSearchItem[] = searchData.items ?? [];
    if (items.length === 0) return [];

    const videoIds = items.map((item) => item.id.videoId).join(',');
    const detailsUrl = `${BASE_URL}/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    if (!detailsRes.ok) {
      return items.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt.split('T')[0],
        viewCount: '???',
        likeCount: '???',
        dislikeCount: '???',
        duration: '10:01',
      }));
    }

    const detailsData = await detailsRes.json();
    const videoItems: YouTubeVideoItem[] = detailsData.items ?? [];

    return videoItems.map((v) => ({
      videoId: v.id,
      title: v.snippet.title,
      channelName: v.snippet.channelTitle,
      thumbnailUrl: v.snippet.thumbnails.medium.url,
      publishedAt: v.snippet.publishedAt.split('T')[0],
      viewCount: formatCount(v.statistics.viewCount ?? '0'),
      likeCount: formatCount(v.statistics.likeCount ?? '0'),
      dislikeCount: formatCount(v.statistics.dislikeCount ?? '0'),
      duration: v.contentDetails?.duration ? parseDuration(v.contentDetails.duration) : '10:01',
    }));
  } catch {
    return [];
  }
}
