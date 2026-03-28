export type SiteName = 'google' | 'youtube' | 'twitter';
export type PageName = 'home' | 'search' | 'video';

export interface NavigationState {
  site: SiteName;
  page: PageName;
  query: string;
  videoId: string;
}

export interface NavigationActions {
  navigate: (site: SiteName, page?: PageName, params?: { query?: string; videoId?: string }) => void;
  navigateFromUrl: (url: string) => void;
  search: (query: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  displayUrl: string;
}

export interface GoogleResult {
  title: string;
  url: string;
  snippet: string;
}

export interface GoogleQueryData {
  results: GoogleResult[];
  didYouMean?: string;
  peopleAlsoAsk?: string[];
  ads?: GoogleResult[];
}

export interface Tweet {
  id: string;
  displayName: string;
  handle: string;
  avatar: 'egg' | 'default' | 'selfie' | 'anime' | 'dog' | 'sunset' | 'logo';
  verified: boolean;
  text: string;
  timestamp: string;
  retweets: number;
  likes: number;
  replies: number;
}

export interface TwitterQueryData {
  tweets: Tweet[];
}

export interface YouTubeVideoData {
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  duration?: string;
}

export type PopupType = 'ad' | 'flash' | 'virus' | 'ram';
