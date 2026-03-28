import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import type { Tweet, TwitterQueryData } from '../../types';
import { searchTwitter } from '../../lib/fuzzySearch';
import { TrendingSidebar } from './TrendingSidebar';
import twitterData from '../../data/twitterResults.json';

interface TwitterFeedProps {
  query: string;
  onSearch: (query: string) => void;
}

const TWEETS_PER_BATCH = 5;

// Google Favicon API for brand logos, Wikipedia for public figures
const G = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const W = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`;

const REAL_AVATARS: Record<string, string> = {
  // Brands / media
  BuzzFeed: G('buzzfeed.com'),
  BuzzFeedTech: G('buzzfeed.com'),
  CNN: G('cnn.com'),
  cabordsreaking: G('cnn.com'),
  CNNPolitics: G('cnn.com'),
  CNNTech: G('cnn.com'),
  BBCBreaking: G('bbc.com'),
  CNBC: G('cnbc.com'),
  Apple: G('apple.com'),
  Google: G('google.com'),
  googleplus: G('google.com'),
  YouTube: G('youtube.com'),
  netflix: G('netflix.com'),
  instagram: G('instagram.com'),
  Snapchat: G('snapchat.com'),
  Uber: G('uber.com'),
  SpaceX: G('spacex.com'),
  PokemonGoApp: G('pokemongolive.com'),
  SamsungMobile: G('samsung.com'),
  PrimeVideo: G('primevideo.com'),
  espn: G('espn.com'),
  HuffPost: G('huffpost.com'),
  WIRED: G('wired.com'),
  TheEconomist: G('economist.com'),
  WebMD: G('webmd.com'),
  verge: G('theverge.com'),
  jpmorgan: G('jpmorgan.com'),
  nbcsnl: G('nbc.com'),
  CollegeHumor: G('collegehumor.com'),
  FTC: G('ftc.gov'),
  CincinnatiZoo: G('cincinnatizoo.org'),
  NateSilver538: G('fivethirtyeight.com'),
  DudePerfect: G('dudeperfect.com'),
  business: G('bloomberg.com'),
  // People
  POTUS: W('8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg'),
  elonmusk: W('3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg'),
  tim_cook: W('e/e1/Tim_Cook_%282017%2C_cropped%29.jpg/220px-Tim_Cook_%282017%2C_cropped%29.jpg'),
  WarrenBuffett: W('5/51/Warren_Buffett_KU_Visit.jpg/220px-Warren_Buffett_KU_Visit.jpg'),
  TheEllenShow: W('b/b8/Ellen_DeGeneres_2011.jpg/220px-Ellen_DeGeneres_2011.jpg'),
  djkhaled: W('e/e3/DJ_Khaled_2019_by_Glenn_Francis.jpg/220px-DJ_Khaled_2019_by_Glenn_Francis.jpg'),
};

function getAvatarUrl(handle: string): string {
  return REAL_AVATARS[handle] ?? `https://i.pravatar.cc/96?u=${encodeURIComponent(handle)}`;
}

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
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1da1f2] flex-shrink-0">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </svg>
  );
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-[#e6ecf0] hover:bg-[#f5f8fa] cursor-pointer">
      {/* Avatar */}
      <img
        src={getAvatarUrl(tweet.handle)}
        alt={tweet.displayName}
        className="w-12 h-12 rounded-full flex-shrink-0 bg-[#e1e8ed]"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-sm text-[#14171a]">{tweet.displayName}</span>
          {tweet.verified && <VerifiedBadge />}
          <span className="text-sm text-[#657786]">@{tweet.handle}</span>
          <span className="text-sm text-[#657786]">&middot;</span>
          <span className="text-sm text-[#657786]">{tweet.timestamp}</span>
        </div>
        <p className="text-sm text-[#14171a] mt-1 whitespace-pre-wrap">{renderTweetText(tweet.text)}</p>
        <div className="flex items-center gap-12 mt-3 text-[#657786]">
          {/* Reply */}
          <button className="group flex items-center gap-1.5 text-xs hover:text-[#1da1f2] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#657786] group-hover:fill-[#1da1f2]">
              <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
            </svg>
            {tweet.replies > 0 ? tweet.replies : ''}
          </button>
          {/* Retweet */}
          <button className="group flex items-center gap-1.5 text-xs hover:text-[#17bf63] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#657786] group-hover:fill-[#17bf63]">
              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z" />
            </svg>
            {tweet.retweets > 0 ? tweet.retweets.toLocaleString() : ''}
          </button>
          {/* Like */}
          <button className="group flex items-center gap-1.5 text-xs hover:text-[#e0245e] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#657786] group-hover:fill-[#e0245e]">
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z" />
            </svg>
            {tweet.likes > 0 ? tweet.likes.toLocaleString() : ''}
          </button>
          {/* Share */}
          <button className="group flex items-center gap-1.5 text-xs hover:text-[#1da1f2] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#657786] group-hover:fill-[#1da1f2]">
              <path d="M17.53 7.77l-5.396-5.396c-.293-.293-.768-.293-1.06 0l-5.396 5.396c-.293.293-.293.768 0 1.06s.768.294 1.06 0L10.69 4.88v11.25c0 .414.336.75.75.75s.75-.336.75-.75V4.88l3.952 3.952c.147.146.34.22.53.22s.384-.073.53-.22c.294-.293.294-.768 0-1.06z" />
            </svg>
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
      const data = twitterData as Record<string, TwitterQueryData>;
      let fetched: Tweet[] = [];

      if (!query) {
        const trending = data['_trending'];
        fetched = trending?.tweets ?? [];
      } else {
        const match = searchTwitter(data, query);
        if (match) {
          fetched = match.results.tweets;
        }
      }

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

  return (
    <div className="min-h-full w-full bg-[#e6ecf0]">
      {/* Twitter Header */}
      <div className="bg-white border-b border-[#e6ecf0] shadow-sm">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 h-[50px]">
          {/* Left nav */}
          <div className="flex items-center gap-6 h-full">
            <span className="text-sm text-[#1da1f2] font-bold cursor-pointer h-full flex items-center border-b-2 border-[#1da1f2]">Home</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer h-full flex items-center border-b-2 border-transparent">Moments</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer h-full flex items-center border-b-2 border-transparent">Notifications</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer h-full flex items-center border-b-2 border-transparent">Messages</span>
          </div>

          {/* Logo */}
          <div className="text-[#1da1f2] text-2xl cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </svg>
          </div>

          {/* Search + Profile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#e6ecf0] rounded-full px-3 py-1.5">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Twitter"
                className="bg-transparent outline-none text-sm w-[200px] text-[#14171a]"
              />
              <svg className="w-4 h-4 text-[#657786] cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
            <button className="bg-[#1da1f2] text-white rounded-full px-4 py-1.5 text-sm font-bold hover:bg-[#1a91da] cursor-pointer">
              Tweet
            </button>
            <img
              src={getAvatarUrl('user2016')}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer bg-[#e1e8ed]"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1100px] mx-auto flex gap-4 px-4 py-4">
        {/* Left sidebar - Profile card */}
        <div className="w-[290px] flex-shrink-0">
          <div className="bg-white rounded-lg overflow-hidden mb-4">
            <div className="h-[95px] bg-[#1da1f2]" />
            <div className="px-4 pb-4 -mt-8">
              <img
                src={getAvatarUrl('user2016')}
                alt="User"
                className="w-16 h-16 rounded-full border-4 border-white bg-[#e1e8ed]"
              />
              <div className="mt-2">
                <div className="font-bold text-[#14171a]">User</div>
                <div className="text-sm text-[#657786]">@user2016</div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div><span className="font-bold text-[#14171a]">247</span> <span className="text-[#657786]">Tweets</span></div>
                <div><span className="font-bold text-[#14171a]">142</span> <span className="text-[#657786]">Following</span></div>
                <div><span className="font-bold text-[#14171a]">89</span> <span className="text-[#657786]">Followers</span></div>
              </div>
            </div>
          </div>

          {/* Where's the edit button joke */}
          <div className="bg-[#fffde7] border border-[#ffecb3] rounded-lg p-3 text-xs text-[#827717]">
            <strong>Pro tip:</strong> Looking for an edit button? So is everyone else. It doesn't exist. Yet.
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 min-w-0">
          {/* Compose tweet */}
          <div className="bg-white rounded-lg mb-3 p-4 border border-[#e6ecf0]">
            <div className="flex gap-3">
              <img
                src={getAvatarUrl('user2016')}
                alt="You"
                className="w-10 h-10 rounded-full flex-shrink-0 bg-[#e1e8ed]"
              />
              <div className="flex-1">
                <textarea
                  placeholder="What's happening?"
                  className="w-full outline-none text-sm text-[#14171a] resize-none h-[60px]"
                  maxLength={140}
                />
                <div className="flex justify-between items-center mt-1 border-t border-[#e6ecf0] pt-2">
                  <span className="text-xs text-[#657786]">140 characters max</span>
                  <button className="bg-[#1da1f2] text-white rounded-full px-4 py-1 text-sm font-bold cursor-pointer">Tweet</button>
                </div>
              </div>
            </div>
          </div>

          {/* Search header */}
          {query && (
            <div className="bg-white rounded-lg mb-3 p-4 border border-[#e6ecf0]">
              <span className="text-sm text-[#657786]">Search results for </span>
              <span className="text-sm font-bold text-[#14171a]">"{query}"</span>
            </div>
          )}

          {/* Tweets */}
          <div className="bg-white rounded-lg border border-[#e6ecf0]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-[#1da1f2] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : displayedTweets.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#657786]">
                No tweets found for "{query}". Twitter in 2016 doesn't know what this is.
              </div>
            ) : (
              <>
                {displayedTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
                {loadingMore && (
                  <div className="p-6 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-[#1da1f2] border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs text-[#657786] mt-2">Loading more tweets...</div>
                  </div>
                )}
              </>
            )}
          </div>
          <div ref={sentinelRef} className="h-1" />
        </div>

        {/* Right sidebar - Trends */}
        <TrendingSidebar onTrendClick={onSearch} />
      </div>
    </div>
  );
}
