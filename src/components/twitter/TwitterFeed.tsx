import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import type { Tweet, TwitterQueryData } from '../../types';
import { searchTwitter } from '../../lib/fuzzySearch';
import { RightSidebar } from './TrendingSidebar';
import { getTwitterProfile, TWITTER_HOME_PROFILE, TWITTER_TRENDS } from '../../data/twitterProfiles';
import twitterData from '../../data/twitterResults.json';

interface TwitterFeedProps {
  query: string;
  onSearch: (query: string) => void;
}

const TWEETS_PER_BATCH = 5;
const twitterDataset = twitterData as Record<string, TwitterQueryData>;

function renderTweetText(text: string): React.ReactNode {
  const parts = text.split(/(@\w+|#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@') || part.startsWith('#')) {
      return <span key={i} className="text-[#1da1f2] hover:underline cursor-pointer">{part}</span>;
    }
    return part;
  });
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#1da1f2] flex-shrink-0 inline-block ml-0.5">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </svg>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-[22px] h-[22px] ${active ? 'fill-[#1da1f2]' : 'fill-[#657786]'}`}>
      <path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44V19.56c0 .552.448 1 1 1h5.256c.552 0 1-.448 1-1v-5.8h3.352v5.8c0 .552.447 1 1 1h5.254c.553 0 1-.448 1-1V8.45l.816.44c.364.197.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 11.99h-3.254v-5.8c0-.552-.448-1-1-1H10.33c-.553 0-1 .448-1 1v5.8H6.072V7.57l5.93-3.2 5.82 3.2v11.99z" />
    </svg>
  );
}

function MomentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#657786]">
      <path d="M15.712 11.823c.076-.176.156-.348.236-.52l2.828-5.907c.56-1.17-.187-2.36-1.474-2.36H6.69c-1.286 0-2.033 1.19-1.473 2.36l2.83 5.907c.077.17.155.342.23.518-1.458 1.328-2.376 3.203-2.376 5.29 0 3.946 3.206 7.152 7.152 7.152 3.947 0 7.153-3.206 7.153-7.152 0-2.085-.918-3.96-2.375-5.288zm-4.66-7.788h1.9l-2.37 4.953c-.048.1-.1.197-.15.295-.25-.03-.504-.045-.762-.045h-.008c-.257 0-.51.016-.757.046-.05-.1-.1-.195-.148-.295L7.39 4.035h3.662zm2.004 17.477c-2.868 0-5.2-2.333-5.2-5.2s2.332-5.2 5.2-5.2 5.2 2.333 5.2 5.2-2.332 5.2-5.2 5.2z" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#657786]">
      <path d="M21.697 16.468c-.02-.016-2.14-1.64-2.103-6.03.02-2.533-1.396-4.77-3.592-5.78-.585-.264-.396-1.108-.396-1.108 0-.794-.648-1.44-1.443-1.44h-.154c-.795 0-1.443.646-1.443 1.44 0 0 .186.843-.4 1.11-2.197 1.004-3.615 3.246-3.594 5.78.036 4.388-2.084 6.013-2.104 6.03-.297.222-.334.656-.08.925.143.152.34.235.545.235h4.06c.088 1.31 1.175 2.35 2.506 2.35 1.33 0 2.418-1.04 2.506-2.35h4.06c.206 0 .402-.083.545-.235.254-.27.217-.703-.08-.925zM12 20.62c-.71 0-1.3-.51-1.44-1.18h2.88c-.14.67-.73 1.18-1.44 1.18zm5.85-2.68H6.15c.56-.706 1.607-2.326 1.573-5.56-.02-2.028 1.06-3.9 2.855-4.8l.39-.178c.222-.1.5-.24.77-.59.335-.43.17-.97.17-.97 0-.07.044-.152.153-.152h.154c.11 0 .153.08.153.15 0 0-.164.542.17.972.27.348.548.49.77.59l.39.177c1.793.903 2.875 2.772 2.855 4.8-.033 3.232 1.013 4.853 1.572 5.56z" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#657786]">
      <path d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.252v.498l-8.5 5.61-8.5-5.61V5.77c0-.693.56-1.252 1.25-1.252zm14.5 12.998H4.75c-.69 0-1.25-.56-1.25-1.253V7.54l8.5 5.61 8.5-5.61v8.723c0 .693-.56 1.253-1.25 1.253z" />
    </svg>
  );
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const profile = getTwitterProfile(tweet.handle, tweet.avatar);
  const displayName = profile.displayName ?? tweet.displayName;
  const verified = profile.verified ?? tweet.verified;

  return (
    <div className="flex gap-[10px] px-[12px] py-[9px] border-b border-[#e1e8ed] hover:bg-[#f5f8fa] cursor-pointer transition-colors duration-150">
      <img
        src={profile.avatarSrc}
        alt={displayName}
        className="w-[48px] h-[48px] rounded-[4px] flex-shrink-0 bg-[#e1e8ed] object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[2px] flex-wrap leading-[18px]">
          <span className="font-bold text-[14px] text-[#14171a] hover:underline cursor-pointer">{displayName}</span>
          {verified && <VerifiedBadge />}
          <span className="text-[13px] text-[#657786] ml-[3px]">@{tweet.handle}</span>
          <span className="text-[13px] text-[#657786] mx-[2px]">&middot;</span>
          <span className="text-[13px] text-[#657786] hover:underline cursor-pointer">{tweet.timestamp}</span>
        </div>
        <p className="text-[14px] text-[#14171a] mt-[1px] leading-[20px] whitespace-pre-wrap">{renderTweetText(tweet.text)}</p>
        <div className="flex items-center mt-[7px] text-[#657786] max-w-[425px] justify-between">
          <button className="group flex items-center gap-[5px] text-[12px] hover:text-[#1da1f2] cursor-pointer py-[2px]">
            <div className="w-[28px] h-[28px] flex items-center justify-center rounded-[14px] group-hover:bg-[#e8f5fd] transition-colors">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-[#657786] group-hover:fill-[#1da1f2]">
                <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
              </svg>
            </div>
            <span>{tweet.replies > 0 ? tweet.replies.toLocaleString() : ''}</span>
          </button>
          <button className="group flex items-center gap-[5px] text-[12px] hover:text-[#17bf63] cursor-pointer py-[2px]">
            <div className="w-[28px] h-[28px] flex items-center justify-center rounded-[14px] group-hover:bg-[#e6f3e6] transition-colors">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-[#657786] group-hover:fill-[#17bf63]">
                <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z" />
              </svg>
            </div>
            <span>{tweet.retweets > 0 ? tweet.retweets.toLocaleString() : ''}</span>
          </button>
          <button className="group flex items-center gap-[5px] text-[12px] hover:text-[#e0245e] cursor-pointer py-[2px]">
            <div className="w-[28px] h-[28px] flex items-center justify-center rounded-[14px] group-hover:bg-[#fde8ef] transition-colors">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-[#657786] group-hover:fill-[#e0245e]">
                <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z" />
              </svg>
            </div>
            <span>{tweet.likes > 0 ? tweet.likes.toLocaleString() : ''}</span>
          </button>
          <button className="group flex items-center gap-[5px] text-[12px] hover:text-[#1da1f2] cursor-pointer py-[2px]">
            <div className="w-[28px] h-[28px] flex items-center justify-center rounded-[14px] group-hover:bg-[#e8f5fd] transition-colors">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-[#657786] group-hover:fill-[#1da1f2]">
                <path d="M17.53 7.77l-5.396-5.396c-.293-.293-.768-.293-1.06 0l-5.396 5.396c-.293.293-.293.768 0 1.06s.768.294 1.06 0L10.69 4.88v11.25c0 .414.336.75.75.75s.75-.336.75-.75V4.88l3.952 3.952c.147.146.34.22.53.22s.384-.073.53-.22c.294-.293.294-.768 0-1.06z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function generateFillerTweets(sourceTweets: Tweet[], batchNum: number): Tweet[] {
  const shuffled = [...sourceTweets].sort(() => Math.sin(batchNum * 9301 + sourceTweets.length * 49297) - 0.5);
  return shuffled.slice(0, TWEETS_PER_BATCH).map((tweet, i) => ({
    ...tweet,
    id: `${tweet.id}-filler-${batchNum}-${i}`,
  }));
}

function buildTweetPool(query: string): Tweet[] {
  const primaryTweets = !query
    ? twitterDataset._trending?.tweets ?? []
    : searchTwitter(twitterDataset, query)?.results.tweets ?? [];

  const seenIds = new Set(primaryTweets.map((tweet) => tweet.id));
  const overflowTweets = Object.entries(twitterDataset)
    .filter(([key]) => key !== '_trending')
    .flatMap(([, value]) => value.tweets)
    .filter((tweet) => !seenIds.has(tweet.id));

  return [...primaryTweets, ...overflowTweets];
}

export function TwitterFeed({ query, onSearch }: TwitterFeedProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [allTweets, setAllTweets] = useState<Tweet[]>([]);
  const [displayedTweets, setDisplayedTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const batchIndexRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    batchIndexRef.current = 1;

    const delay = 500 + Math.random() * 300;
    const timer = setTimeout(() => {
      const fetched = buildTweetPool(query);

      setAllTweets(fetched);
      setDisplayedTweets(fetched.slice(0, TWEETS_PER_BATCH));
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [query]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;

    setLoadingMore(true);
    const delay = 600 + Math.random() * 600;

    setTimeout(() => {
      const nextBatch = batchIndexRef.current;
      const start = nextBatch * TWEETS_PER_BATCH;
      const end = start + TWEETS_PER_BATCH;

      let newTweets: Tweet[];
      if (start < allTweets.length) {
        newTweets = allTweets.slice(start, end);
      } else {
        newTweets = generateFillerTweets(allTweets, nextBatch);
      }

      batchIndexRef.current = nextBatch + 1;
      setDisplayedTweets(prev => [...prev, ...newTweets]);
      setLoadingMore(false);
    }, delay);
  }, [allTweets, loadingMore, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const scrollContainer = document.getElementById('browser-content-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && allTweets.length > 0) {
          loadMore();
        }
      },
      { root: scrollContainer, rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, allTweets.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const currentUser = TWITTER_HOME_PROFILE;

  return (
    <div className="min-h-full w-full bg-[#e6ecf0]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Twitter Header */}
      <div className="bg-white border-b border-[#d8e2ea] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="w-full flex items-center justify-between h-[46px] px-[16px]">
          <div className="flex items-center h-full gap-[2px]">
            <a className="flex flex-col items-center justify-center px-[10px] h-full border-b-2 border-[#1da1f2] cursor-pointer group">
              <HomeIcon active />
              <span className="text-[10px] text-[#1da1f2] font-bold mt-[-2px]">Home</span>
            </a>
            <a className="flex flex-col items-center justify-center px-[10px] h-full border-b-2 border-transparent hover:border-[#1da1f2] cursor-pointer group">
              <MomentsIcon />
              <span className="text-[10px] text-[#657786] group-hover:text-[#1da1f2] mt-[-2px]">Moments</span>
            </a>
            <a className="flex flex-col items-center justify-center px-[10px] h-full border-b-2 border-transparent hover:border-[#1da1f2] cursor-pointer group relative">
              <NotificationsIcon />
              <span className="text-[10px] text-[#657786] group-hover:text-[#1da1f2] mt-[-2px]">Notifications</span>
              <span className="absolute top-[4px] right-[4px] bg-[#1da1f2] text-white text-[9px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center">3</span>
            </a>
            <a className="flex flex-col items-center justify-center px-[10px] h-full border-b-2 border-transparent hover:border-[#1da1f2] cursor-pointer group">
              <MessagesIcon />
              <span className="text-[10px] text-[#657786] group-hover:text-[#1da1f2] mt-[-2px]">Messages</span>
            </a>
          </div>

          <div className="text-[#1da1f2] cursor-pointer hover:text-[#0c7abf] transition-colors">
            <svg viewBox="0 0 24 24" className="w-[28px] h-[28px]" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </svg>
          </div>

          <div className="flex items-center gap-[10px]">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Twitter"
                className="bg-[#f5f8fa] border border-[#e6ecf0] rounded-full pl-[30px] pr-[12px] py-[6px] text-[13px] w-[180px] text-[#14171a] placeholder-[#9eabb6] outline-none focus:border-[#1da1f2] focus:bg-white transition-colors"
              />
              <svg className="w-[14px] h-[14px] text-[#657786] absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </svg>
            </div>
            <button className="bg-[#1da1f2] text-white rounded-full px-[16px] py-[6px] text-[13px] font-bold hover:bg-[#1a91da] cursor-pointer transition-colors">
              Tweet
            </button>
            <img
              src={currentUser.avatarSrc}
              alt="Profile"
              className="w-[32px] h-[32px] rounded-[4px] cursor-pointer bg-[#e1e8ed] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main content - 3 column layout */}
      <div className="w-full flex gap-[10px] py-[10px] px-[16px]">
        {/* Left sidebar - Profile card + Trends */}
        <div className="w-[180px] flex-shrink-0">
          {/* Profile card */}
          <div className="bg-white border border-[#e6ecf0] rounded-[5px] overflow-hidden mb-[10px]">
            <img
              src={currentUser.bannerSrc}
              alt=""
              className="h-[80px] w-full object-cover bg-gradient-to-r from-[#1da1f2] to-[#45b0f5]"
            />
            <div className="px-[12px] pb-[12px] relative">
              <img
                src={currentUser.avatarSrc}
                alt="User"
                className="w-[56px] h-[56px] rounded-[6px] border-[3px] border-white bg-[#e1e8ed] absolute -top-[28px] object-cover"
              />
              <div className="pt-[32px]">
                <div className="font-bold text-[14px] text-[#14171a] hover:underline cursor-pointer">{currentUser.name}</div>
                <div className="text-[12px] text-[#657786]">@{currentUser.handle}</div>
              </div>
              <div className="flex justify-between mt-[10px] border-t border-[#e6ecf0] pt-[10px]">
                <a className="flex flex-col cursor-pointer group">
                  <span className="text-[10px] text-[#657786] font-bold tracking-wide uppercase group-hover:text-[#1da1f2]">Tweets</span>
                  <span className="text-[14px] font-bold text-[#1da1f2]">{currentUser.tweets}</span>
                </a>
                <a className="flex flex-col cursor-pointer group">
                  <span className="text-[10px] text-[#657786] font-bold tracking-wide uppercase group-hover:text-[#1da1f2]">Following</span>
                  <span className="text-[14px] font-bold text-[#1da1f2]">{currentUser.following}</span>
                </a>
                <a className="flex flex-col cursor-pointer group">
                  <span className="text-[10px] text-[#657786] font-bold tracking-wide uppercase group-hover:text-[#1da1f2]">Followers</span>
                  <span className="text-[14px] font-bold text-[#1da1f2]">{currentUser.followers}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white border border-[#e6ecf0] rounded-[5px] overflow-hidden">
            <div className="px-[12px] py-[8px] border-b border-[#e6ecf0] flex items-center justify-between">
              <h3 className="font-bold text-[#14171a] text-[13px]">Trends</h3>
              <span className="text-[11px] text-[#1da1f2] hover:underline cursor-pointer">Change</span>
            </div>
            {TWITTER_TRENDS.map((trend) => (
              <div
                key={trend.tag}
                className="px-[12px] py-[6px] hover:bg-[#f5f8fa] cursor-pointer border-b border-[#e6ecf0] last:border-b-0 transition-colors"
                onClick={() => onSearch(trend.tag.replace('#', ''))}
              >
                <div className="text-[13px] font-bold text-[#14171a] hover:text-[#1da1f2]">{trend.tag}</div>
                <div className="text-[11px] text-[#657786]">{trend.tweets}</div>
                {trend.context && (
                  <div className="text-[10px] text-[#657786] mt-[1px]">{trend.context}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 min-w-0">
          {/* Compose tweet - simplified like 2016 reference */}
          <div className="bg-white border border-[#e6ecf0] rounded-[5px] mb-[10px] px-[12px] py-[10px]">
            <div className="flex gap-[10px] items-start">
              <img
                src={currentUser.avatarSrc}
                alt="You"
                className="w-[32px] h-[32px] rounded-[4px] flex-shrink-0 bg-[#e1e8ed] object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="What's happening?"
                  className="w-full outline-none text-[14px] text-[#14171a] placeholder-[#9eabb6] border-b border-[#e6ecf0] pb-[8px] pr-[30px]"
                  maxLength={140}
                />
                <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-[#1da1f2] absolute right-[4px] top-[2px] cursor-pointer hover:fill-[#0c7abf]">
                  <path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.003-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z" />
                </svg>
              </div>
            </div>
          </div>

          {/* View new tweets bar */}
          {!query && (
            <div className="bg-[#e8f4fb] border border-[#cee7f5] rounded-[5px] mb-[10px] px-[15px] py-[8px] text-center cursor-pointer hover:bg-[#ddeef6] transition-colors">
              <span className="text-[13px] text-[#1da1f2]">View 33 new Tweets</span>
            </div>
          )}

          {/* Search header */}
          {query && (
            <div className="bg-white border border-[#e6ecf0] rounded-[5px] mb-[10px] px-[15px] py-[10px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[13px] text-[#657786]">Search results for </span>
                  <span className="text-[13px] font-bold text-[#14171a]">"{query}"</span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#8899a6]">Top</span>
              </div>
              <div className="mt-[10px] flex items-center gap-[14px] border-t border-[#e6ecf0] pt-[8px] text-[12px]">
                {['Top', 'Latest', 'Accounts', 'Photos', 'Videos', 'More'].map((tab) => (
                  <span
                    key={tab}
                    className={tab === 'Top' ? 'font-bold text-[#1da1f2]' : 'cursor-pointer text-[#657786] hover:text-[#1da1f2]'}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tweets */}
          <div className="bg-white border border-[#e6ecf0] rounded-[5px] overflow-hidden">
            {loading ? (
              <div className="p-[30px] text-center">
                <div className="inline-block w-[20px] h-[20px] border-2 border-[#1da1f2] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : displayedTweets.length === 0 ? (
              <div className="p-[30px] text-center text-[13px] text-[#657786]">
                No tweets found for "{query}". Twitter in 2016 doesn't know what this is.
              </div>
            ) : (
              <>
                {displayedTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
                {loadingMore && (
                  <div className="p-[20px] text-center">
                    <div className="inline-block w-[20px] h-[20px] border-2 border-[#1da1f2] border-t-transparent rounded-full animate-spin" />
                    <div className="text-[12px] text-[#657786] mt-[6px]">Loading more tweets...</div>
                  </div>
                )}
              </>
            )}
          </div>
          <div ref={sentinelRef} className="h-1" />
        </div>

        {/* Right sidebar - Who to follow */}
        <RightSidebar />
      </div>
    </div>
  );
}
