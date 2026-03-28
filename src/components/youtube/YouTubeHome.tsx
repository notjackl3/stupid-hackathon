import { useState, useEffect, type KeyboardEvent } from 'react';
import type { YouTubeVideoData } from '../../types';
import homepageData from '../../data/youtubeHomepage.json';
import { fetchHomepageVideos, searchYouTube } from '../../lib/youtube';
import { YouTubeLogo } from './YouTubeLogo';

// -- SVG Icons ----------------------------------------------------------------

function IconHome({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function IconTrending({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66C13.5 7.56 13.22 6 13.22 6s-1.07 1.44-1.26 2.07c-.8 2.54.46 4.4 1.07 5.52.33.6.46 1.24.24 1.93-.26.8-.9 1.3-1.57 1.7.8.3 1.7.3 2.55-.07 1.16-.5 1.82-1.63 1.82-2.9 0-1.13-.47-2.06-1.06-2.8.06.16.12.33.16.5.38 1.82-.57 3.1-1.63 3.72 1.52-.78 2.4-2.07 2.4-3.8 0-1.04-.5-2.04-1.06-2.83-.02-.03-.04-.06-.06-.1zM14 18c-.73.34-1.5.53-2.33.53-1.14 0-2.24-.41-3.1-1.14.97-.23 1.82-.73 2.3-1.63.13-.24.2-.5.2-.78 0-.6-.5-1.14-1.1-1.14-.56 0-1.03.42-1.1.96-.73-1.07-.46-2.53.37-3.3.43-.4.98-.67 1.52-.88C8.82 10.13 7 11.97 7 14.25 7 16.87 9.13 19 11.75 19c1.7 0 3.2-1 3.92-2.44-.3.24-.64.42-1.02.58-.22.08-.44.14-.65.14z" />
    </svg>
  );
}

function IconHistory({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  );
}

function IconMusic({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function IconSports({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V7.5h2v3.67c1.16.42 2 1.52 2 2.83 0 1.66-1.34 3-3 3z" />
    </svg>
  );
}

function IconGaming({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.3 1.77-.82L9.3 15h5.4l2.59 3.18c.45.52 1.09.82 1.77.82 1.55 0 2.74-1.37 2.52-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

function IconMovies({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    </svg>
  );
}

function IconTV({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
    </svg>
  );
}

function IconNews({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 3l-1.67 1.67L18.67 3 17 4.67 15.33 3l-1.66 1.67L12 3l-1.67 1.67L8.67 3 7 4.67 5.33 3 3.67 4.67 2 3v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V3zM11 19H4v-6h7v6zm9 0h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4H4V8h16v3z" />
    </svg>
  );
}

function IconLive({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function IconSpotlight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function Icon360({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7C6.48 7 2 9.24 2 12c0 2.24 2.94 4.13 7 4.77V20l4-4-4-4v2.73c-3.15-.56-5-1.9-5-2.73 0-1.06 2.69-3 8-3s8 1.94 8 3c0 .73-1.46 1.89-4 2.53v2.05c3.53-.77 6-2.53 6-4.58 0-2.76-4.48-5-10-5z" />
    </svg>
  );
}

function IconBrowse({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    </svg>
  );
}

function IconUser({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function IconYTPlay({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  );
}

// -- Constants ----------------------------------------------------------------

interface CategoryMeta {
  displayName: string;
  subtitle: string;
  subscriberCount: string;
  iconBgColor: string;
  icon: React.ReactNode;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  trending: { displayName: 'Trending', subtitle: 'Recommended videos', subscriberCount: '45,678,234', iconBgColor: '#e52d27', icon: <IconTrending className="w-5 h-5" /> },
  music: { displayName: 'Music', subtitle: 'Recommended videos', subscriberCount: '98,234,567', iconBgColor: '#e52d27', icon: <IconMusic className="w-5 h-5" /> },
  gaming: { displayName: 'Gaming', subtitle: 'Recommended videos', subscriberCount: '67,123,456', iconBgColor: '#e52d27', icon: <IconGaming className="w-5 h-5" /> },
  recommended: { displayName: 'Recommended for you', subtitle: 'Based on your watch history', subscriberCount: '', iconBgColor: '#606060', icon: <IconUser className="w-5 h-5" /> },
};

const VERIFIED_CHANNELS = new Set([
  'Rick Astley', 'Justin Timberlake', 'Drake', 'Sia', 'Dude Perfect',
  'The Chainsmokers', 'Adele', 'Taylor Swift', 'Wiz Khalifa', 'Alan Walker',
  'Coldplay', 'TED', 'Major Lazer', 'Charlie Puth', 'Pokémon GO', 'IGN',
]);

// -- Helpers ------------------------------------------------------------------

function getRelativeTime(publishedAt: string): string {
  const ref = new Date('2016-12-15');
  const pub = new Date(publishedAt);
  const diffMs = ref.getTime() - pub.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return months === 1 ? '1 month ago' : `${months} months ago`;
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

function formatViewCount(raw: string): string {
  return raw.replace(/,/g, ',');
}

// -- Subcomponents ------------------------------------------------------------

function VerifiedBadge() {
  return (
    <svg className="w-3 h-3 text-[#999] inline-block ml-0.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function VideoCard({ video, onClick }: { video: YouTubeVideoData; onClick: () => void }) {
  return (
    <div className="cursor-pointer group flex-1 min-w-0" onClick={onClick}>
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-[130px] object-cover bg-gray-200"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[11px] px-1 py-px font-medium rounded-sm">
          {video.duration ?? '10:01'}
        </span>
      </div>
      <div className="mt-1.5">
        <h3 className="text-[13px] font-medium text-[#167ac6] group-hover:underline line-clamp-2 leading-[16px]">
          {video.title}
        </h3>
        <p className="text-[12px] text-[#999] mt-0.5">
          {video.channelName}
          {VERIFIED_CHANNELS.has(video.channelName) && <VerifiedBadge />}
        </p>
        <p className="text-[12px] text-[#999]">
          {formatViewCount(video.viewCount)} views &middot; {getRelativeTime(video.publishedAt)}
        </p>
      </div>
    </div>
  );
}

function CategoryRow({
  categoryKey,
  videos,
  meta,
  scrollOffset,
  onScrollLeft,
  onScrollRight,
  onVideoClick,
}: {
  categoryKey: string;
  videos: YouTubeVideoData[];
  meta: CategoryMeta;
  scrollOffset: number;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  onVideoClick: (id: string) => void;
}) {
  if (!videos || videos.length === 0) return null;
  const visibleVideos = videos.slice(scrollOffset, scrollOffset + 4);
  const canScrollLeft = scrollOffset > 0;
  const canScrollRight = scrollOffset + 4 < videos.length;

  return (
    <div className="mb-6">
      {/* Category header */}
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-8 h-8 flex items-center justify-center text-white text-sm flex-shrink-0"
            style={{ backgroundColor: meta.iconBgColor }}
          >
            {meta.icon}
          </div>
          <span className="text-[15px] font-bold text-[#333]">{meta.displayName}</span>
          <span className="text-[13px] text-[#999]">{meta.subtitle}</span>
        </div>
        {meta.subscriberCount && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="border border-[#d3d3d3] bg-white text-[#333] text-[12px] font-medium px-2.5 py-1 hover:bg-[#f5f5f5] cursor-pointer flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#e52d27]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span className="text-[#e52d27] font-medium">Subscribe</span>
            </button>
            <span className="text-[12px] text-[#999]">{meta.subscriberCount}</span>
          </div>
        )}
      </div>

      {/* Video strip */}
      <div className="relative">
        <div className="flex gap-[6px]">
          {visibleVideos.map((video) => (
            <VideoCard
              key={`${categoryKey}-${video.videoId}-${scrollOffset}`}
              video={video}
              onClick={() => onVideoClick(video.videoId)}
            />
          ))}
        </div>

        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={onScrollLeft}
            className="absolute left-0 top-0 bottom-0 w-[32px] bg-white/80 border-r border-[#e2e2e2] flex items-center justify-center cursor-pointer hover:bg-white/95 z-10"
          >
            <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={onScrollRight}
            className="absolute right-0 top-0 bottom-0 w-[32px] bg-white/80 border-l border-[#e2e2e2] flex items-center justify-center cursor-pointer hover:bg-white/95 z-10"
          >
            <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarCategoryIcon({ name }: { name: string }) {
  const iconMap: Record<string, { bg: string; icon: React.ReactNode }> = {
    Music: { bg: '#e52d27', icon: <IconMusic className="w-3.5 h-3.5" /> },
    Sports: { bg: '#e52d27', icon: <IconSports className="w-3.5 h-3.5" /> },
    Gaming: { bg: '#e52d27', icon: <IconGaming className="w-3.5 h-3.5" /> },
    Movies: { bg: '#e52d27', icon: <IconMovies className="w-3.5 h-3.5" /> },
    'TV Shows': { bg: '#e52d27', icon: <IconTV className="w-3.5 h-3.5" /> },
    News: { bg: '#e52d27', icon: <IconNews className="w-3.5 h-3.5" /> },
    Live: { bg: '#e52d27', icon: <IconLive className="w-3.5 h-3.5" /> },
    Spotlight: { bg: '#f4b400', icon: <IconSpotlight className="w-3.5 h-3.5" /> },
    '360° Video': { bg: '#606060', icon: <Icon360 className="w-3.5 h-3.5" /> },
  };
  const entry = iconMap[name];
  if (!entry) return null;
  return (
    <div
      className="w-6 h-6 flex items-center justify-center text-white flex-shrink-0"
      style={{ backgroundColor: entry.bg }}
    >
      {entry.icon}
    </div>
  );
}

const SIDEBAR_LINKS = ['Music', 'Sports', 'Gaming', 'Movies', 'TV Shows', 'News', 'Live', 'Spotlight', '360° Video'] as const;

function Sidebar({ activeCategory, onCategoryClick, onHome }: {
  activeCategory: string | null;
  onCategoryClick: (name: string) => void;
  onHome: () => void;
}) {
  const isHome = activeCategory === null;
  return (
    <div className="w-[200px] min-w-[200px] bg-[#fafafa] border-r border-[#e8e8e8] overflow-y-auto self-start sticky top-0 min-h-screen">
      <div className="pt-2">
        {/* Nav items */}
        <div
          onClick={onHome}
          className={`h-[40px] px-5 flex items-center gap-4 text-sm cursor-pointer ${isHome ? 'font-bold text-[#e52d27] bg-[#e8e8e8] border-l-[3px] border-[#e52d27]' : 'text-[#606060] hover:bg-[#e8e8e8] px-6'}`}
        >
          <IconHome className="w-5 h-5" /> Home
        </div>
        <div
          onClick={() => onCategoryClick('Trending')}
          className={`h-[40px] px-6 flex items-center gap-4 text-sm cursor-pointer ${activeCategory === 'Trending' ? 'font-bold text-[#e52d27] bg-[#e8e8e8] border-l-[3px] border-[#e52d27] px-5' : 'text-[#606060] hover:bg-[#e8e8e8]'}`}
        >
          <IconTrending className="w-5 h-5" /> Trending
        </div>
        <div className="h-[40px] px-6 flex items-center gap-4 text-sm text-[#606060] hover:bg-[#e8e8e8] cursor-pointer">
          <IconHistory className="w-5 h-5" /> History
        </div>

        {/* Best of YouTube */}
        <div className="mt-4 mb-1 px-6">
          <span className="text-[11px] text-[#e52d27] font-bold tracking-wide uppercase">Best of YouTube</span>
        </div>
        {SIDEBAR_LINKS.map((name) => (
          <div
            key={name}
            onClick={() => onCategoryClick(name)}
            className={`h-[32px] px-6 flex items-center gap-3 text-[13px] cursor-pointer ${activeCategory === name ? 'font-bold text-[#e52d27] bg-[#e8e8e8]' : 'text-[#606060] hover:bg-[#e8e8e8]'}`}
          >
            <SidebarCategoryIcon name={name} />
            {name}
          </div>
        ))}

        {/* Separator + Browse channels */}
        <div className="border-t border-[#e2e2e2] my-2 mx-4" />
        <div
          onClick={() => onCategoryClick('Browse channels')}
          className="h-[32px] px-6 flex items-center gap-3 text-[13px] text-[#606060] hover:bg-[#e8e8e8] cursor-pointer"
        >
          <IconBrowse className="w-5 h-5" /> Browse channels
        </div>

        {/* Sign in prompt */}
        <div className="px-6 py-3">
          <p className="text-[13px] text-[#606060] leading-[18px]">
            Sign in now to see your channels and recommendations!
          </p>
          <button className="mt-2 bg-[#167ac6] text-white text-sm px-4 py-1.5 rounded-sm font-medium cursor-pointer hover:bg-[#1468a8]">
            Sign in
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-[#e2e2e2] my-2 mx-4" />

        {/* YouTube Red */}
        <div className="px-6 py-2 flex items-center gap-2 text-[13px] text-[#606060] cursor-pointer hover:bg-[#e8e8e8]">
          <IconYTPlay className="w-5 h-5 text-[#e52d27]" /> YouTube Red
        </div>
      </div>
    </div>
  );
}

// -- Props & Data -------------------------------------------------------------

interface YouTubeHomeProps {
  onSearch: (query: string) => void;
  onVideoClick: (videoId: string) => void;
}

const staticData = homepageData as Record<string, YouTubeVideoData[]>;
const CATEGORY_ORDER = ['trending', 'music', 'gaming', 'recommended'];

// -- Main Component -----------------------------------------------------------

export function YouTubeHome({ onSearch, onVideoClick }: YouTubeHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollOffsets, setScrollOffsets] = useState<Record<string, number>>({});
  const [data, setData] = useState<Record<string, YouTubeVideoData[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<YouTubeVideoData[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchHomepageVideos().then((apiData) => {
      if (cancelled) return;
      if (apiData) {
        const merged = { ...staticData };
        for (const key of CATEGORY_ORDER) {
          if (apiData[key] && apiData[key].length > 0) {
            merged[key] = apiData[key];
          }
        }
        setData(merged);
      } else {
        setData(staticData);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleCategoryClick = (name: string) => {
    setActiveCategory(name);
    setCategoryLoading(true);
    setCategoryVideos([]);
    setScrollOffsets({});
    searchYouTube(`${name} 2016`).then((videos) => {
      setCategoryVideos(videos);
      setCategoryLoading(false);
    });
  };

  const handleHome = () => {
    setActiveCategory(null);
    setCategoryVideos([]);
    setScrollOffsets({});
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleScrollRight = (key: string, videoCount: number) => {
    setScrollOffsets((prev) => {
      const current = prev[key] ?? 0;
      const max = videoCount - 4;
      return { ...prev, [key]: Math.min(current + 4, max) };
    });
  };

  const handleScrollLeft = (key: string) => {
    setScrollOffsets((prev) => {
      const current = prev[key] ?? 0;
      return { ...prev, [key]: Math.max(current - 4, 0) };
    });
  };

  return (
    <div className="min-h-full bg-[#f1f1f1] min-w-[900px]">
      {/* YouTube 2016 Header - WHITE */}
      <div className="bg-white h-[50px] flex items-center px-4 gap-4 border-b border-[#d3d3d3]">
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <span className="text-[#888] text-lg cursor-pointer leading-none">&#9776;</span>
          <div className="flex items-center cursor-pointer">
            <YouTubeLogo />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-[575px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="flex-1 px-3 py-[5px] border border-[#ccc] text-sm outline-none bg-white"
            />
            <button
              onClick={() => searchQuery.trim() && onSearch(searchQuery.trim())}
              className="bg-[#f8f8f8] border border-l-0 border-[#ccc] px-5 text-[#737373] hover:bg-[#e9e9e9] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="border border-[#ccc] text-[#666] text-sm px-3 py-1 hover:bg-[#f0f0f0] cursor-pointer">
            Upload
          </button>
          <button className="bg-[#167ac6] border border-[#167ac6] text-white text-sm px-3 py-1 font-medium cursor-pointer hover:bg-[#1468a8]">
            Sign in
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex">
        <Sidebar activeCategory={activeCategory} onCategoryClick={handleCategoryClick} onHome={handleHome} />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Home / Trending tabs */}
          <div className="flex items-center justify-center border-b border-[#d3d3d3] bg-white h-[40px] gap-8">
            <button className="px-2 h-full flex items-center text-[13px] font-medium text-[#333] border-b-2 border-[#e52d27] cursor-pointer">
              Home
            </button>
            <button className="px-2 h-full flex items-center text-[13px] text-[#606060] hover:text-[#333] cursor-pointer border-b-2 border-transparent">
              Trending
            </button>
          </div>

          {/* White content container */}
          <div className="mx-6 my-5">
            <div className="bg-white border border-[#d3d3d3] px-5 pt-5 pb-3">
              {activeCategory ? (
                /* Category browse view */
                <div>
                  <h2 className="text-[17px] font-bold text-[#333] mb-4">{activeCategory}</h2>
                  {categoryLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#999]">
                      <div className="w-8 h-8 border-3 border-[#e2e2e2] border-t-[#e52d27] rounded-full animate-spin mb-4" />
                      <span className="text-sm">Loading {activeCategory} videos...</span>
                    </div>
                  ) : categoryVideos.length === 0 ? (
                    <div className="text-center py-12 text-[#999] text-sm">No videos found for this category.</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {categoryVideos.map((video) => (
                        <VideoCard
                          key={video.videoId}
                          video={video}
                          onClick={() => onVideoClick(video.videoId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (loading || !data) ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#999]">
                  <div className="w-8 h-8 border-3 border-[#e2e2e2] border-t-[#e52d27] rounded-full animate-spin mb-4" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (<>
              {/* First section: Trending - just a heading */}
              {data.trending && data.trending.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-[17px] font-bold text-[#333] mb-3">Trending</h2>
                  <div className="relative">
                    <div className="flex gap-[6px]">
                      {data.trending.slice(scrollOffsets.trending ?? 0, (scrollOffsets.trending ?? 0) + 4).map((video) => (
                        <VideoCard
                          key={`trending-${video.videoId}-${scrollOffsets.trending ?? 0}`}
                          video={video}
                          onClick={() => onVideoClick(video.videoId)}
                        />
                      ))}
                    </div>
                    {(scrollOffsets.trending ?? 0) + 4 < data.trending.length && (
                      <button
                        onClick={() => handleScrollRight('trending', data.trending.length)}
                        className="absolute right-0 top-0 bottom-0 w-[32px] bg-white/80 border-l border-[#e2e2e2] flex items-center justify-center cursor-pointer hover:bg-white/95 z-10"
                      >
                        <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </button>
                    )}
                    {(scrollOffsets.trending ?? 0) > 0 && (
                      <button
                        onClick={() => handleScrollLeft('trending')}
                        className="absolute left-0 top-0 bottom-0 w-[32px] bg-white/80 border-r border-[#e2e2e2] flex items-center justify-center cursor-pointer hover:bg-white/95 z-10"
                      >
                        <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining category rows (skip trending, handled above) */}
              {CATEGORY_ORDER.filter((k) => k !== 'trending').map((key) => {
                const meta = CATEGORY_META[key];
                const videos = data[key];
                if (!meta || !videos) return null;
                return (
                  <CategoryRow
                    key={key}
                    categoryKey={key}
                    videos={videos}
                    meta={meta}
                    scrollOffset={scrollOffsets[key] ?? 0}
                    onScrollLeft={() => handleScrollLeft(key)}
                    onScrollRight={() => handleScrollRight(key, videos.length)}
                    onVideoClick={onVideoClick}
                  />
                );
              })}

              {/* Load more button */}
              <div className="flex justify-center pt-4 pb-2">
                <button className="border border-[#d3d3d3] text-[#333] text-[13px] px-6 py-1.5 hover:bg-[#f5f5f5] cursor-pointer">
                  Load more
                </button>
              </div>
              </>)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
