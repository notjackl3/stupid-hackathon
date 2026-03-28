import { useState, useEffect, type KeyboardEvent } from 'react';
import type { Tweet, TwitterQueryData } from '../../types';
import { searchTwitter } from '../../lib/fuzzySearch';
import { TrendingSidebar } from './TrendingSidebar';
import twitterData from '../../data/twitterResults.json';

interface TwitterFeedProps {
  query: string;
  onSearch: (query: string) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  egg: '#e1e8ed',
  default: '#1da1f2',
  selfie: '#e0245e',
  anime: '#794bc4',
  dog: '#f45d22',
  sunset: '#ffad1f',
  logo: '#17bf63',
};

function TweetCard({ tweet }: { tweet: Tweet }) {
  const bgColor = AVATAR_COLORS[tweet.avatar] ?? AVATAR_COLORS.default;
  const isEgg = tweet.avatar === 'egg';

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#e6ecf0] hover:bg-[#f5f8fa] cursor-pointer">
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {isEgg ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#657786">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        ) : (
          tweet.displayName[0].toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-sm text-[#14171a]">{tweet.displayName}</span>
          {tweet.verified && (
            <span className="text-[#1da1f2] text-xs">&#10003;</span>
          )}
          <span className="text-sm text-[#657786]">@{tweet.handle}</span>
          <span className="text-sm text-[#657786]">&middot;</span>
          <span className="text-sm text-[#657786]">{tweet.timestamp}</span>
        </div>
        <p className="text-sm text-[#14171a] mt-1 whitespace-pre-wrap">{tweet.text}</p>
        <div className="flex items-center gap-12 mt-2 text-[#657786]">
          <button className="flex items-center gap-1 text-xs hover:text-[#1da1f2] cursor-pointer">
            <span>&#128172;</span> {tweet.replies > 0 ? tweet.replies : ''}
          </button>
          <button className="flex items-center gap-1 text-xs hover:text-[#17bf63] cursor-pointer">
            <span>&#128257;</span> {tweet.retweets > 0 ? tweet.retweets.toLocaleString() : ''}
          </button>
          <button className="flex items-center gap-1 text-xs hover:text-[#e0245e] cursor-pointer">
            <span>&#9829;</span> {tweet.likes > 0 ? tweet.likes.toLocaleString() : ''}
          </button>
          <button className="text-xs hover:text-[#1da1f2] cursor-pointer">
            <span>&#128233;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function TwitterFeed({ query, onSearch }: TwitterFeedProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(query);
    setLoading(true);

    const delay = 500 + Math.random() * 300;
    const timer = setTimeout(() => {
      const data = twitterData as Record<string, TwitterQueryData>;

      if (!query) {
        // Show trending feed
        const trending = data['_trending'];
        setTweets(trending?.tweets ?? []);
      } else {
        const match = searchTwitter(data, query);
        if (match) {
          setTweets(match.results.tweets);
        } else {
          // Show trending with a "no results" message
          setTweets([]);
        }
      }
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="min-h-full bg-[#e6ecf0]">
      {/* Twitter Header */}
      <div className="bg-white border-b border-[#e6ecf0] shadow-sm">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 h-[46px]">
          {/* Left nav */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer font-bold">Home</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer">Moments</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer">Notifications</span>
            <span className="text-sm text-[#657786] hover:text-[#1da1f2] cursor-pointer">Messages</span>
          </div>

          {/* Logo */}
          <div className="text-[#1da1f2] text-2xl cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
            </svg>
          </div>

          {/* Search + Profile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#e6ecf0] rounded-full px-3 py-1">
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
            <div className="w-8 h-8 rounded-full bg-[#1da1f2] flex items-center justify-center text-white text-sm cursor-pointer">U</div>
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
              <div className="w-16 h-16 rounded-full border-4 border-white bg-[#1da1f2] flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
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
          <div className="bg-white rounded-lg mb-2 p-4 border border-[#e6ecf0]">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1da1f2] flex items-center justify-center text-white font-bold flex-shrink-0">U</div>
              <div className="flex-1">
                <textarea
                  placeholder="What's happening?"
                  className="w-full outline-none text-sm text-[#14171a] resize-none h-[50px]"
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
            <div className="bg-white rounded-lg mb-2 p-3 border border-[#e6ecf0]">
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
            ) : tweets.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#657786]">
                No tweets found for "{query}". Twitter in 2016 doesn't know what this is.
              </div>
            ) : (
              tweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))
            )}
          </div>
        </div>

        {/* Right sidebar - Trends */}
        <TrendingSidebar onTrendClick={onSearch} />
      </div>
    </div>
  );
}
