export type SiteName = 'google' | 'youtube' | 'twitter' | 'vine' | 'tumblr' | 'myinstants' | 'musically' | 'spotify';
export type PageName = 'home' | 'search' | 'video' | 'explore' | 'tagged' | 'playlist';
export type NavigationResourceType = 'playlist' | 'album' | '';

export interface NavigationState {
  site: SiteName;
  page: PageName;
  query: string;
  videoId: string;
  resourceType: NavigationResourceType;
  resourceId: string;
}

export interface NavigationActions {
  navigate: (
    site: SiteName,
    page?: PageName,
    params?: { query?: string; videoId?: string; resourceType?: NavigationResourceType; resourceId?: string }
  ) => void;
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

export interface VineComment {
  user: string;
  text: string;
}

export interface VinePost {
  id: string;
  username: string;
  displayName: string;
  verified: boolean;
  caption: string;
  loops: number;
  likes: number;
  revines: number;
  comments: VineComment[];
  videoDescription: string;
  videoColor: string;
  videoId?: string;
  avatarUrl?: string;
}

export interface VineQueryData {
  vines: VinePost[];
}

export interface MusicallyComment {
  user: string;
  text: string;
}

export interface MusicallyPost {
  id: string;
  username: string;
  displayName: string;
  verified: boolean;
  caption: string;
  fans: string;
  hearts: number;
  shares: number;
  comments: MusicallyComment[];
  songTitle: string;
  artist: string;
  hashtags: string[];
  city?: string;
  category: string;
  videoDescription: string;
  videoColor: string;
  videoId?: string;
  startSeconds?: number;
  endSeconds?: number;
  avatarUrl?: string;
}

export interface MusicallyQueryData {
  posts: MusicallyPost[];
}

export type TumblrPostType = 'reblog_chain' | 'text' | 'photo' | 'quote' | 'link' | 'chat' | 'sponsored';

export interface TumblrReblogEntry {
  username: string;
  blogTitle?: string;
  blogColor?: string;
  content: string;
}

export interface TumblrChatLine {
  speaker: string;
  text: string;
}

export interface TumblrPost {
  id: string;
  type: TumblrPostType;
  username?: string;
  blogTitle?: string;
  blogColor?: string;
  title?: string;
  content?: string;
  caption?: string;
  notes: string;
  tags: string[];
  source?: string;
  timestamp?: string;
  chain?: TumblrReblogEntry[];
  imageDescription?: string;
  imageColor?: string;
  quote?: string;
  quoteSource?: string;
  linkTitle?: string;
  linkUrl?: string;
  linkDescription?: string;
  chatLines?: TumblrChatLine[];
  sponsorLabel?: string;
  ctaLabel?: string;
}

export interface TumblrData {
  dashboard: TumblrPost[];
  search: Record<string, TumblrPost[]>;
}

export type PopupType = 'ad' | 'flash' | 'virus' | 'ram';

export interface BrowserTab {
  id: string;
  label: string;
  savedState: NavigationState;
}
